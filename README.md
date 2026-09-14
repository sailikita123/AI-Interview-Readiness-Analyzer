# ReadySet — AI Interview Readiness Analyzer

> **Turn your coding activity, resume, and development profile into an actionable interview preparation plan.**

ReadySet is a full-stack AI-powered platform that evaluates a candidate's **GitHub activity, LeetCode performance, and resume** against a target software role.

Instead of simply generating AI advice, ReadySet converts real candidate signals into:

* 📊 Interview Readiness Score
* 🎯 Skill Gap Analysis
* 💼 Role Match Score
* 🗺️ Personalized 30-Day Roadmap
* 🤖 Adaptive AI Mock Interview
* 📋 Post-Interview Performance Report

---

## 🚀 How It Works

```text
                 ┌──────────────┐
                 │    Resume    │
                 └──────┬───────┘
                        │
                 ┌──────▼───────┐
                 │    GitHub    │
                 └──────┬───────┘
                        │
                 ┌──────▼───────┐
                 │   LeetCode   │
                 └──────┬───────┘
                        │
                        ▼
              ┌────────────────────┐
              │   Skill Analysis   │
              │    + AI Evaluation │
              └─────────┬──────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
   Readiness Score  Skill Gaps    Job Match
          │             │             │
          └─────────────┼─────────────┘
                        ▼
              ┌────────────────────┐
              │ Personalized 30-Day│
              │      Roadmap       │
              └─────────┬──────────┘
                        │
                        ▼
              ┌────────────────────┐
              │  Adaptive Mock     │
              │     Interview      │
              └─────────┬──────────┘
                        │
                        ▼
              ┌────────────────────┐
              │ Interview Report   │
              └────────────────────┘
```

---

## ✨ Key Features

### 📊 Interview Readiness Analysis

Analyzes multiple candidate signals and produces scores across:

* DSA
* Development
* GitHub
* Resume
* SQL / DBMS

The system also calculates an overall readiness score and identifies the candidate's weakest areas.

---

### 💻 GitHub Analysis

Connects to the GitHub REST API to analyze public developer activity and repository signals.

The analysis can be used as part of the candidate's overall development and GitHub evaluation.

---

### 🧩 LeetCode Analysis

Uses LeetCode's public GraphQL endpoint to retrieve coding-profile signals.

These signals contribute to the DSA readiness evaluation.

---

### 📄 Resume Analysis

Upload a resume and extract its text for AI-powered evaluation against the selected target role.

---

### 🎯 Role-Based Job Matching

ReadySet uses a deterministic role-skill matrix to evaluate role alignment.

Currently supported roles include:

* Software Engineer
* Backend Developer
* Full-Stack Developer
* Data Analyst

Example:

```text
Target Role: Full-Stack Developer

Required Skills:
✓ DSA
✓ React
✓ Node.js
✓ SQL
✓ REST APIs
✓ Deployment
```

The job-match calculation is deterministic rather than allowing an LLM to invent the percentage.

---

### 🗺️ Personalized 30-Day Roadmap

The application starts with a predefined learning structure and uses AI to personalize the roadmap according to the candidate's:

* Missing skills
* Weakest areas
* Target role

Each day receives a focused recommendation instead of generic AI-generated advice.

---

### 🤖 Adaptive Mock Interview

The mock interview dynamically evaluates the candidate's responses.

The AI can:

* Ask technical questions
* Ask follow-up questions
* Evaluate previous answers
* Continue based on the conversation
* Close the interview when appropriate

This makes the interview conversational instead of a static question list.

---

### 📋 Interview Performance Report

After the interview, ReadySet generates a structured report containing:

* Overall score
* Technical score
* Communication score
* Strengths
* Improvement areas
* Overall evaluation

---

## 🧠 Why ReadySet Isn't Just Another AI Chatbot

The application is designed around **structured outputs and measurable signals**.

Instead of asking an LLM:

> "How good is this candidate?"

ReadySet combines real candidate data with structured AI evaluation.

```text
GitHub Data
     +
LeetCode Data
     +
Resume
     +
Target Role
     ↓
Structured AI Evaluation
     ↓
Scores + Skills + Gaps
     ↓
Personalized Action Plan
```

Important decisions are intentionally kept deterministic.

