const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const Project = require('../models/project.model');
const Team = require('../models/team.model');
const TeamMember = require('../models/team-member.model');
const User = require('../models/user.model');
const TaskStatus = require('../models/task-status.model');
const Task = require('../models/task.model');
const logger = require('../utils/logger');
const { sendMail, generateEmailTemplate } = require('../utils/mail');

/**
 * Get all projects
 * @route GET /api/projects
 */
const getAllProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      search, 
      team_id, 
      status, 
      limit = 10, 
      offset = 0, 
      sort_by = 'updated_at', 
      sort_dir = 'desc' 
    } = req.query;

    // Check if user is admin
    const isAdmin = req.user.role === 'admin';

    // Build base query options
    const options = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_by, sort_dir.toUpperCase()]],
      include: [
        {
          model: Team,
          attributes: ['id', 'name'],
          required: true
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    };

    // Add search condition if provided
    const whereClause = {};
    
    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }

    if (team_id) {
      whereClause.team_id = team_id;
    }

    if (status) {
      whereClause.status = status;
    }

    // If user is not admin, restrict to projects they have access to
    if (!isAdmin) {
      // Get teams that the user is a member of
      const userTeams = await TeamMember.findAll({
        where: { user_id: userId },
        attributes: ['team_id']
      });

      const userTeamIds = userTeams.map(tm => tm.team_id);

      // User can see projects from their teams or projects they created
      whereClause[Op.or] = [
        { team_id: { [Op.in]: userTeamIds } },
        { created_by: userId }
      ];
    }

    options.where = whereClause;

    // Get projects with pagination
    const { count, rows } = await Project.findAndCountAll(options);

    // Get task count for each project
    for (const project of rows) {
      const taskCount = await Task.count({
        where: { project_id: project.id }
      });
      project.dataValues.taskCount = taskCount;
    }

    res.status(200).json({
      data: rows,
      meta: {
        total: count,
        limit: options.limit,
        offset: options.offset
      }
    });
  } catch (error) {
    logger.error('Error getting projects:', error);
    res.status(500).json({ error: 'Server error getting projects' });
  }
};

