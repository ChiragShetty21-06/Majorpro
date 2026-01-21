import { sendSuccess, sendError } from '../utils/response.js';

// @desc    Submit feedback (send to email)
// @route   POST /api/feedback
// @access  Public
export const submitFeedback = async (req, res) => {
  try {
    const { name, email, feedback_type, message } = req.body;

    // Validation
    if (!name || !email || !feedback_type || !message) {
      return sendError(res, 400, 'Please provide all required fields');
    }

    if (!['suggestion', 'complaint', 'appreciation', 'feature_request', 'bug_report'].includes(feedback_type)) {
      return sendError(res, 400, 'Invalid feedback type');
    }

    // Return success response
    return sendSuccess(
      res,
      { id: Date.now(), name, email, feedback_type, message, status: 'sent' },
      'Feedback submitted successfully. We will review it shortly.',
      null,
      200
    );
  } catch (error) {
    console.error('Feedback submission error:', error);
    return sendError(res, 500, error.message || 'Server error during feedback submission');
  }
};

// @desc    Get all feedback (admin only)
// @route   GET /api/feedback
// @access  Private (Admin)
export const getAllFeedback = async (req, res) => {
  try {
    // TODO: Add admin role check middleware
    return sendSuccess(res, [], 'Feedback retrieval not yet implemented');
  } catch (error) {
    return sendError(res, 500, error.message || 'Server error');
  }
};
