const resumeRepository = require('../repositories/resumeRepository');
const OpenAI = require('openai');

/**
 * Create a new resume.
 */
const createResume = async (userId, data) => {
  return resumeRepository.create({ userId, ...data });
};

/**
 * Get all resumes for a user.
 */
const getResumesByUser = async (userId) => {
  return resumeRepository.findByUserId(userId);
};

/**
 * Get a single resume. Throws 404 if not found.
 */
const getResumeById = async (id) => {
  const resume = await resumeRepository.findById(id);
  if (!resume) {
    const err = new Error('Resume not found.');
    err.statusCode = 404;
    throw err;
  }
  return resume;
};

/**
 * Update a resume. Verifies ownership before updating.
 */
const updateResume = async (id, userId, data) => {
  const resume = await resumeRepository.findById(id);
  if (!resume) {
    const err = new Error('Resume not found.');
    err.statusCode = 404;
    throw err;
  }
  if (resume.user_id !== userId) {
    const err = new Error('You are not authorized to update this resume.');
    err.statusCode = 403;
    throw err;
  }
  return resumeRepository.update(id, data);
};

/**
 * Delete a resume. Verifies ownership before deleting.
 */
const deleteResume = async (id, userId) => {
  const resume = await resumeRepository.findById(id);
  if (!resume) {
    const err = new Error('Resume not found.');
    err.statusCode = 404;
    throw err;
  }
  if (resume.user_id !== userId) {
    const err = new Error('You are not authorized to delete this resume.');
    err.statusCode = 403;
    throw err;
  }
  return resumeRepository.remove(id);
};

/**
 * Generate AI feedback for a resume using OpenAI.
 * Gracefully falls back if API key is not configured.
 */
const getAIFeedback = async (resumeId, userId) => {
  const resume = await resumeRepository.findById(resumeId);
  if (!resume) {
    const err = new Error('Resume not found.');
    err.statusCode = 404;
    throw err;
  }
  if (resume.user_id !== userId) {
    const err = new Error('Not authorized to get feedback for this resume.');
    err.statusCode = 403;
    throw err;
  }

  // Graceful fallback if OpenAI is not configured
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-...') {
    return {
      feedback: null,
      fallback: true,
      message:
        'AI feedback is not configured yet. Add your OPENAI_API_KEY to .env to enable this feature.',
    };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
You are an expert resume reviewer and career coach. Review the following resume and provide specific, actionable feedback.

Resume Title: ${resume.title || 'N/A'}
Summary: ${resume.summary || 'Not provided'}
Education: ${resume.education || 'Not provided'}
Experience: ${resume.experience || 'Not provided'}
Skills: ${resume.skills || 'Not provided'}

Respond in JSON format with the following structure:
{
  "overallScore": <number 1-10>,
  "strengths": [<string>, ...],
  "improvements": [<string>, ...],
  "missingKeywords": [<string>, ...],
  "summary": "<2-3 sentence overall assessment>"
}
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 800,
  });

  const raw = completion.choices[0].message.content;
  const feedback = JSON.parse(raw);

  return { feedback, fallback: false };
};

module.exports = {
  createResume,
  getResumesByUser,
  getResumeById,
  updateResume,
  deleteResume,
  getAIFeedback,
};
