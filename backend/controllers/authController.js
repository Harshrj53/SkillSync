const { validationResult } = require('express-validator');
const authService = require('../services/authService');

/**
 * POST /api/auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const { user, token } = await authService.signup({ name, email, password });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    const { user, token } = await authService.login({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me  (protected)
 */
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login, getMe };
