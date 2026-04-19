const db = require('../config/db');

/**
 * Create a new resume for a user.
 */
const create = async ({ userId, title, summary, education, experience, skills }) => {
  const { rows } = await db.query(
    `INSERT INTO resumes (user_id, title, summary, education, experience, skills)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, title, summary, education, experience, skills]
  );
  return rows[0];
};

/**
 * Fetch all resumes belonging to a user.
 */
const findByUserId = async (userId) => {
  const { rows } = await db.query(
    'SELECT * FROM resumes WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

/**
 * Fetch a single resume by its ID.
 */
const findById = async (id) => {
  const { rows } = await db.query(
    'SELECT * FROM resumes WHERE id = $1 LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

/**
 * Update resume fields.
 */
const update = async (id, { title, summary, education, experience, skills }) => {
  const { rows } = await db.query(
    `UPDATE resumes
     SET title = $1, summary = $2, education = $3,
         experience = $4, skills = $5, updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [title, summary, education, experience, skills, id]
  );
  return rows[0] || null;
};

/**
 * Delete a resume by ID.
 * Returns the deleted row or null.
 */
const remove = async (id) => {
  const { rows } = await db.query(
    'DELETE FROM resumes WHERE id = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
};

module.exports = { create, findByUserId, findById, update, remove };
