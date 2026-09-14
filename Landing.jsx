import { useNavigate } from "react-router-dom";

const steps = [
  {
    label: "Connect",
    body: "Point us at your GitHub, LeetCode, and resume. Thirty seconds, nothing to fill in by hand.",
  },
  {
    label: "Analyze",
    body: "We score you across five categories real interviewers actually check — not vibes.",
  },
  {
    label: "Improve",
    body: "A roadmap built from your specific gaps, plus a mock interview that adapts to your answers.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="max-w-5xl mx-auto w-full px-6 pt-8 flex items-center justify-between">
        <span className="font-display font-semibold text-lg tracking-tight">ReadySet</span>
        <span className="text-sm text-paperDim">interview readiness, measured</span>
      </header>

      <main className="max-w-5xl mx-auto w-full px-6 flex-1 flex flex-col justify-center py-20">
        <h1 className="font-display text-5xl md:text-6xl leading-[1.05] max-w-2xl">
          Know exactly where you stand before they ask.
        </h1>
        <p className="mt-6 text-lg text-paperDim max-w-xl leading-relaxed">
          Most interview prep tells you to "practice more." ReadySet reads your actual GitHub
          history, LeetCode activity, and resume, then tells you precisely which five areas
          are weak, and gives you thirty days to fix them.
        </p>

        <button
          onClick={() => navigate("/start")}
          className="mt-10 w-fit bg-accent text-ink font-display font-semibold px-7 py-3.5 rounded-md text-lg hover:brightness-110 transition"
        >
          Analyze my readiness
        </button>

        <div className="mt-24 grid md:grid-cols-3 gap-8 border-t border-panelBorder pt-10">
          {steps.map((step, i) => (
            <div key={step.label} className="relative">
              <div className="text-4xl font-display font-semibold text-panelBorder mb-3">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="font-display text-xl mb-2">{step.label}</h3>
              <p className="text-paperDim leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
