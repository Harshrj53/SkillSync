const db = require('../config/db');

/**
 * Add a new skill for a user.
 */
const create = async ({ userId, skillName, progress = 0 }) => {
  const { rows } = await db.query(
    `INSERT INTO skills (user_id, skill_name, progress)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, skillName, progress]
  );
  return rows[0];
};

/**
 * Update the progress of a skill.
 */
const update = async (id, { skillName, progress }) => {
  const { rows } = await db.query(
    `UPDATE skills
     SET skill_name = COALESCE($1, skill_name),
         progress   = COALESCE($2, progress)
     WHERE id = $3
     RETURNING *`,
    [skillName, progress, id]
  );
  return rows[0] || null;
};

/**
 * Fetch all skills for a user, ordered alphabetically.
 */
const findByUserId = async (userId) => {
  const { rows } = await db.query(
    'SELECT * FROM skills WHERE user_id = $1 ORDER BY skill_name ASC',
    [userId]
  );
  return rows;
};

/**
 * Find skill by ID.
 */
const findById = async (id) => {
  const { rows } = await db.query(
    'SELECT * FROM skills WHERE id = $1 LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

/**
 * Delete a skill by ID.
 */
const remove = async (id) => {
  const { rows } = await db.query(
    'DELETE FROM skills WHERE id = $1 RETURNING *',
    [id]
  );
  return rows[0] || null;
};

module.exports = { create, update, findByUserId, findById, remove };
