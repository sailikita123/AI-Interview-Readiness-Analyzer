import axios from "axios";

const client = axios.create({ baseURL: "/api" });

export async function submitAnalysis({ githubUsername, leetcodeUsername, targetRole, resumeFile }) {
  const form = new FormData();
  form.append("githubUsername", githubUsername);
  form.append("leetcodeUsername", leetcodeUsername || "");
  form.append("targetRole", targetRole);
  if (resumeFile) form.append("resume", resumeFile);

  const { data } = await client.post("/analyze", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function sendInterviewTurn(payload) {
  const { data } = await client.post("/interview/turn", payload);
  return data;
}

export async function fetchInterviewReport(payload) {
  const { data } = await client.post("/interview/report", payload);
  return data;
}
