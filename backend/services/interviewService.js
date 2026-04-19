const interviewRepository = require('../repositories/interviewRepository');
const { scoreInterview } = require('../utils/scoringUtils');
const questions = require('../data/questions.json');

/**
 * Return all predefined interview questions (without revealing keywords).
 */
const getQuestions = () => {
  return questions.map(({ id, category, text, maxScore }) => ({
    id,
    category,
    text,
    maxScore,
  }));
};

/**
 * Submit interview answers, score them, save and return results.
 * @param {string} userId
 * @param {Array<{ questionId: string, answer: string }>} submissions
 */
const submitInterview = async (userId, submissions) => {
  if (!Array.isArray(submissions) || submissions.length === 0) {
    const err = new Error('Submissions array is required and must not be empty.');
    err.statusCode = 400;
    throw err;
  }

  // Map submitted answers to full question objects
  const questionMap = Object.fromEntries(questions.map((q) => [q.id, q]));

  const enriched = submissions.map(({ questionId, answer }) => {
    const question = questionMap[questionId];
    if (!question) {
      const err = new Error(`Question with ID "${questionId}" not found.`);
      err.statusCode = 400;
      throw err;
    }
    return { question, answer: answer || '' };
  });

  const { totalScore, maxPossible, breakdown } = scoreInterview(enriched);

  // Persist session
  const session = await interviewRepository.create({
    userId,
    score: totalScore,
    totalQuestions: submissions.length,
    answers: breakdown,
  });

  return {
    sessionId: session.id,
    score: totalScore,
    maxPossible,
    percentage: maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0,
    breakdown,
    createdAt: session.created_at,
  };
};

/**
 * Get interview session history for a user.
 */
const getResultsByUser = async (userId) => {
  const sessions = await interviewRepository.findByUserId(userId);
  const stats = await interviewRepository.getStatsByUserId(userId);
  return { sessions, stats };
};

module.exports = { getQuestions, submitInterview, getResultsByUser };
