// --- Quiz API ---
const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "";

const DIFFICULTY_DESCRIPTORS = {
  Easy: "basic recall and straightforward factual",
  Medium: "conceptual understanding and application-level",
  Hard: "tricky, applied, and edge-case-focused",
};

/**
 * Validates that a parsed question has the required shape.
 */
const isValidQuestion = (q) =>
  q &&
  typeof q.question === "string" &&
  Array.isArray(q.options) &&
  q.options.length === 4 &&
  typeof q.answer === "string" &&
  typeof q.explanation === "string";

/**
 * Fetches quiz questions from the OpenRouter API.
 * @param {{ topic: string, difficulty: string, questionCount: number }} params
 * @returns {Promise<Array>} Parsed array of question objects
 */
export const fetchQuizQuestions = async ({ topic, difficulty = "Medium", questionCount = 5 }) => {
  if (!apiKey) {
    throw new Error("API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.");
  }

  const difficultyDesc = DIFFICULTY_DESCRIPTORS[difficulty] || DIFFICULTY_DESCRIPTORS.Medium;

  const systemPrompt = `You are a professional assessment creator. Generate exactly ${questionCount} ${difficulty}-level (${difficultyDesc}) multiple choice questions about: "${topic}".

Rules:
- Exactly 4 options per question
- One correct answer per question
- Include a brief explanation for the correct answer
- No ambiguity in questions or options
- Match the ${difficulty} difficulty strictly
- Easy = basic recall, Medium = conceptual understanding, Hard = tricky / applied / edge cases

Respond ONLY with a valid JSON array. No markdown fences, no explanation outside the array.
Format: [{"question": "text", "options": ["A", "B", "C", "D"], "answer": "exact text of correct option", "explanation": "One clear sentence of context."}]`;

  const payload = {
    model: "google/gemini-2.0-flash-001",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `Topic: ${topic}` },
    ],
  };

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost",
      "X-Title": "Quiz Master Pro",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const result = await response.json();

  if (result.error) {
    throw new Error(result.error.message || "API returned an error.");
  }

  if (!result.choices?.[0]?.message?.content) {
    throw new Error("Invalid API response structure. No content returned.");
  }

  const content = result.choices[0].message.content;

  // Strip markdown fences if present
  const cleanJson = content.replace(/```json\s?|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleanJson);
  } catch {
    throw new Error("Failed to parse quiz data. The AI returned invalid JSON.");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("No questions were generated. Please try again.");
  }

  // Filter to only valid questions
  const validQuestions = parsed.filter(isValidQuestion);

  if (validQuestions.length === 0) {
    throw new Error("All generated questions had invalid format. Please try again.");
  }

  return validQuestions;
};
