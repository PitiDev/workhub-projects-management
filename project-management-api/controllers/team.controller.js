const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const Team = require('../models/team.model');
const TeamMember = require('../models/team-member.model');
const User = require('../models/user.model');
const Project = require('../models/project.model');
const logger = require('../utils/logger');

/**
 * Get all teams
 * @route GET /api/teams
 */
const getAllTeams = async (req, res) => {
  try {
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';
    const { search, limit = 10, offset = 0, sort_by = 'name', sort_dir = 'asc' } = req.query;

    // Build base query options
    const options = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_by, sort_dir.toUpperCase()]],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    };

    // Add search condition if provided
    if (search) {
      options.where = {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    // If user is not admin, only show teams they are a member of
    if (!isAdmin) {
      const userTeamIds = await TeamMember.findAll({
        where: { user_id: userId },
        attributes: ['team_id']
      }).then(teams => teams.map(team => team.team_id));

      options.where = {
        ...options.where,
        [Op.or]: [
          { id: { [Op.in]: userTeamIds } },
          { created_by: userId }
        ]
      };
    }

    // Get teams with pagination
    const { count, rows } = await Team.findAndCountAll(options);

    // Get member counts for each team
    for (const team of rows) {
      const memberCount = await TeamMember.count({
        where: { team_id: team.id }
      });

      const projectCount = await Project.count({
        where: { team_id: team.id }
      });

      team.dataValues.memberCount = memberCount;
      team.dataValues.projectCount = projectCount;
    }

    res.status(200).json({
      data: rows,
      meta: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    logger.error('Error getting teams:', error);
    res.status(500).json({ error: 'Server error getting teams' });
  }
};

/**
 * Get team by ID
 * @route GET /api/teams/:id
 */
const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the team
    const team = await Team.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user has access to the team
    if (!isAdmin && team.created_by !== userId) {
      const isMember = await TeamMember.findOne({
        where: {
          team_id: id,
          user_id: userId
        }
      });

      if (!isMember) {
        return res.status(403).json({ error: 'Not authorized to access this team' });
      }
    }

    // Get team members with user info
    const members = await TeamMember.findAll({
      where: { team_id: id },
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        }
      ]
    });
    team.dataValues.members = members;

    // Get projects count
    const projectCount = await Project.count({
      where: { team_id: id }
    });
    team.dataValues.projectCount = projectCount;

    // Get user's role in the team
    if (!isAdmin && team.created_by !== userId) {
      const userMembership = await TeamMember.findOne({
        where: {
          team_id: id,
          user_id: userId
        }
      });

      team.dataValues.userRole = userMembership ? userMembership.role : null;
    } else {
      team.dataValues.userRole = 'owner'; // Admin or creator gets owner privileges
    }

    res.status(200).json({
      data: team
    });
  } catch (error) {
    logger.error(`Error getting team ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error getting team' });
  }
};

/**
 * Create new team
 * @route POST /api/teams
 */
const createTeam = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;

    // Create team with transaction
    let team;

    try {
      const result = await sequelize.transaction(async (t) => {
        // Create new team
        const newTeam = await Team.create({
          name,
          description,
          created_by: userId
        }, { transaction: t });

        // Add creator as owner
        await TeamMember.create({
          team_id: newTeam.id,
          user_id: userId,
          role: 'owner'
        }, { transaction: t });

        return newTeam;
      });

      team = result;

    } catch (transactionError) {
      // Log detailed error information
      logger.error('Transaction failed in createTeam:', transactionError);

      // Check for specific Sequelize errors
      if (transactionError.name === 'SequelizeAssociationError') {
        return res.status(500).json({
          error: 'Database association error',
          details: 'There is an issue with model associations'
        });
      }

      // Re-throw to be caught by outer try-catch
      throw transactionError;
    }

    // Get the created team with creator info
    const completeTeam = await Team.findByPk(team.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    // If we couldn't find the complete team (unlikely)
    if (!completeTeam) {
      return res.status(500).json({
        error: 'Team created but could not retrieve complete details',
        teamId: team.id
      });
    }

    // Add member count
    completeTeam.dataValues.memberCount = 1;
    completeTeam.dataValues.projectCount = 0;
    completeTeam.dataValues.userRole = 'owner';

    res.status(201).json({
      message: 'Team created successfully',
      data: completeTeam
    });
  } catch (error) {
    logger.error('Error creating team:', error);
    res.status(500).json({ error: 'Server error creating team' });
  }
};

/**
 * Update team
 * @route PUT /api/teams/:id
 */
const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Check if team exists
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user has permission to update this team
    if (!isAdmin && team.created_by !== userId) {
      // Check if user is an owner or admin of the team
      const teamMember = await TeamMember.findOne({
        where: {
          team_id: id,
          user_id: userId,
          role: { [Op.in]: ['owner', 'admin'] }
        }
      });

      if (!teamMember) {
        return res.status(403).json({ error: 'Not authorized to update this team' });
      }
    }

    // Update the team
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    await team.update(updateData);

    // Get the updated team with creator info
    const updatedTeam = await Team.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    // Get member count
    const memberCount = await TeamMember.count({
      where: { team_id: id }
    });

    const projectCount = await Project.count({
      where: { team_id: id }
    });

    updatedTeam.dataValues.memberCount = memberCount;
    updatedTeam.dataValues.projectCount = projectCount;

    res.status(200).json({
      message: 'Team updated successfully',
      data: updatedTeam
    });
  } catch (error) {
    logger.error(`Error updating team ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error updating team' });
  }
};

