import { Routes, Route } from "react-router-dom";
import { AnalysisProvider } from "./context/AnalysisContext.jsx";
import Landing from "./pages/Landing.jsx";
import InputFlow from "./pages/InputFlow.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Roadmap from "./pages/Roadmap.jsx";
import Interview from "./pages/Interview.jsx";
import Report from "./pages/Report.jsx";

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
