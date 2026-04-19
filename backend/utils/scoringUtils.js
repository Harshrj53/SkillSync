/**
 * Score a single answer against a set of expected keywords.
 * Returns a score from 0 to the maximum marks for that question.
 *
 * Algorithm:
 *   Each matched keyword contributes equally.
 *   score = (matchedCount / totalKeywords) * maxScore
 *
 * @param {string} answer         - User's submitted answer
 * @param {string[]} keywords     - Expected keywords/phrases
 * @param {number} maxScore       - Maximum score for this question (default 10)
 * @returns {{ score: number, matched: string[], total: number }}
 */
const scoreAnswer = (answer, keywords, maxScore = 10) => {
  if (!answer || !keywords || keywords.length === 0) {
    return { score: 0, matched: [], total: keywords.length };
  }

  const normalizedAnswer = answer.toLowerCase().trim();

  const matched = keywords.filter((kw) =>
    normalizedAnswer.includes(kw.toLowerCase().trim())
  );

  const ratio = matched.length / keywords.length;
  const score = Math.round(ratio * maxScore);

  return { score, matched, total: keywords.length };
};

/**
 * Compute an aggregate score across multiple Q&A pairs.
 *
 * @param {Array<{ question: object, answer: string }>} submissions
 * @returns {{ totalScore: number, maxPossible: number, breakdown: Array }}
 */
const scoreInterview = (submissions) => {
  let totalScore = 0;
  let maxPossible = 0;
  const breakdown = [];

  for (const { question, answer } of submissions) {
    const maxScore = question.maxScore || 10;
    const result = scoreAnswer(answer, question.keywords, maxScore);
    totalScore += result.score;
    maxPossible += maxScore;

    breakdown.push({
      questionId: question.id,
      questionText: question.text,
      userAnswer: answer,
      matchedKeywords: result.matched,
      score: result.score,
      maxScore,
    });
  }

  return { totalScore, maxPossible, breakdown };
};

module.exports = { scoreAnswer, scoreInterview };