/**
 * Get project by ID
 * @route GET /api/projects/:id
 */
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the project with basic associations
    const project = await Project.findByPk(id, {
      include: [
        {
          model: Team,
          attributes: ['id', 'name'],
          required: true
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has access to the project
    if (!isAdmin) {
      // Check if user is member of the project's team
      const isMember = await TeamMember.findOne({
        where: {
          team_id: project.team_id,
          user_id: userId
        }
      });

      // Allow access if user is creator or team member
      if (!isMember && project.created_by !== userId) {
        return res.status(403).json({ error: 'Not authorized to access this project' });
      }
    }

    // Get task count
    const taskCount = await Task.count({
      where: { project_id: id }
    });
    project.dataValues.taskCount = taskCount;

    // Get task statuses
    const statuses = await TaskStatus.findAll({
      where: { project_id: id },
      order: [['order_position', 'ASC']]
    });
    project.dataValues.statuses = statuses;

    res.status(200).json({
      data: project
    });
  } catch (error) {
    logger.error(`Error getting project ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error getting project' });
  }
};

/**
 * Create new project
 * @route POST /api/projects
 */
const createProject = async (req, res) => {
  try {
    const { name, description, color, icon, team_id, is_private } = req.body;
    const userId = req.user.id;

    // Check if the team exists
    const team = await Team.findByPk(team_id);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user has access to the team
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin) {
      const isMember = await TeamMember.findOne({
        where: {
          team_id,
          user_id: userId,
          role: { [Op.in]: ['owner', 'admin'] }
        }
      });
      
      if (!isMember) {
        return res.status(403).json({ error: 'Not authorized to create projects in this team' });
      }
    }

    // Create project with transaction
    const result = await sequelize.transaction(async (t) => {
      // Create new project
      const project = await Project.create({
        name,
        description,
        color,
        icon,
        team_id,
        is_private: is_private || false,
        status: 'active',
        created_by: userId
      }, { transaction: t });

      // Create default task statuses
      const defaultStatuses = [
        { name: 'To Do', color: '#6c757d', order_position: 0 },
        { name: 'In Progress', color: '#0d6efd', order_position: 1 },
        { name: 'Review', color: '#6f42c1', order_position: 2 },
        { name: 'Done', color: '#198754', order_position: 3 }
      ];

      for (const status of defaultStatuses) {
        await TaskStatus.create({
          ...status,
          project_id: project.id
        }, { transaction: t });
      }

      return project;
    });

    // After project is created, notify all team members by email (synchronous)
    for (const member of teamMembers) {
      if (member.User && member.User.email) {
        const projectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/projects/${result.id}`;
        await sendMail({
          to: member.User.email,
          subject: `New project created: ${result.name}`,
          text: `Hello ${member.User.first_name},\n\nA new project has been created in your team: ${result.name}.\n\nDescription: ${result.description || 'No description.'}\n\nPlease check the project management system for more details.`,
          html: generateEmailTemplate({
            title: 'New Project Created',
            body: `Hello <b>${member.User.first_name}</b>,<br><br>A new project has been created in your team: <b>${result.name}</b>.<br><br>Description: ${result.description || 'No description.'}`,
            buttonText: 'View Project',
            buttonUrl: projectUrl
          })
        });
      }
    }

    // Get the created project with associations
    const project = await Project.findByPk(result.id, {
      include: [
        {
          model: Team,
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    // Get default statuses
    const statuses = await TaskStatus.findAll({
      where: { project_id: project.id },
      order: [['order_position', 'ASC']]
    });
    project.dataValues.statuses = statuses;
    project.dataValues.taskCount = 0;

    res.status(201).json({
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    logger.error('Error creating project:', error);
    res.status(500).json({ error: 'Server error creating project' });
  }
};

/**
 * Update project
 * @route PUT /api/projects/:id
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, icon, team_id, is_private, status } = req.body;
    const userId = req.user.id;

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has permission to update this project
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && project.created_by !== userId) {
      // Check if user is an admin or owner of the team
      const teamMember = await TeamMember.findOne({
        where: {
          team_id: project.team_id,
          user_id: userId,
          role: { [Op.in]: ['owner', 'admin'] }
        }
      });
      
      if (!teamMember) {
        return res.status(403).json({ error: 'Not authorized to update this project' });
      }
    }

    // If changing team, check if team exists and user has access to it
    if (team_id && team_id !== project.team_id) {
      const team = await Team.findByPk(team_id);
      if (!team) {
        return res.status(404).json({ error: 'Team not found' });
      }

      // Check if user has access to the new team
      if (!isAdmin) {
        const isMember = await TeamMember.findOne({
          where: {
            team_id,
            user_id: userId,
            role: { [Op.in]: ['owner', 'admin'] }
          }
        });
        
        if (!isMember) {
          return res.status(403).json({ error: 'Not authorized to move project to this team' });
        }
      }
    }

    // Update the project
    const updateData = {};
    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (color) updateData.color = color;
    if (icon !== undefined) updateData.icon = icon;
    if (team_id) updateData.team_id = team_id;
    if (is_private !== undefined) updateData.is_private = is_private;
    if (status && ['active', 'archived'].includes(status)) updateData.status = status;

    await project.update(updateData);

    // Get the updated project with associations
    const updatedProject = await Project.findByPk(id, {
      include: [
        {
          model: Team,
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    // Get task count
    const taskCount = await Task.count({
      where: { project_id: id }
    });
    updatedProject.dataValues.taskCount = taskCount;

    res.status(200).json({
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    logger.error(`Error updating project ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error updating project' });
  }
};

/**
 * Delete project
 * @route DELETE /api/projects/:id
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has permission to delete this project
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && project.created_by !== userId) {
      // Check if user is an owner of the team
      const teamMember = await TeamMember.findOne({
        where: {
          team_id: project.team_id,
          user_id: userId,
          role: 'owner'
        }
      });
      
      if (!teamMember) {
        return res.status(403).json({ error: 'Not authorized to delete this project' });
      }
    }

    // Delete the project (cascade delete will handle related entities)
    await project.destroy();

    res.status(200).json({
      message: 'Project deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting project ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error deleting project' });
  }
};

/**
 * Get project task statuses
 * @route GET /api/projects/:id/statuses
 */
const getProjectStatuses = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has access to the project
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && project.created_by !== userId) {
      // Check if user is a member of the team
      const isMember = await TeamMember.findOne({
        where: {
          team_id: project.team_id,
          user_id: userId
        }
      });
      
      if (!isMember) {
        return res.status(403).json({ error: 'Not authorized to access this project' });
      }
    }

    // Get statuses ordered by position
    const statuses = await TaskStatus.findAll({
      where: { project_id: id },
      order: [['order_position', 'ASC']]
    });

    res.status(200).json({
      data: statuses
    });
  } catch (error) {
    logger.error(`Error getting project statuses for project ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error getting project statuses' });
  }
};

/**
 * Create task status for project
 * @route POST /api/projects/:id/statuses
 */
const createProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, order_position } = req.body;
    const userId = req.user.id;

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has permission to add status to this project
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && project.created_by !== userId) {
      // Check if user is an admin or owner of the team
      const teamMember = await TeamMember.findOne({
        where: {
          team_id: project.team_id,
          user_id: userId,
          role: { [Op.in]: ['owner', 'admin'] }
        }
      });
      
      if (!teamMember) {
        return res.status(403).json({ error: 'Not authorized to modify this project' });
      }
    }

    // Get current max order position if not provided
    let position = order_position;
    if (position === undefined) {
      const maxPosition = await TaskStatus.max('order_position', {
        where: { project_id: id }
      });
      position = (maxPosition !== null ? maxPosition : -1) + 1;
    }

    // Create new status
    const status = await TaskStatus.create({
      project_id: id,
      name,
      color,
      order_position: position
    });

    res.status(201).json({
      message: 'Status created successfully',
      data: status
    });
  } catch (error) {
    logger.error(`Error creating status for project ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error creating project status' });
  }
};

/**
 * Update task status
 * @route PUT /api/projects/:projectId/statuses/:statusId
 */
const updateProjectStatus = async (req, res) => {
  try {
    const { projectId, statusId } = req.params;
    const { name, color, order_position } = req.body;
    const userId = req.user.id;

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if status exists and belongs to the project
    const status = await TaskStatus.findOne({
      where: {
        id: statusId,
        project_id: projectId
      }
    });

    if (!status) {
      return res.status(404).json({ error: 'Status not found in this project' });
    }

    // Check if user has permission to update status in this project
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && project.created_by !== userId) {
      // Check if user is an admin or owner of the team
      const teamMember = await TeamMember.findOne({
        where: {
          team_id: project.team_id,
          user_id: userId,
          role: { [Op.in]: ['owner', 'admin'] }
        }
      });
      
      if (!teamMember) {
        return res.status(403).json({ error: 'Not authorized to modify this project' });
      }
    }

    // Update the status
    const updateData = {};
    if (name) updateData.name = name;
    if (color) updateData.color = color;
    if (order_position !== undefined) updateData.order_position = order_position;

    await status.update(updateData);

    res.status(200).json({
      message: 'Status updated successfully',
      data: status
    });
  } catch (error) {
    logger.error(`Error updating status ${req.params.statusId} for project ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Server error updating project status' });
  }
};

/**
 * Delete task status
 * @route DELETE /api/projects/:projectId/statuses/:statusId
 */
const deleteProjectStatus = async (req, res) => {
  try {
    const { projectId, statusId } = req.params;
    const userId = req.user.id;

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if status exists and belongs to the project
    const status = await TaskStatus.findOne({
      where: {
        id: statusId,
        project_id: projectId
      }
    });

    if (!status) {
      return res.status(404).json({ error: 'Status not found in this project' });
    }

    // Check if user has permission to delete status in this project
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && project.created_by !== userId) {
      // Check if user is an admin or owner of the team
      const teamMember = await TeamMember.findOne({
        where: {
          team_id: project.team_id,
          user_id: userId,
          role: { [Op.in]: ['owner', 'admin'] }
        }
      });
      
      if (!teamMember) {
        return res.status(403).json({ error: 'Not authorized to modify this project' });
      }
    }

    // Check if there are tasks using this status
    const tasksCount = await Task.count({
      where: {
        project_id: projectId,
        status_id: statusId
      }
    });

    if (tasksCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete status that is being used by tasks',
        tasksCount
      });
    }

    // Delete the status
    await status.destroy();

    res.status(200).json({
      message: 'Status deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting status ${req.params.statusId} for project ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Server error deleting project status' });
  }
};

/**
 * Reorder task statuses
 * @route PUT /api/projects/:id/statuses/reorder
 */
const reorderProjectStatuses = async (req, res) => {
  try {
    const { id } = req.params;
    const { statusOrder } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(statusOrder)) {
      return res.status(400).json({ error: 'Status order must be an array of status IDs' });
    }

    // Check if project exists
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has permission to modify this project
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && project.created_by !== userId) {
      // Check if user is an admin or owner of the team
      const teamMember = await TeamMember.findOne({
        where: {
          team_id: project.team_id,
          user_id: userId,
          role: { [Op.in]: ['owner', 'admin'] }
        }
      });
      
      if (!teamMember) {
        return res.status(403).json({ error: 'Not authorized to modify this project' });
      }
    }

    // Get all statuses for this project
    const statuses = await TaskStatus.findAll({
      where: { project_id: id }
    });

    // Check if all statuses exist in the project
    const statusIds = statuses.map(s => s.id);
    for (const statusId of statusOrder) {
      if (!statusIds.includes(statusId)) {
        return res.status(400).json({ error: `Status with ID ${statusId} not found in this project` });
      }
    }

    // Update order positions
    await sequelize.transaction(async (t) => {
      for (let i = 0; i < statusOrder.length; i++) {
        await TaskStatus.update(
          { order_position: i },
          { 
            where: { 
              id: statusOrder[i],
              project_id: id
            },
            transaction: t
          }
        );
      }
    });

    // Get updated statuses
    const updatedStatuses = await TaskStatus.findAll({
      where: { project_id: id },
      order: [['order_position', 'ASC']]
    });

    res.status(200).json({
      message: 'Statuses reordered successfully',
      data: updatedStatuses
    });
  } catch (error) {
    logger.error(`Error reordering statuses for project ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error reordering project statuses' });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStatuses,
  createProjectStatus,
  updateProjectStatus,
  deleteProjectStatus,
  reorderProjectStatuses
};