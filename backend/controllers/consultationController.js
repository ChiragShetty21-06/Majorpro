import Consultation from '../models/Consultation.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';

// @desc    Submit a new consultation
// @route   POST /api/consultations
// @access  Private (Users)
export const createConsultation = async (req, res) => {
  try {
    const userId = req.userId;
    const { query_title, detailed_question, category, urgency_level, user_location, contact_preference, language, is_anonymous } = req.body;

    // Validation
    if (!query_title || !detailed_question || !category) {
      return sendError(res, 400, 'Please provide all required fields');
    }

    // Create consultation
    const consultation = await Consultation.create({
      userId,
      query_title,
      detailed_question,
      category,
      urgency_level: urgency_level || 'medium',
      user_location,
      contact_preference: contact_preference || 'email',
      language: language || 'english',
      is_anonymous,
      status: 'pending',
    });

    // Populate user info
    await consultation.populate('userId', 'firstName lastName email phoneNumber');

    return sendSuccess(res, consultation, 'Consultation submitted successfully', null, 201);
  } catch (error) {
    console.error('Create consultation error:', error);
    return sendError(res, 500, error.message || 'Failed to submit consultation');
  }
};

// @desc    Get all consultations (user's own)
// @route   GET /api/consultations
// @access  Private
export const getUserConsultations = async (req, res) => {
  try {
    const userId = req.userId;
    const consultations = await Consultation.find({ userId }).sort({ createdAt: -1 });

    return sendSuccess(res, consultations, 'Consultations fetched successfully');
  } catch (error) {
    console.error('Get consultations error:', error);
    return sendError(res, 500, error.message || 'Failed to fetch consultations');
  }
};

// @desc    Get consultation by ID
// @route   GET /api/consultations/:id
// @access  Private
export const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = await Consultation.findById(id)
      .populate('userId', 'firstName lastName email phoneNumber')
      .populate('assignedLawyerId', 'firstName lastName email phoneNumber');

    if (!consultation) {
      return sendError(res, 404, 'Consultation not found');
    }

    return sendSuccess(res, consultation, 'Consultation fetched successfully');
  } catch (error) {
    console.error('Get consultation error:', error);
    return sendError(res, 500, error.message || 'Failed to fetch consultation');
  }
};

// @desc    Get all pending consultations (Lawyers only)
// @route   GET /api/consultations/lawyer/pending
// @access  Private (Lawyers)
export const getPendingConsultations = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (user.role !== 'lawyer') {
      return sendError(res, 403, 'Only lawyers can access this endpoint');
    }

    const consultations = await Consultation.find({ status: 'pending', assignedLawyerId: null })
      .populate('userId', 'firstName lastName email phoneNumber')
      .sort({ createdAt: -1 });

    return sendSuccess(res, consultations, 'Pending consultations fetched successfully');
  } catch (error) {
    console.error('Get pending consultations error:', error);
    return sendError(res, 500, error.message || 'Failed to fetch pending consultations');
  }
};

// @desc    Get lawyer's assigned consultations
// @route   GET /api/consultations/lawyer/assigned
// @access  Private (Lawyers)
export const getLawyerConsultations = async (req, res) => {
  try {
    const lawyerId = req.userId;
    const user = await User.findById(lawyerId);

    if (user.role !== 'lawyer') {
      return sendError(res, 403, 'Only lawyers can access this endpoint');
    }

    const consultations = await Consultation.find({ assignedLawyerId: lawyerId })
      .populate('userId', 'firstName lastName email phoneNumber')
      .sort({ createdAt: -1 });

    return sendSuccess(res, consultations, 'Lawyer consultations fetched successfully');
  } catch (error) {
    console.error('Get lawyer consultations error:', error);
    return sendError(res, 500, error.message || 'Failed to fetch consultations');
  }
};

// @desc    Assign consultation to lawyer
// @route   PUT /api/consultations/:id/assign
// @access  Private (Lawyers)
export const assignConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.userId;
    const user = await User.findById(lawyerId);

    if (user.role !== 'lawyer') {
      return sendError(res, 403, 'Only lawyers can assign consultations');
    }

    const consultation = await Consultation.findByIdAndUpdate(
      id,
      {
        assignedLawyerId: lawyerId,
        status: 'assigned',
      },
      { new: true }
    ).populate('userId', 'firstName lastName email phoneNumber');

    if (!consultation) {
      return sendError(res, 404, 'Consultation not found');
    }

    return sendSuccess(res, consultation, 'Consultation assigned successfully');
  } catch (error) {
    console.error('Assign consultation error:', error);
    return sendError(res, 500, error.message || 'Failed to assign consultation');
  }
};

// @desc    Submit response to consultation
// @route   PUT /api/consultations/:id/respond
// @access  Private (Lawyers)
export const respondToConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    const lawyerId = req.userId;

    if (!response) {
      return sendError(res, 400, 'Response is required');
    }

    const consultation = await Consultation.findById(id);

    if (!consultation) {
      return sendError(res, 404, 'Consultation not found');
    }

    if (consultation.assignedLawyerId.toString() !== lawyerId) {
      return sendError(res, 403, 'You are not assigned to this consultation');
    }

    consultation.response = response;
    consultation.status = 'responded';
    consultation.responseDate = new Date();
    await consultation.save();

    return sendSuccess(res, consultation, 'Response submitted successfully');
  } catch (error) {
    console.error('Respond to consultation error:', error);
    return sendError(res, 500, error.message || 'Failed to submit response');
  }
};

// @desc    Close consultation
// @route   PUT /api/consultations/:id/close
// @access  Private (Lawyers or User)
export const closeConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const consultation = await Consultation.findById(id);

    if (!consultation) {
      return sendError(res, 404, 'Consultation not found');
    }

    // Check authorization (user or assigned lawyer)
    if (consultation.userId.toString() !== userId && consultation.assignedLawyerId?.toString() !== userId) {
      return sendError(res, 403, 'You are not authorized to close this consultation');
    }

    consultation.status = 'closed';
    await consultation.save();

    return sendSuccess(res, consultation, 'Consultation closed successfully');
  } catch (error) {
    console.error('Close consultation error:', error);
    return sendError(res, 500, error.message || 'Failed to close consultation');
  }
};
