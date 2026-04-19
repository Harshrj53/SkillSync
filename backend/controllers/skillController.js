const { validationResult } = require('express-validator');
const skillService = require('../services/skillService');

/**
 * POST /api/skills
 */
const addSkill = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { skillName, progress } = req.body;
    const skill = await skillService.addSkill(req.user.id, { skillName, progress });

    return res.status(201).json({
      success: true,
      message: 'Skill added successfully.',
      data: { skill },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/skills/:id
 */
const updateSkill = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { skillName, progress } = req.body;
    const skill = await skillService.updateSkill(req.params.id, req.user.id, {
      skillName,
      progress,
    });

    return res.status(200).json({
      success: true,
      message: 'Skill updated successfully.',
      data: { skill },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/skills/:userId
 */
const getSkills = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const skills = await skillService.getSkillsByUser(userId);
    return res.status(200).json({ success: true, data: { skills } });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/skills/:id
 */
const deleteSkill = async (req, res, next) => {
  try {
    await skillService.deleteSkill(req.params.id, req.user.id);
    return res.status(200).json({
      success: true,
      message: 'Skill deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { addSkill, updateSkill, getSkills, deleteSkill };
