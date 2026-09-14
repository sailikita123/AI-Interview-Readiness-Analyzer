import { Routes, Route } from "react-router-dom";
import { AnalysisProvider } from "./AnalysisContext.jsx";
import Landing from "./Landing.jsx";
import InputFlow from "./InputFlow.jsx";
import Dashboard from "./Dashboard.jsx";
import Roadmap from "./Roadmap.jsx";
import Interview from "./Interview.jsx";
import Report from "./Report.jsx";
export default function App() {
  return (
    <AnalysisProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/start" element={<InputFlow />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </AnalysisProvider>
  );
}
