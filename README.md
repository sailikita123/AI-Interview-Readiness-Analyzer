# ReadySet — AI Interview Readiness Analyzer

Reads a candidate's GitHub, LeetCode, and resume, scores them against a target role across
five categories, and generates a personalized 30-day roadmap plus an adaptive mock interview.

```
GitHub ───┐
LeetCode ─┤──→ Skill Analysis (LLM) ──→ Readiness Score ──→ Roadmap ──→ Mock Interview ──→ Report
Resume ───┘
```

## Why this isn't "just an AI chatbot"

Every AI call in this app returns structured JSON (scores, gaps, a report shape), never a
paragraph of prose to display as-is. The role-skill matrix and the roadmap's day-ordering are
hardcoded, not LLM-generated — the LLM personalizes within a sequence that's guaranteed to make
pedagogical sense.

## Stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite + Tailwind + Recharts |
| Backend | Node.js + Express |
| AI | Anthropic Messages API (JSON-mode prompting) |
| Resume parsing | pdf-parse |
| GitHub data | GitHub REST API (public, unauthenticated works) |
| LeetCode data | LeetCode's public GraphQL endpoint |

## Running it locally

**Backend**
```bash
cd backend
npm install
cp .env.example .env   # add your ANTHROPIC_API_KEY
npm run dev            # http://localhost:5000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev             # http://localhost:5173, proxies /api to :5000
```

## Project structure

```
ai-interview-readiness-analyzer/
├── backend/
│   ├── routes/          analysis.js, interview.js
│   ├── services/        github.js, leetcode.js, llm.js, roadmapTemplate.js
│   ├── middleware/       resumeUpload.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── pages/        Landing, InputFlow, Dashboard, Roadmap, Interview, Report
│       ├── context/       AnalysisContext.jsx
│       └── services/      api.js
└── screenshots/
```

## What's stubbed vs real

- GitHub and LeetCode analysis hit real public APIs — no mocking.
- The LLM calls need a real `ANTHROPIC_API_KEY` in `backend/.env`.
- LinkedIn is intentionally **not** scraped (fragile, ToS-risky) — a future version could accept
  a pasted summary instead.
- No database yet — analysis results live in frontend memory for the session. Adding
  MongoDB/Postgres to persist past reports and roadmap progress is the natural next step.

## Roadmap for this project itself

- [ ] Persist analysis history per user (auth + DB)
- [ ] Add a job-description paste box to sharpen the job-match %
- [ ] Voice-based mock interview mode
- [ ] Deploy: frontend → Vercel, backend → Render
