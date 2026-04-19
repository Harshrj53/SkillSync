const { validationResult } = require('express-validator');
const resumeService = require('../services/resumeService');

/**
 * POST /api/resume
 */
const createResume = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, summary, education, experience, skills } = req.body;
    const resume = await resumeService.createResume(req.user.id, {
      title,
      summary,
      education,
      experience,
      skills,
    });

    return res.status(201).json({
      success: true,
      message: 'Resume created successfully.',
      data: { resume },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/resume/:userId
 */
const getResumes = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const resumes = await resumeService.getResumesByUser(userId);
    return res.status(200).json({ success: true, data: { resumes } });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/resume/:id
 */
const updateResume = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, summary, education, experience, skills } = req.body;
    const resume = await resumeService.updateResume(req.params.id, req.user.id, {
      title,
      summary,
      education,
      experience,
      skills,
    });

    return res.status(200).json({
      success: true,
      message: 'Resume updated successfully.',
      data: { resume },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/resume/:id
 */
const deleteResume = async (req, res, next) => {
  try {
    await resumeService.deleteResume(req.params.id, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Resume deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/resume/:id/feedback
 */
const getAIFeedback = async (req, res, next) => {
  try {
    const result = await resumeService.getAIFeedback(req.params.id, req.user.id);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { createResume, getResumes, updateResume, deleteResume, getAIFeedback };
