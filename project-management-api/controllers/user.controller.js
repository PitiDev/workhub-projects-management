const User = require('../models/user.model');
const Team = require('../models/team.model');
const Project = require('../models/project.model');
const logger = require('../utils/logger');
const { Op, Sequelize } = require('sequelize');

/**
 * Get all users
 * @route GET /api/users
 */
const getAllUsers = async (req, res) => {
  try {
    const { search, limit = 10, offset = 0, sort_by = 'id', sort_dir = 'asc' } = req.query;

    // Build query options
    const options = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_by, sort_dir.toUpperCase()]],
      attributes: { exclude: ['password'] } // Exclude password from results
    };

    // Add search condition if provided
    if (search) {
      options.where = {
        [Op.or]: [
          { first_name: { [Op.like]: `%${search}%` } },
          { last_name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    // Get users with pagination
    const { count, rows } = await User.findAndCountAll(options);

    res.status(200).json({
      data: rows,
      meta: {
        total: count,
        limit: options.limit,
        offset: options.offset
      }
    });
  } catch (error) {
    logger.error('Error getting users:', error);
    res.status(500).json({ error: 'Server error getting users' });
  }
};

/**
 * Get user by ID
 * @route GET /api/users/:id
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] } // Exclude password from results
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      data: user
    });
  } catch (error) {
    logger.error(`Error getting user ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error getting user' });
  }
};

/**
 * Create new user (admin only)
 * @route POST /api/users
 */
const createUser = async (req, res) => {
  try {
    const { email, password, first_name, last_name, role, profile_image } = req.body;

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
      last_name,
      role: role || 'user',
      profile_image
    });

    res.status(201).json({
      message: 'User created successfully',
      data: user.getPublicProfile()
    });
  } catch (error) {
    logger.error('Error creating user:', error);
    res.status(500).json({ error: 'Server error creating user' });
  }
};

/**
 * Update user
 * @route PUT /api/users/:id
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, role, profile_image } = req.body;

    // Check if user exists
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the requesting user has permission to update this user
    const isAdmin = req.user.role === 'admin';
    const isSelf = req.user.id === parseInt(id);

    if (!isAdmin && !isSelf) {
      return res.status(403).json({ error: 'Not authorized to update this user' });
    }

    // Users can only update role if they are an admin
    const updateData = {
      first_name: first_name || user.first_name,
      last_name: last_name || user.last_name,
      email: email || user.email,
      profile_image: profile_image !== undefined ? profile_image : user.profile_image
    };

    // Only allow admins to update the role
    if (isAdmin && role) {
      updateData.role = role;
    }

    // Update the user
    await user.update(updateData);

    res.status(200).json({
      message: 'User updated successfully',
      data: user.getPublicProfile()
    });
  } catch (error) {
    logger.error(`Error updating user ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error updating user' });
  }
};

/**
 * Delete user (admin only)
 * @route DELETE /api/users/:id
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user
    await user.destroy();

    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting user ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error deleting user' });
  }
};

/**
 * Get current user's profile
 * @route GET /api/users/profile
 */
const getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      data: req.user.getPublicProfile()
    });
  } catch (error) {
    logger.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Server error getting user profile' });
  }
};

/**
 * Update current user's profile
 * @route PUT /api/users/profile
 */