/**
 * Delete team
 * @route DELETE /api/teams/:id
 */
const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Check if team exists
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user has permission to delete this team
    if (!isAdmin && team.created_by !== userId) {
      // Only team owner can delete the team
      const teamMember = await TeamMember.findOne({
        where: {
          team_id: id,
          user_id: userId,
          role: 'owner'
        }
      });

      if (!teamMember) {
        return res.status(403).json({ error: 'Not authorized to delete this team' });
      }
    }

    // Check if team has projects
    const projectCount = await Project.count({
      where: { team_id: id }
    });

    if (projectCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete team with projects. Please delete or move all projects first.',
        projectCount
      });
    }

    // Delete the team (cascade delete will handle team members)
    await team.destroy();

    res.status(200).json({
      message: 'Team deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting team ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error deleting team' });
  }
};

/**
 * Get team members
 * @route GET /api/teams/:id/members
 */
const getTeamMembers = async (req, res) => {
  try {
    const { id } = req.params;

    // Debug to check if req.user exists
    console.log('Request user:', req.user);


    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    console.log(`Team ID: ${id}, User ID: ${userId}, Is Admin: ${isAdmin}`);

    // Check if team exists
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user has access to the team
    if (!isAdmin && team.created_by !== userId) {
      const isMember = await TeamMember.findOne({
        where: {
          team_id: id,
          user_id: userId
        }
      });

      if (!isMember) {
        return res.status(403).json({ error: 'Not authorized to access this team' });
      }
    }

    // Get team members with user info
    const members = await TeamMember.findAll({
      where: { team_id: id },
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image', 'role']
        }
      ],
      order: [
        // Specify TeamMember.role to avoid ambiguity
        [sequelize.literal(`FIELD(TeamMember.role, 'owner', 'admin', 'member')`), 'ASC'],
        [{ model: User }, 'first_name', 'ASC']
      ]
    });

    res.status(200).json({
      data: members
    });
  } catch (error) {
    logger.error(`Error getting members for team ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error getting team members' });
  }
};

/**
 * Add team member
 * @route POST /api/teams/:id/members
 */
const addTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, role = 'member' } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Check if team exists
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user has permission to add members to this team
    if (!isAdmin && team.created_by !== userId) {
      // Check if user is an owner or admin of the team
      const teamMember = await TeamMember.findOne({
        where: {
          team_id: id,
          user_id: userId,
          role: { [Op.in]: ['owner', 'admin'] }
        }
      });

      if (!teamMember) {
        return res.status(403).json({ error: 'Not authorized to add members to this team' });
      }

      // Only owners can add admins
      if (role === 'admin' && teamMember.role !== 'owner') {
        return res.status(403).json({ error: 'Only team owners can add admin members' });
      }

      // Only admins can add owners
      if (role === 'owner' && !isAdmin) {
        return res.status(403).json({ error: 'Not authorized to add owners to this team' });
      }
    }

    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already a member
    const existingMember = await TeamMember.findOne({
      where: {
        team_id: id,
        user_id: user_id
      }
    });

    if (existingMember) {
      return res.status(400).json({ error: 'User is already a member of this team' });
    }

    // Add user to team
    const member = await TeamMember.create({
      team_id: id,
      user_id: user_id,
      role
    });

    // Get member with user info
    const newMember = await TeamMember.findByPk(member.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        }
      ]
    });

    res.status(201).json({
      message: 'Member added successfully',
      data: newMember
    });
  } catch (error) {
    logger.error(`Error adding member to team ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error adding team member' });
  }
};

