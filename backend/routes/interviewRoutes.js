const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getQuestions,
  submitInterview,
  getResults,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/questions', getQuestions);

router.post(
  '/submit',
  [
    body('submissions')
      .isArray({ min: 1 })
      .withMessage('submissions must be a non-empty array.'),
    body('submissions.*.questionId')
      .notEmpty()
      .withMessage('Each submission must have a questionId.'),
    body('submissions.*.answer')
      .isString()
      .withMessage('Each submission must have a string answer.'),
  ],
  submitInterview
);

router.get('/results/:userId', getResults);

module.exports = router;