For example:

* Role skill requirements are defined in code.
* Job-match calculation is reproducible.
* The roadmap starts from a predefined topic structure.
* AI is used for personalization and evaluation rather than controlling every decision.

---

## 🛠️ Tech Stack

| Layer                  | Technology             |
| ---------------------- | ---------------------- |
| Frontend               | React                  |
| Build Tool             | Vite                   |
| Styling                | Tailwind CSS           |
| Charts                 | Recharts               |
| Backend                | Node.js                |
| API                    | Express.js             |
| HTTP Client            | Axios                  |
| AI                     | Anthropic Messages API |
| Resume Parsing         | pdf-parse              |
| Developer Data         | GitHub REST API        |
| Coding Data            | LeetCode GraphQL       |
| Authentication Support | JSON Web Token         |
| File Upload            | Multer                 |

---

## 📁 Project Structure

```text
ai-interview-readiness-analyzer/
│
├── backend/
│   ├── middleware/
│   │   └── resumeUpload.js
│   │
│   ├── routes/
│   │   ├── analysis.js
│   │   └── interview.js
│   │
│   ├── services/
│   │   ├── github.js
│   │   ├── leetcode.js
│   │   ├── llm.js
│   │   └── roadmapTemplate.js
│   │
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   │   └── AnalysisContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── InputFlow.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Roadmap.jsx
│   │   │   ├── Interview.jsx
│   │   │   └── Report.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── screenshots/
├── .gitignore
├── LICENSE
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-interview-readiness-analyzer.git

cd ai-interview-readiness-analyzer
```

### 2. Setup the backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
ANTHROPIC_API_KEY=your_api_key_here
LLM_MODEL=claude-sonnet-4-6
PORT=5000
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

### 3. Setup the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔐 Environment Variables

Never commit your API key.

Use:

```text
backend/.env.example
```

as the template for your local `.env` file.

Your `.env` file should remain excluded through `.gitignore`.

---

## 🔌 API Overview

### Analyze Candidate

```http
POST /api/analysis/analyze
```

Accepts candidate information including:

* GitHub username
* LeetCode username
* Target role
* Resume

Returns:

```text
GitHub analysis
LeetCode analysis
Readiness scores
Missing skills
Strengths
Personalized roadmap
Job-match score
```

### Interview API

The interview routes handle:

```text
Interview initialization
Question generation
Follow-up questions
Interview evaluation
Final interview report
```

---

## 🛡️ Design Decisions

### Structured AI Responses

AI features return structured JSON rather than uncontrolled paragraphs.

This allows the frontend to reliably display:

```text
Scores
↓
Skill gaps
↓
Roadmap
↓
Interview evaluation
```

### Deterministic Role Matching

Role requirements are stored in a predefined skill matrix.

This makes job-match calculations:

* Reproducible
* Explainable
* Easier to debug

### No LinkedIn Scraping

LinkedIn profiles are intentionally not scraped because automated scraping can be fragile and may create terms-of-service concerns.

A future implementation could allow users to provide a LinkedIn summary manually.

---

## 📸 Screenshots

Screenshots of the application are available in the [`screenshots`](./screenshots) directory.

Recommended showcase screens:

* Landing Page
* Candidate Input
* Dashboard
* Readiness Score
* Skill Gap Analysis
* 30-Day Roadmap
* Mock Interview
* Final Interview Report

---

## 🔮 Future Improvements

* [ ] User authentication
* [ ] PostgreSQL/MongoDB persistence
* [ ] Analysis history
* [ ] Job description matching
* [ ] Resume-to-JD comparison
* [ ] Progress tracking
* [ ] Voice-based mock interviews
* [ ] Interview difficulty selection
* [ ] More target roles
* [ ] Production deployment

---

## 🎯 Use Cases

ReadySet can help:

* Students preparing for placements
* Entry-level software engineers
* Developers switching roles
* Candidates preparing for technical interviews
* Students identifying missing skills before applying for jobs

---

## 👩‍💻 Author

**Samanthula Sai Likita**

B.Tech Computer Science Engineering
Mohan Babu University

Interested in:

```text
Java • DSA • Full-Stack Development • React • Node.js • SQL • AI
```

---

## 📄 License

This project is licensed under the MIT License.
