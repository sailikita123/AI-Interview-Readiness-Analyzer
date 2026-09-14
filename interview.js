import { Router } from "express";
import { nextInterviewTurn, generateInterviewReport } from "../services/llm.js";

const router = Router();

// POST /api/interview/turn
// Stateless by design: the client (or DB) keeps the transcript and
// re-sends it each turn. Keeps the backend simple to scale.
router.post("/turn", async (req, res) => {
  try {
    const { targetRole, topRepo, history = [], mode = "technical", answer } = req.body;

    const updatedHistory = answer
      ? [...history, { role: "candidate", message: answer }]
      : history;

    const turn = await nextInterviewTurn({
      targetRole,
      topRepo,
      history: updatedHistory,
      mode,
    });

    res.json({
      turn,
      history: [...updatedHistory, { role: "interviewer", message: turn.message }],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Interview turn failed", detail: err.message });
  }
});

// POST /api/interview/report
router.post("/report", async (req, res) => {
  try {
    const { targetRole, transcript } = req.body;
    const report = await generateInterviewReport({ targetRole, transcript });
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Report generation failed", detail: err.message });
  }
});

export default router;
