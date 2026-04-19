const db = require('../config/db');

/**
 * Save an interview session result.
 * @param {{ userId: string, score: number, totalQuestions: number, answers: Array }}
 */
const create = async ({ userId, score, totalQuestions, answers }) => {
  const { rows } = await db.query(
    `INSERT INTO interview_sessions (user_id, score, total_questions, answers)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, score, totalQuestions, JSON.stringify(answers)]
  );
  return rows[0];
};

/**
 * Fetch all interview sessions for a user, newest first.
 */
const findByUserId = async (userId) => {
  const { rows } = await db.query(
    `SELECT id, user_id, score, total_questions, answers, created_at
     FROM interview_sessions
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
  return rows;
};

/**
 * Aggregate stats for a user: avg score, best score, total sessions.
 */
const getStatsByUserId = async (userId) => {
  const { rows } = await db.query(
    `SELECT
       COUNT(*)::int                                               AS total_sessions,
       ROUND(AVG(score::float / total_questions * 100), 1)::float AS avg_percentage,
       MAX(score)                                                  AS best_score,
       MAX(total_questions)                                        AS max_total
     FROM interview_sessions
     WHERE user_id = $1`,
    [userId]
  );
  return rows[0];
};

module.exports = { create, findByUserId, getStatsByUserId };
