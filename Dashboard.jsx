import { useNavigate } from "react-router-dom";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { useAnalysis } from "./AnalysisContext.jsx";

const LABELS = {
  dsa: "DSA",
  development: "Development",
  github: "GitHub",
  resume: "Resume",
  sqlDbms: "SQL / DBMS",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { result } = useAnalysis();

  if (!result) {
    return <EmptyState navigate={navigate} />;
  }

  const { readiness, jobMatch } = result;
  const chartData = Object.entries(readiness.scores).map(([key, value]) => ({
    category: LABELS[key] || key,
    score: value,
  }));

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6 py-14">
      <div className="flex items-baseline justify-between mb-10">
        <div>
          <p className="text-paperDim text-sm mb-1">Overall readiness</p>
          <p className="font-display text-6xl">
            {readiness.overallReadiness}
            <span className="text-2xl text-paperDim">%</span>
          </p>
        </div>
        <button
          onClick={() => navigate("/roadmap")}
          className="bg-accent text-ink font-display font-semibold px-6 py-3 rounded-md hover:brightness-110 transition"
        >
          Start my roadmap
        </button>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 bg-panel border border-panelBorder rounded-lg p-6 h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} outerRadius="75%">
              <PolarGrid stroke="#2A313B" />
              <PolarAngleAxis dataKey="category" tick={{ fill: "#8F97A3", fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="score" stroke="#E8A33D" fill="#E8A33D" fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="md:col-span-2 flex flex-col gap-4">
          {Object.entries(readiness.scores).map(([key, value]) => (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-paperDim">{LABELS[key] || key}</span>
                <span className="font-display">{value}%</span>
              </div>
              <div className="h-1.5 bg-ink rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="bg-panel border border-panelBorder rounded-lg p-6">
          <h3 className="font-display text-lg mb-4">Missing skills</h3>
          <div className="flex flex-wrap gap-2">
            {readiness.missingSkills?.map((skill) => (
              <span
                key={skill}
                className="text-sm bg-gap/15 text-gap border border-gap/30 rounded-full px-3 py-1"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-panel border border-panelBorder rounded-lg p-6">
          <h3 className="font-display text-lg mb-1">Job match — {jobMatch?.targetRole}</h3>
          <p className="font-display text-3xl mb-3">{jobMatch?.matchPercent}%</p>
          <p className="text-sm text-paperDim">
            {jobMatch?.missingSkills?.length || 0} skills short of the typical bar for this role.
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/interview")}
        className="mt-10 border border-panelBorder rounded-md px-6 py-3 font-display hover:border-accent transition"
      >
        Try the mock interview
      </button>
    </div>
  );
}

function EmptyState({ navigate }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="font-display text-2xl mb-3">No analysis yet</p>
      <p className="text-paperDim mb-6 max-w-sm">
        Run an analysis first — we need your GitHub, resume, and target role to build this.
      </p>
      <button
        onClick={() => navigate("/start")}
        className="bg-accent text-ink font-display font-semibold px-6 py-3 rounded-md"
      >
        Analyze my readiness
      </button>
    </div>
  );
}
