import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/AnalysisContext.jsx";
import { sendInterviewTurn } from "../services/api.js";

const TOTAL_QUESTIONS = 8;

export default function Interview() {
  const navigate = useNavigate();
  const { result, targetRole } = useAnalysis();
  const [history, setHistory] = useState([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!result) {
      navigate("/start");
      return;
    }
    askNext([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  async function askNext(currentHistory, candidateAnswer) {
    setLoading(true);
    try {
      const topRepo = result?.github?.recentRepoNames?.[0];
      const { turn, history: updated } = await sendInterviewTurn({
        targetRole,
        topRepo,
        history: currentHistory,
        mode: questionCount < 5 ? "technical" : "HR",
        answer: candidateAnswer,
      });
      setHistory(updated);
      setQuestionCount((c) => c + 1);
      if (turn.type === "closing" || questionCount + 1 >= TOTAL_QUESTIONS) {
        setTimeout(() => navigate("/report", { state: { transcript: updated } }), 1200);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSend() {
    if (!answer.trim()) return;
    const submitted = answer;
    setAnswer("");
    askNext(history, submitted);
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 py-10 flex flex-col h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-xl">Mock interview</h1>
        <span className="text-sm text-paperDim">
          Question {Math.min(questionCount, TOTAL_QUESTIONS)}/{TOTAL_QUESTIONS} ·{" "}
          {questionCount < 5 ? "Technical" : "HR"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pb-4">
        {history.map((turn, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed ${
              turn.role === "interviewer"
                ? "bg-panel border border-panelBorder self-start"
                : "bg-accent text-ink self-end"
            }`}
          >
            {turn.message}
          </div>
        ))}
        {loading && (
          <div className="self-start text-paperDim text-sm px-4 py-2">Thinking…</div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t border-panelBorder pt-4">
        <textarea
          className="input h-20 resize-none"
          placeholder="Type your answer…"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !answer.trim()}
          className="bg-accent text-ink font-display font-semibold px-5 rounded-md disabled:opacity-30"
        >
          Send
        </button>
      </div>
    </div>
  );
}
