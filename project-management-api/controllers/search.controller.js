// controllers/search.controller.js
const { Op } = require('sequelize');
const db = require('../models');

/**
 * Search projects
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.searchProjects = async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;

    // Check if query is provided
    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const userId = req.user.id;
    
    // Get teams the user is a member of
    const teamMembers = await db.TeamMember.findAll({
      where: { user_id: userId },
      attributes: ['team_id']
    });
    
    const teamIds = teamMembers.map(member => member.team_id);
    
    if (teamIds.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    // FIXED: Do NOT specify 'as' since your association doesn't have an explicit alias
    const projects = await db.Project.findAll({
      where: {
        team_id: { [Op.in]: teamIds },
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [
        {
          model: db.Team,
          // DO NOT include 'as' here - the association doesn't have an explicit alias
          attributes: ['id', 'name']
        }
      ],
      limit: parseInt(limit, 10),
      order: [['name', 'ASC']]
    });
    
    return res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error searching projects:', error);
    return res.status(500).json({
      error: 'Failed to search projects',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Search tasks
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.searchTasks = async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    
    // Check if query is provided
    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    const userId = req.user.id;
    
    // Get teams the user is a member of
    const teamMembers = await db.TeamMember.findAll({
      where: { user_id: userId },
      attributes: ['team_id']
    });
    
    const teamIds = teamMembers.map(member => member.team_id);
    
    // If user isn't part of any teams, return empty results
    if (teamIds.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    // Get projects in those teams
    const projects = await db.Project.findAll({
      where: { team_id: { [Op.in]: teamIds } },
      attributes: ['id']
    });
    
    const projectIds = projects.map(project => project.id);
    
    // If user doesn't have access to any projects, return empty results
    if (projectIds.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }
    
    // Search for tasks in those projects
    // Using explicit aliases that match your associations
    const tasks = await db.Task.findAll({
      where: {
        project_id: { [Op.in]: projectIds },
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [
        {
          model: db.Project,
          // No 'as' needed here based on your association
          attributes: ['id', 'name', 'color']
        },
        {
          model: db.TaskStatus,
          as: 'status', // This matches your association
          attributes: ['id', 'name', 'color']
        }
      ],
      limit: parseInt(limit, 10),
      order: [['created_at', 'DESC']]
    });
    
    return res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error searching tasks:', error);
    return res.status(500).json({
      error: 'Failed to search tasks',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Global search functionality
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.globalSearch = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user.id;
    
    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        data: {
          projects: [],
          tasks: []
        }
      });
    }
    
    // Get teams the user is a member of
    const teamMembers = await db.TeamMember.findAll({
      where: { user_id: userId },
      attributes: ['team_id']
    });
    
    const teamIds = teamMembers.map(member => member.team_id);
    
    if (teamIds.length === 0) {
      return res.json({
        success: true,
        data: {
          projects: [],
          tasks: []
        }
      });
    }
    
    // Search for projects in user's teams
    const projects = await db.Project.findAll({
      where: {
        team_id: { [Op.in]: teamIds },
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [
        {
          model: db.Team,
          // No 'as' needed
          attributes: ['id', 'name']
        }
      ],
      limit: 5,
      order: [['name', 'ASC']]
    });
    
    // Get projects for task search
    const userProjects = await db.Project.findAll({
      where: { team_id: { [Op.in]: teamIds } },
      attributes: ['id']
    });
    
    const projectIds = userProjects.map(project => project.id);
    
    // Search for tasks in user's projects
    const tasks = await db.Task.findAll({
      where: {
        project_id: { [Op.in]: projectIds.length > 0 ? projectIds : [0] },
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [
        {
          model: db.Project,
          // No 'as' needed
          attributes: ['id', 'name', 'color']
        },
        {
          model: db.TaskStatus,
          as: 'status', // This matches your association
          attributes: ['id', 'name', 'color']
        }
      ],
      limit: 5,
      order: [['created_at', 'DESC']]
    });
    
    return res.json({
      success: true,
      data: {
        projects,
        tasks
      }
    });
  } catch (error) {
    console.error('Error performing global search:', error);
    return res.status(500).json({
      error: 'Failed to perform search',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};