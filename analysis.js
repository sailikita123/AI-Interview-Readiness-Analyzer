import { Router } from "express";
import { analyzeGithubProfile } from "../services/github.js";
import { analyzeLeetcodeProfile } from "../services/leetcode.js";
import { scoreReadiness, personalizeRoadmap } from "../services/llm.js";
import { baseRoadmap } from "../services/roadmapTemplate.js";
import { resumeUpload, extractResumeText } from "../middleware/resumeUpload.js";

const router = Router();

// ROLE_SKILL_MATRIX drives the "job match %" — deterministic, not LLM output,
// so the number is reproducible and explainable to the user.
const ROLE_SKILL_MATRIX = {
  "Software Engineer": ["DSA", "System Design", "OOP", "SQL", "Git/GitHub", "REST APIs"],
  "Backend Developer": ["DSA", "SQL", "System Design", "APIs", "Databases", "Caching"],
  "Full-Stack Developer": ["DSA", "React", "Node.js", "SQL", "REST APIs", "Deployment"],
  "Data Analyst": ["SQL", "Python", "Statistics", "Excel", "Data Visualization", "A/B Testing"],
};

router.post("/analyze", resumeUpload, extractResumeText, async (req, res) => {
  try {
    const { githubUsername, leetcodeUsername, targetRole } = req.body;
    if (!githubUsername || !targetRole) {
      return res.status(400).json({ error: "githubUsername and targetRole are required" });
    }

    const [github, leetcode] = await Promise.all([
      analyzeGithubProfile(githubUsername).catch((e) => ({ error: e.message })),
      leetcodeUsername
        ? analyzeLeetcodeProfile(leetcodeUsername).catch((e) => ({ error: e.message }))
        : Promise.resolve(null),
    ]);

    const readiness = await scoreReadiness({
      github,
      leetcode,
      resumeText: req.resumeText,
      targetRole,
    });

    const weakestAreas = Object.entries(readiness.scores)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 2)
      .map(([area]) => area);

    const roadmap = await personalizeRoadmap({
      missingSkills: readiness.missingSkills,
      weakestAreas,
      days: baseRoadmap(),
    });

    const requiredSkills = ROLE_SKILL_MATRIX[targetRole] || ROLE_SKILL_MATRIX["Software Engineer"];
    const missingCount = readiness.missingSkills.filter((s) =>
      requiredSkills.some((req) => req.toLowerCase().includes(s.toLowerCase()))
    ).length;

    res.json({
      github,
      leetcode,
      readiness,
      roadmap,
      jobMatch: {
        targetRole,
        matchPercent: Math.max(
          0,
          Math.round(((requiredSkills.length - missingCount) / requiredSkills.length) * 100)
        ),
        requiredSkills,
        missingSkills: readiness.missingSkills,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed", detail: err.message });
  }
});

export default router;
