const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createResume,
  getResumes,
  updateResume,
  deleteResume,
  getAIFeedback,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

const resumeValidation = [
  body('title').optional().trim().isLength({ max: 200 }).withMessage('Title too long.'),
  body('summary').optional().trim(),
  body('education').optional().trim(),
  body('experience').optional().trim(),
  body('skills').optional().trim(),
];

// All resume routes are protected
router.use(protect);

router.post('/', [body('title').trim().notEmpty().withMessage('Resume title is required.'), ...resumeValidation], createResume);
router.get('/:userId', getResumes);
router.put('/:id', resumeValidation, updateResume);
router.delete('/:id', deleteResume);
router.post('/:id/feedback', getAIFeedback);

module.exports = router;
