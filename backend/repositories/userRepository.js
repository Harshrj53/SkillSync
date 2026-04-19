const db = require('../config/db');

/**
 * Find a user by email address.
 * @param {string} email
 */
const findByEmail = async (email) => {
  const { rows } = await db.query(
    'SELECT * FROM users WHERE email = $1 LIMIT 1',
    [email]
  );
  return rows[0] || null;
};

/**
 * Find a user by their UUID.
 * @param {string} id
 */
const findById = async (id) => {
  const { rows } = await db.query(
    'SELECT id, name, email, role, created_at FROM users WHERE id = $1 LIMIT 1',
    [id]
  );
  return rows[0] || null;
};

/**
 * Create a new user row.
 * @param {{ name: string, email: string, password: string, role?: string }}
 */
const create = async ({ name, email, password, role = 'user' }) => {
  const { rows } = await db.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, password, role]
  );
  return rows[0];
};

module.exports = { findByEmail, findById, create };
