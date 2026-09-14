import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/AnalysisContext.jsx";
import { submitAnalysis } from "../services/api.js";

const ROLES = ["Software Engineer", "Backend Developer", "Full-Stack Developer", "Data Analyst"];

const ANALYZING_MESSAGES = [
  "Reading your GitHub repos…",
  "Checking LeetCode submission history…",
  "Parsing your resume…",
  "Scoring DSA fundamentals…",
  "Comparing against role requirements…",
  "Building your roadmap…",
];

export default function InputFlow() {
  const navigate = useNavigate();
  const { setResult, targetRole, setTargetRole } = useAnalysis();

  const [githubUsername, setGithubUsername] = useState("");
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState("");

  const canSubmit = githubUsername.trim().length > 0 && targetRole;

  async function handleSubmit() {
    setError("");
    setLoading(true);
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % ANALYZING_MESSAGES.length);
    }, 1600);

    try {
      const data = await submitAnalysis({ githubUsername, leetcodeUsername, targetRole, resumeFile });
      setResult(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong — check the usernames and try again.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-14 h-14 rounded-full border-2 border-panelBorder border-t-accent animate-spin mb-8" />
        <p className="font-display text-xl text-center max-w-sm">
          {ANALYZING_MESSAGES[messageIndex]}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl mb-2">Tell us where to look</h1>
      <p className="text-paperDim mb-10">Only the GitHub username and target role are required.</p>

      <div className="grid md:grid-cols-2 gap-4">
        <InputCard
          label="GitHub username"
          done={githubUsername.trim().length > 0}
          required
        >
          <input
            className="input"
            placeholder="e.g. sailikita123"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
          />
        </InputCard>

        <InputCard label="LeetCode username" done={leetcodeUsername.trim().length > 0}>
          <input
            className="input"
            placeholder="optional"
            value={leetcodeUsername}
            onChange={(e) => setLeetcodeUsername(e.target.value)}
          />
        </InputCard>

        <InputCard label="Resume (PDF)" done={!!resumeFile}>
          <label className="flex items-center justify-center h-11 border border-dashed border-panelBorder rounded-md text-sm text-paperDim cursor-pointer hover:border-accent transition">
            {resumeFile ? resumeFile.name : "Upload PDF"}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            />
          </label>
        </InputCard>

        <InputCard label="Target role" done={!!targetRole} required>
          <select
            className="input"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </InputCard>
      </div>

      {error && <p className="mt-6 text-gap text-sm">{error}</p>}

      <button
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="mt-10 bg-accent text-ink font-display font-semibold px-7 py-3.5 rounded-md text-lg disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition"
      >
        Run the analysis
      </button>
    </div>
  );
}

function InputCard({ label, done, required, children }) {
  return (
    <div className="bg-panel border border-panelBorder rounded-lg p-4">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-sm text-paperDim">
          {label}
          {required && <span className="text-accent"> *</span>}
        </span>
        {done && <span className="w-2 h-2 rounded-full bg-good" />}
      </div>
      {children}
    </div>
  );
}