/**
 * Update team member role
 * @route PUT /api/teams/:id/members/:userId
 */
const updateTeamMember = async (req, res) => {
  try {
    const { id, userId: memberUserId } = req.params;
    const { role } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Check if team exists
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if member exists
    const member = await TeamMember.findOne({
      where: {
        team_id: id,
        user_id: memberUserId
      },
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        }
      ]
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found in this team' });
    }

    // Check if user has permission to update members in this team
    if (!isAdmin && team.created_by !== userId) {
      // Check if user is an owner of the team
      const teamMember = await TeamMember.findOne({
        where: {
          team_id: id,
          user_id: userId,
          role: 'owner'
        }
      });

      if (!teamMember) {
        return res.status(403).json({ error: 'Not authorized to update members in this team' });
      }
    }

    // Prevent removing the last owner
    if (member.role === 'owner' && role !== 'owner') {
      const ownerCount = await TeamMember.count({
        where: {
          team_id: id,
          role: 'owner'
        }
      });

      if (ownerCount <= 1) {
        return res.status(400).json({ error: 'Cannot remove the last owner of the team' });
      }
    }

    // Update member role
    await member.update({ role });

    // Get updated member with user info
    const updatedMember = await TeamMember.findOne({
      where: {
        team_id: id,
        user_id: memberUserId
      },
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        }
      ]
    });

    res.status(200).json({
      message: 'Member role updated successfully',
      data: updatedMember
    });
  } catch (error) {
    logger.error(`Error updating member role in team ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error updating team member' });
  }
};

/**
 * Remove team member
 * @route DELETE /api/teams/:id/members/:userId
 */
const removeTeamMember = async (req, res) => {
  try {
    const { id, userId: memberUserId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Check if team exists
    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if member exists
    const member = await TeamMember.findOne({
      where: {
        team_id: id,
        user_id: memberUserId
      }
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found in this team' });
    }

    // Check if user has permission to remove members from this team
    if (!isAdmin && team.created_by !== userId) {
      // Users can remove themselves
      if (memberUserId != userId) {
        // Check if user is an owner or admin of the team
        const teamMember = await TeamMember.findOne({
          where: {
            team_id: id,
            user_id: userId,
            role: { [Op.in]: ['owner', 'admin'] }
          }
        });

        if (!teamMember) {
          return res.status(403).json({ error: 'Not authorized to remove members from this team' });
        }

        // Only owners can remove admins
        if (member.role === 'admin' && teamMember.role !== 'owner') {
          return res.status(403).json({ error: 'Only team owners can remove admin members' });
        }

        // Only admins can remove owners
        if (member.role === 'owner' && !isAdmin && teamMember.role !== 'owner') {
          return res.status(403).json({ error: 'Not authorized to remove owners from this team' });
        }
      }
    }

    // Prevent removing the last owner
    if (member.role === 'owner') {
      const ownerCount = await TeamMember.count({
        where: {
          team_id: id,
          role: 'owner'
        }
      });

      if (ownerCount <= 1) {
        return res.status(400).json({ error: 'Cannot remove the last owner of the team' });
      }
    }

    // Remove member
    await member.destroy();

    res.status(200).json({
      message: 'Member removed successfully'
    });
  } catch (error) {
    logger.error(`Error removing member from team ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error removing team member' });
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  removeTeamMember
};