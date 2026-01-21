import User from '../models/User.js';
import { generateToken } from '../utils/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';

// @desc    Initialize single admin user
// @route   POST /api/auth/init
// @access  Public (only works if no user exists)
export const initializeAdmin = async (req, res) => {
  try {
    const userExists = await User.findOne({});
    
    if (userExists) {
      return sendError(res, 400, 'Admin user already initialized');
    }

    const { username, password } = req.body;

    if (!username || !password) {
      return sendError(res, 400, 'Please provide username and password');
    }

    const user = await User.create({
      username,
      password,
      role: 'admin',
    });

    const token = generateToken(user._id);
    const userResponse = user.toJSON ? user.toJSON() : user.toObject();
    delete userResponse.password;

    return sendSuccess(res, { token, user: userResponse }, 'Admin user created successfully', null, 201);
  } catch (error) {
    console.error('Initialization error:', error);
    return sendError(res, 500, error.message || 'Server error during initialization');
  }
};

// @desc    Register user (user or lawyer)
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { username, email, password, fullName, role, specialization } = req.body;

    if (!username || !email || !password || !fullName || !role) {
      return sendError(res, 400, 'Please provide all required fields');
    }

    if (!['user', 'lawyer'].includes(role)) {
      return sendError(res, 400, 'Role must be either "user" or "lawyer"');
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return sendError(res, 400, 'Username or email already exists');
    }

    const userData = {
      username,
      email,
      password,
      fullName,
      role,
    };

    if (role === 'lawyer' && specialization) {
      userData.specialization = specialization;
    }

    const user = await User.create(userData);

    const token = generateToken(user._id);
    const userResponse = user.toJSON ? user.toJSON() : user.toObject();
    delete userResponse.password;

    return sendSuccess(res, { token, user: userResponse }, `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`, null, 201);
  } catch (error) {
    console.error('Registration error:', error);
    return sendError(res, 500, error.message || 'Server error during registration');
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return sendError(res, 400, 'Please provide username and password');
    }

    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return sendError(res, 401, 'Invalid username or password');
    }

    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return sendError(res, 401, 'Invalid username or password');
    }

    const token = generateToken(user._id);
    const userResponse = user.toJSON ? user.toJSON() : user.toObject();
    delete userResponse.password;

    return sendSuccess(res, { token, user: userResponse }, 'User logged in successfully');
  } catch (error) {
    console.error('Login error:', error);
    return sendError(res, 500, error.message || 'Server error during login');
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, user, 'User fetched successfully');
  } catch (error) {
    return sendError(res, 500, error.message || 'Server error');
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    return sendSuccess(res, null, 'User logged out successfully');
  } catch (error) {
    return sendError(res, 500, error.message || 'Server error');
  }
};
