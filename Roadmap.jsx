import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "./AnalysisContext.jsx";

export default function Roadmap() {
  const navigate = useNavigate();
  const { result } = useAnalysis();
  const [openDay, setOpenDay] = useState(null);
  const [done, setDone] = useState({});

  if (!result) {
    navigate("/start");
    return null;
  }

  const roadmap = result.roadmap;
  const completedCount = Object.values(done).filter(Boolean).length;

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-6 py-14">
      <div className="flex items-baseline justify-between mb-2">
        <h1 className="font-display text-3xl">Your 30-day roadmap</h1>
        <span className="text-paperDim text-sm">
          {completedCount}/{roadmap.length} done
        </span>
      </div>
      <p className="text-paperDim mb-10">
        Sequenced by fundamentals first, personalized notes based on your actual gaps.
      </p>

      <div className="flex flex-col divide-y divide-panelBorder border-t border-b border-panelBorder">
        {roadmap.map((item) => {
          const isOpen = openDay === item.day;
          const isDone = !!done[item.day];
          return (
            <div key={item.day} className="py-3">
              <button
                onClick={() => setOpenDay(isOpen ? null : item.day)}
                className="w-full flex items-center gap-4 text-left"
              >
                <input
                  type="checkbox"
                  checked={isDone}
                  onChange={(e) => {
                    e.stopPropagation();
                    setDone((d) => ({ ...d, [item.day]: !d[item.day] }));
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 accent-[#E8A33D]"
                />
                <span className="text-paperDim text-sm w-14 shrink-0">Day {item.day}</span>
                <span className={`font-display flex-1 ${isDone ? "line-through text-paperDim" : ""}`}>
                  {item.topic}
                </span>
              </button>
              {isOpen && item.focus && (
                <p className="mt-2 ml-[4.5rem] text-sm text-paperDim leading-relaxed max-w-lg">
                  {item.focus}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate("/interview")}
        className="mt-10 bg-accent text-ink font-display font-semibold px-6 py-3 rounded-md hover:brightness-110 transition"
      >
        Ready — start mock interview
      </button>
    </div>
  );
}
