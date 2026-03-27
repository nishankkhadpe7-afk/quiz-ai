// --- Quiz Utility Functions & Constants ---

export const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];

export const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20];

/**
 * Returns performance feedback based on score percentage.
 * @param {number} score
 * @param {number} total
 * @returns {{ message: string, emoji: string }}
 */
export const getPerformanceFeedback = (score, total) => {
  if (total === 0) return { message: "No questions answered.", emoji: "🤷" };

  const pct = Math.round((score / total) * 100);

  if (pct <= 20) return { message: "Needs improvement. Keep practicing.", emoji: "📚" };
  if (pct <= 50) return { message: "Decent attempt. Build stronger fundamentals.", emoji: "💪" };
  if (pct <= 75) return { message: "Good job. You're getting there.", emoji: "👍" };
  if (pct <= 90) return { message: "Great job! Strong understanding.", emoji: "🌟" };
  return { message: "Excellent! Mastery level.", emoji: "🏆" };
};

/**
 * Returns a difficulty description label for display.
 */
export const getDifficultyLabel = (difficulty) => {
  const labels = {
    Easy: "Basic Recall",
    Medium: "Conceptual",
    Hard: "Advanced",
  };
  return labels[difficulty] || difficulty;
};