const updateUserProfile = async (req, res) => {
  try {
    // Log the request body and user for debugging
    console.log('Request body:', req.body);
    console.log('User from request:', req.user);
    
    const { first_name, last_name, email, profile_image } = req.body;
    
    // Check if user exists
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Log user properties
    console.log('User ID:', req.user.id);
    console.log('User model methods:', Object.keys(req.user.__proto__));
    
    // Create a plain object for the update
    const updateData = {};
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (email !== undefined) updateData.email = email;
    if (profile_image !== undefined) updateData.profile_image = profile_image;
    
    console.log('Update data:', updateData);
    
    // Try to update manually instead of using model methods
    // This bypasses the ORM functionality that might be causing issues
    try {
      // Use direct SQL instead of ORM to update the user
      const userId = req.user.id;
      const result = await User.sequelize.query(
        `UPDATE users SET 
         first_name = :first_name,
         last_name = :last_name,
         email = :email,
         profile_image = :profile_image,
         updated_at = CURRENT_TIMESTAMP
         WHERE id = :id`,
        {
          replacements: {
            id: userId,
            first_name: first_name || req.user.first_name,
            last_name: last_name || req.user.last_name,
            email: email || req.user.email,
            profile_image: profile_image !== undefined ? profile_image : req.user.profile_image
          },
          type: User.sequelize.QueryTypes.UPDATE
        }
      );
      
      // Fetch the updated user
      const [updatedUser] = await User.sequelize.query(
        `SELECT id, first_name, last_name, email, role, profile_image FROM users WHERE id = :id`,
        {
          replacements: { id: userId },
          type: User.sequelize.QueryTypes.SELECT
        }
      );
      
      res.status(200).json({
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (sqlError) {
      console.error('SQL error:', sqlError);
      throw new Error(`SQL update failed: ${sqlError.message}`);
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ 
      error: 'Server error updating user profile',
      details: error.message,
      stack: error.stack
    });
  }
};

/**
 * Search users by email or name
 * @route GET /api/users/search
 */
const searchUsers = async (req, res) => {
  try {
    const { query, teamId, projectId, limit = 10 } = req.query;
    logger.info('Search request received:', { query, teamId, projectId });
    
    // Validate search query
    if (!query || query.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Search query must be at least 2 characters long' 
      });
    }
    
    // Build the query options using Sequelize
    const options = {
      attributes: ['id', 'email', 'first_name', 'last_name', 'profile_image'],
      where: {
        [Op.or]: [
          { email: { [Op.like]: `%${query}%` } },
          { first_name: { [Op.like]: `%${query}%` } },
          { last_name: { [Op.like]: `%${query}%` } },
          Sequelize.literal(`CONCAT(first_name, ' ', last_name) LIKE '%${query}%'`)
        ]
      },
      limit: parseInt(limit)
    };

    // If teamId is provided, filter by team members
    if (teamId) {
      options.include = [{
        model: Team,
        as: 'teams',
        where: { id: teamId },
        through: { attributes: [] } // Don't include join table data
      }];
    } 
    // If projectId is provided, get the team associated with the project
    else if (projectId) {
      const project = await Project.findByPk(projectId);
      if (project) {
        options.include = [{
          model: Team,
          as: 'teams',
          where: { id: project.team_id },
          through: { attributes: [] } // Don't include join table data
        }];
      } else {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
    }

    // Execute the query
    const users = await User.findAll(options);
    logger.info(`Search found ${users.length} users`);
    
    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    logger.error('Error searching users:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search users',
      error: error.message
    });
  }
};

/**
 * Change user's password
 * @route POST /api/users/change-password
 */
const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const user = req.user;

    // Verify current password
    const isPasswordValid = await user.comparePassword(current_password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Update password
    user.password = new_password;
    await user.save();

    res.status(200).json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    logger.error('Error changing password:', error);
    res.status(500).json({ error: 'Server error changing password' });
  }
};

/**
 * Check if a user exists by email
 * @route GET /api/users/check-email
 */
const checkUserEmail = async (req, res) => {
  try {
    logger.info('=====================================');
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email parameter is required' 
      });
    }
    
    // Look for the user with the exact email
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'email', 'first_name', 'last_name'] // Don't include sensitive info
    });
    
    if (!user) {
      return res.status(200).json({
        success: true,
        exists: false,
        message: 'User not found with this email'
      });
    }
    
    return res.status(200).json({
      success: true,
      exists: true,
      data: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`
      }
    });
  } catch (error) {
    logger.error('Error checking user email:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to check user email',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  searchUsers,
  changePassword,
  checkUserEmail
};