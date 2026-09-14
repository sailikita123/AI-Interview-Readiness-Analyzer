import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/AnalysisContext.jsx";
import { fetchInterviewReport } from "../services/api.js";

export default function Report() {
  const navigate = useNavigate();
  const location = useLocation();
  const { targetRole, result } = useAnalysis();
  const [report, setReport] = useState(null);
  const transcript = location.state?.transcript;

  useEffect(() => {
    if (!transcript) {
      navigate("/start");
      return;
    }
    fetchInterviewReport({ targetRole, transcript }).then(setReport);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-paperDim">Building your report…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 py-16">
      <p className="text-paperDim text-sm mb-1">Interview report — {targetRole}</p>
      <p className="font-display text-7xl mb-8">{report.overallScore}</p>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <ScoreBlock label="Technical" value={report.technicalScore} />
        <ScoreBlock label="Communication" value={report.communicationScore} />
      </div>

      <p className="text-paperDim leading-relaxed mb-10">{report.summary}</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-display text-lg mb-3 text-good">Strengths</h3>
          <ul className="flex flex-col gap-2">
            {report.strengths?.map((s) => (
              <li key={s} className="text-sm text-paperDim">
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg mb-3 text-gap">Focus next</h3>
          <ul className="flex flex-col gap-2">
            {report.improvementAreas?.map((s) => (
              <li key={s} className="text-sm text-paperDim">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-3 mt-12">
        <button
          onClick={() => navigate("/roadmap")}
          className="bg-accent text-ink font-display font-semibold px-6 py-3 rounded-md"
        >
          Back to roadmap
        </button>
        <button
          onClick={() => navigate("/dashboard")}
          className="border border-panelBorder rounded-md px-6 py-3 font-display hover:border-accent transition"
        >
          View readiness dashboard
        </button>
      </div>
    </div>
  );
}

function ScoreBlock({ label, value }) {
  return (
    <div className="bg-panel border border-panelBorder rounded-lg p-4">
      <p className="text-paperDim text-sm mb-1">{label}</p>
      <p className="font-display text-3xl">{value}</p>
    </div>
  );
}
