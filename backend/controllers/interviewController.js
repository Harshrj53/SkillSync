const { validationResult } = require('express-validator');
const interviewService = require('../services/interviewService');

/**
 * GET /api/interview/questions
 */
const getQuestions = (req, res) => {
  const questions = interviewService.getQuestions();
  return res.status(200).json({
    success: true,
    data: { questions, total: questions.length },
  });
};

/**
 * POST /api/interview/submit
 */
const submitInterview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { submissions } = req.body;
    const result = await interviewService.submitInterview(req.user.id, submissions);

    return res.status(201).json({
      success: true,
      message: 'Interview submitted and scored successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/interview/results/:userId
 */
const getResults = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const data = await interviewService.getResultsByUser(userId);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getQuestions, submitInterview, getResults };
