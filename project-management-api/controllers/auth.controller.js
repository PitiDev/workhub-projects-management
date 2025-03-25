const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const jwtConfig = require('../config/jwt');
const logger = require('../utils/logger');

const ActivityTrackerService = require('../services/activity-tracker.service');

/**
 * Register a new user
 * @route POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    
    // Create new user
    const user = await User.create({
      email,
      password,
      first_name,
      last_name
    });
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });
    
    res.status(200).json({
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/me
 */
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      data: req.user.getPublicProfile()
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error getting profile' });
  }
};

/**
 * Refresh token
 * @route POST /api/auth/refresh-token
 */
const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }
    
    // Verify existing token
    const decoded = jwt.verify(token, jwtConfig.secret, { ignoreExpiration: true });
    
    // Check if user exists
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Generate new token
    const newToken = jwt.sign({ id: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn
    });
    
    res.status(200).json({
      message: 'Token refreshed successfully',
      data: {
        token: newToken
      }
    });
  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(500).json({ error: 'Server error refreshing token' });
  }
};

/**
 * Change password
 * @route POST /api/auth/change-password
 */
const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const user = req.user;
    
    // Check current password
    const isMatch = await user.comparePassword(current_password);
    
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = new_password;
    await user.save();
    
    res.status(200).json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({ error: 'Server error changing password' });
  }
};

/**
 * Forgot password - sends reset email
 * @route POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      // For security reasons, still return success even if email doesn't exist
      return res.status(200).json({ 
        message: 'If your email exists in our system, you will receive a password reset link' 
      });
    }
    
    // Generate password reset token
    const resetToken = jwt.sign(
      { id: user.id, action: 'reset_password' }, 
      jwtConfig.secret, 
      { expiresIn: '1h' }
    );
    
    // In a real application, you would send an email with the reset link
    // For this example, we'll just return the token
    
    logger.info(`Password reset requested for: ${email}`);
    
    res.status(200).json({
      message: 'If your email exists in our system, you will receive a password reset link',
      data: {
        // Only include reset token in development environment
        ...(process.env.NODE_ENV === 'development' && { resetToken })
      }
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error processing password reset request' });
  }
};

/**
 * Reset password with token
 * @route POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;
    
    if (!token || !new_password) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret);
    
    // Check if token is for password reset
    if (!decoded.id || decoded.action !== 'reset_password') {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    
    // Find user
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update password
    user.password = new_password;
    await user.save();
    
    res.status(200).json({
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Password reset token has expired' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: 'Invalid token' });
    }
    
    logger.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error resetting password' });
  }
};

/**
 * Logout user (client-side only)
 * @route POST /api/auth/logout
 */
const logout = async (req, res) => {
  // JWT tokens are stateless, so we don't need to do anything server-side
  // The client should remove the token from storage
  
  res.status(200).json({
    message: 'Logged out successfully'
  });
};

module.exports = {
  register,
  login,
  getProfile,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  logout
};