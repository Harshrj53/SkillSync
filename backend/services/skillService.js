const skillRepository = require('../repositories/skillRepository');

/**
 * Add a new skill for a user.
 * Validates progress is in [0, 100].
 */
const addSkill = async (userId, { skillName, progress = 0 }) => {
  if (!skillName || skillName.trim() === '') {
    const err = new Error('Skill name is required.');
    err.statusCode = 400;
    throw err;
  }
  const clampedProgress = Math.max(0, Math.min(100, Number(progress)));
  return skillRepository.create({ userId, skillName: skillName.trim(), progress: clampedProgress });
};

/**
 * Update a skill's name or progress.
 * Verifies ownership before updating.
 */
const updateSkill = async (id, userId, data) => {
  const skill = await skillRepository.findById(id);
  if (!skill) {
    const err = new Error('Skill not found.');
    err.statusCode = 404;
    throw err;
  }
  if (skill.user_id !== userId) {
    const err = new Error('You are not authorized to update this skill.');
    err.statusCode = 403;
    throw err;
  }

  const updates = {};
  if (data.skillName !== undefined) updates.skillName = data.skillName.trim();
  if (data.progress !== undefined) {
    updates.progress = Math.max(0, Math.min(100, Number(data.progress)));
  }

  return skillRepository.update(id, updates);
};

/**
 * Fetch all skills for a user.
 */
const getSkillsByUser = async (userId) => {
  return skillRepository.findByUserId(userId);
};

/**
 * Delete a skill. Verifies ownership.
 */
const deleteSkill = async (id, userId) => {
  const skill = await skillRepository.findById(id);
  if (!skill) {
    const err = new Error('Skill not found.');
    err.statusCode = 404;
    throw err;
  }
  if (skill.user_id !== userId) {
    const err = new Error('You are not authorized to delete this skill.');
    err.statusCode = 403;
    throw err;
  }
  return skillRepository.remove(id);
};

module.exports = { addSkill, updateSkill, getSkillsByUser, deleteSkill };
