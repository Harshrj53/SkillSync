const userRepository = require('../repositories/userRepository');
const { hashPassword, comparePassword } = require('../utils/hashUtils');
const { signToken } = require('../utils/jwtUtils');

/**
 * Register a new user.
 * Throws an error if email is already in use.
 */
const signup = async ({ name, email, password }) => {
  // Check for existing user
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    const err = new Error('An account with this email already exists.');
    err.statusCode = 409;
    throw err;
  }

  // Hash password and create user
  const hashedPassword = await hashPassword(password);
  const user = await userRepository.create({ name, email, password: hashedPassword });

  // Generate JWT
  const token = signToken({ id: user.id, email: user.email, role: user.role });

  return { user, token };
};

/**
 * Authenticate a user and return a JWT.
 * Throws if credentials are invalid.
 */
const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    throw err;
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });

  // Omit password from returned user object
  const { password: _pw, ...safeUser } = user;
  return { user: safeUser, token };
};

/**
 * Fetch a user's public profile by ID.
 */
const getProfile = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    const err = new Error('User not found.');
    err.statusCode = 404;
    throw err;
  }
  return user;
};

module.exports = { signup, login, getProfile };
