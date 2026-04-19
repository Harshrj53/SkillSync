const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { addSkill, updateSkill, getSkills, deleteSkill } = require('../controllers/skillController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

const skillValidation = [
  body('skillName').optional().trim().notEmpty().withMessage('Skill name cannot be empty.'),
  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be an integer between 0 and 100.'),
];

router.post(
  '/',
  [body('skillName').trim().notEmpty().withMessage('Skill name is required.'), ...skillValidation],
  addSkill
);
router.put('/:id', skillValidation, updateSkill);
router.get('/:userId', getSkills);
router.delete('/:id', deleteSkill);

module.exports = router;
