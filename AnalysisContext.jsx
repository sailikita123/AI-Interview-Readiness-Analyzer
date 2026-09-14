import { createContext, useContext, useState } from "react";

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [result, setResult] = useState(null); // full /api/analyze response
  const [targetRole, setTargetRole] = useState("Software Engineer");

  return (
    <AnalysisContext.Provider value={{ result, setResult, targetRole, setTargetRole }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext);
  if (!ctx) throw new Error("useAnalysis must be used inside AnalysisProvider");
  return ctx;
}
