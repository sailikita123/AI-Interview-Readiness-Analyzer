import axios from "axios";

const MODEL = process.env.LLM_MODEL || "claude-sonnet-4-6";

/**
 * Thin wrapper around the Anthropic Messages API that forces JSON-only
 * output. This is the one function every AI feature in this app routes
 * through — swap the body of this function if you switch providers.
 */
async function callLLM({ system, prompt, maxTokens = 2000 }) {
  const { data } = await axios.post(
    "https://api.anthropic.com/v1/messages",
    {
      model: MODEL,
      max_tokens: maxTokens,
      system,
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
    }
  );

  const text = data.content.map((block) => block.text || "").join("\n");
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

/**
 * The core "measurable results" step: takes raw signals from GitHub,
 * LeetCode, and resume text, and returns a structured score breakdown
 * instead of a paragraph of prose.
 */
export async function scoreReadiness({ github, leetcode, resumeText, targetRole }) {
  const system = `You are a strict technical interview readiness evaluator.
Respond with ONLY a raw JSON object — no markdown fences, no preamble, no explanation outside the JSON.
Scores are 0-100 integers. Be honest and specific; do not default to round numbers like 70/80/90 unless genuinely warranted.`;

  const prompt = `Evaluate this candidate's readiness for a "${targetRole}" role using the signals below.

GITHUB SIGNALS:
${JSON.stringify(github, null, 2)}

LEETCODE SIGNALS:
${JSON.stringify(leetcode, null, 2)}

RESUME TEXT:
${resumeText || "(not provided)"}

Return JSON in exactly this shape:
{
  "scores": {
    "dsa": <int>,
    "development": <int>,
    "github": <int>,
    "resume": <int>,
    "sqlDbms": <int>
  },
  "overallReadiness": <int, weighted average>,
  "missingSkills": [<string>, ...max 6],
  "strengths": [<string>, ...max 4],
  "reasoning": {
    "dsa": "<1 sentence, cite the actual LeetCode numbers>",
    "development": "<1 sentence, cite actual repo/language signals>",
    "github": "<1 sentence>",
    "resume": "<1 sentence>",
    "sqlDbms": "<1 sentence>"
  }
}`;

  return callLLM({ system, prompt, maxTokens: 1200 });
}

/**
 * Generates a day-by-day roadmap. The topic backbone is passed in from
 * roadmapTemplate.js (deterministic, not LLM-generated) so the sequence
 * stays sound — the LLM's job is to personalize pacing and add short
 * notes per day based on the candidate's actual gaps.
 */
export async function personalizeRoadmap({ missingSkills, weakestAreas, days }) {
  const system = `You are a technical interview prep coach. Respond with ONLY a raw JSON array — no markdown, no preamble.`;

  const prompt = `The candidate's weakest scoring areas are: ${weakestAreas.join(", ")}.
Their explicitly missing skills are: ${missingSkills.join(", ")}.

Here is a base 30-day topic skeleton:
${JSON.stringify(days, null, 2)}

Personalize it: reorder or swap in topics from the missing-skills list where it makes sense,
and add a one-sentence "focus" note per day tailored to this candidate. Keep exactly the same
array length and day numbers. Return JSON array in the same shape as the input, each item with
an added "focus" field.`;

  return callLLM({ system, prompt, maxTokens: 2500 });
}

/**
 * Generates the next interview question given conversation history.
 * Keeping this stateless (history passed in each call) means the backend
 * needs no session store beyond whatever you persist in the DB.
 */
export async function nextInterviewTurn({ targetRole, topRepo, history, mode }) {
  const system = `You are conducting a ${mode} interview for a ${targetRole} candidate.
Ask one question at a time. If the previous answer was vague or incomplete, ask a sharp follow-up
instead of moving on. Respond with ONLY raw JSON, no markdown fences.`;

  const prompt = `Candidate's most relevant project: ${topRepo || "not available"}.

Conversation so far:
${JSON.stringify(history, null, 2)}

Return JSON:
{
  "type": "question" | "followup" | "closing",
  "message": "<the question or closing remark>",
  "evaluatesPrevious": {
    "score": <int 0-10, or null if this is the first question>,
    "note": "<short reason, or null>"
  }
}`;

  return callLLM({ system, prompt, maxTokens: 500 });
}

/**
 * Final interview report — separate call at the end of a session so the
 * evaluation has the full transcript to reason over, not just one turn.
 */
export async function generateInterviewReport({ targetRole, transcript }) {
  const system = `You are summarizing a completed mock interview. Respond with ONLY raw JSON, no markdown fences.`;

  const prompt = `Target role: ${targetRole}
Full transcript:
${JSON.stringify(transcript, null, 2)}

Return JSON:
{
  "overallScore": <int 0-100>,
  "communicationScore": <int 0-100>,
  "technicalScore": <int 0-100>,
  "strengths": [<string>, ...max 4],
  "improvementAreas": [<string>, ...max 4],
  "summary": "<2-3 sentence overall verdict>"
}`;

  return callLLM({ system, prompt, maxTokens: 800 });
}
