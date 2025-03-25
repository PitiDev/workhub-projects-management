const { Op } = require('sequelize');
const TaskStatus = require('../models/task-status.model');
const Project = require('../models/project.model');
const TeamMember = require('../models/team-member.model');
const logger = require('../utils/logger');
const { sequelize } = require('../config/database');

/**
 * Get all statuses for a project
 * @route GET /api/projects/:projectId/statuses
 * @access Private
 */
const getProjectStatuses = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the project
    const project = await Project.findByPk(projectId);
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

      if (!isMember) {
        return res.status(403).json({ error: 'Not authorized to access this project' });
      }
    }

    // Get all statuses for the project
    const statuses = await TaskStatus.findAll({
      where: { project_id: projectId },
      order: [['order_position', 'ASC']]
    });

    res.status(200).json(statuses);
  } catch (error) {
    logger.error(`Error getting project statuses for project ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Server error getting project statuses' });
  }
};

/**
 * Create a new status
 * @route POST /api/projects/:projectId/statuses
 * @access Private
 */
const createStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, color } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the project
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has access to the project
    if (!isAdmin) {
      // Check if user is member of the project's team with admin role
      const isMember = await TeamMember.findOne({
        where: {
          team_id: project.team_id,
          user_id: userId,
          role: {
            [Op.in]: ['owner', 'admin']
          }
        }
      });

      if (!isMember) {
        return res.status(403).json({ error: 'Not authorized to modify project statuses' });
      }
    }

    // Get maximum order position
    const maxPosition = await TaskStatus.max('order_position', {
      where: { project_id: projectId }
    }) || 0;

    // Create the new status
    const newStatus = await TaskStatus.create({
      project_id: projectId,
      name,
      color,
      order_position: maxPosition + 1
    });

    res.status(201).json(newStatus);
  } catch (error) {
    logger.error(`Error creating status for project ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Server error creating status' });
  }
};

/**
 * Update a status
 * @route PUT /api/projects/:projectId/statuses/:statusId
 * @access Private
 */
const updateStatus = async (req, res) => {
  try {
    const { projectId, statusId } = req.params;
    const { name, color } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the project
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has access to the project
    if (!isAdmin) {
      // Check if user is member of the project's team with admin role
      const isMember = await TeamMember.findOne({
        where: {
          team_id: project.team_id,
          user_id: userId,
          role: {
            [Op.in]: ['owner', 'admin']
          }
        }
      });

      if (!isMember) {
        return res.status(403).json({ error: 'Not authorized to modify project statuses' });
      }
    }

    // Find the status
    const status = await TaskStatus.findOne({
      where: {
        id: statusId,
        project_id: projectId
      }
    });

    if (!status) {
      return res.status(404).json({ error: 'Status not found' });
    }

    // Update the status
    await status.update({
      name: name || status.name,
      color: color || status.color
    });

    res.status(200).json(status);
  } catch (error) {
    logger.error(`Error updating status ${req.params.statusId}:`, error);
    res.status(500).json({ error: 'Server error updating status' });
  }
};

/**
 * Delete a status
 * @route DELETE /api/projects/:projectId/statuses/:statusId
 * @access Private
 */
const deleteStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { projectId, statusId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the project
    const project = await Project.findByPk(projectId, { transaction });
    if (!project) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has access to the project
    if (!isAdmin) {
      // Check if user is member of the project's team with admin role
      const isMember = await TeamMember.findOne({
        where: {
          team_id: project.team_id,
          user_id: userId,
          role: {
            [Op.in]: ['owner', 'admin']
          }
        },
        transaction
      });

      if (!isMember) {
        await transaction.rollback();
        return res.status(403).json({ error: 'Not authorized to modify project statuses' });
      }
    }

    // Find the status
    const status = await TaskStatus.findOne({
      where: {
        id: statusId,
        project_id: projectId
      },
      transaction
    });

    if (!status) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Status not found' });
    }

    // Check if there are tasks using this status
    const Task = require('../models/task.model');
    const taskCount = await Task.count({
      where: {
        status_id: statusId
      },
      transaction
    });

    if (taskCount > 0) {
      await transaction.rollback();
      return res.status(400).json({
        error: 'Cannot delete status with associated tasks. Please move tasks to another status first.'
      });
    }

    // Delete the status
    await status.destroy({ transaction });

    // Reorder remaining statuses
    await TaskStatus.decrement(
      'order_position',
      {
        where: {
          project_id: projectId,
          order_position: { [Op.gt]: status.order_position }
        },
        transaction
      }
    );

    await transaction.commit();
    res.status(200).json({ message: 'Status deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error deleting status ${req.params.statusId}:`, error);
    res.status(500).json({ error: 'Server error deleting status' });
  }
};

/**
 * Reorder statuses
 * @route PUT /api/projects/:projectId/statuses/reorder
 * @access Private
 */
const reorderStatuses = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { projectId } = req.params;
    const { statusOrder } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!statusOrder || !Array.isArray(statusOrder)) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Status order must be provided as an array' });
    }

    // Find the project
    const project = await Project.findByPk(projectId, { transaction });
    if (!project) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has access to the project
    if (!isAdmin) {
      // Check if user is member of the project's team with admin role
      const isMember = await TeamMember.findOne({
        where: {
          team_id: project.team_id,
          user_id: userId,
          role: {
            [Op.in]: ['owner', 'admin']
          }
        },
        transaction
      });

      if (!isMember) {
        await transaction.rollback();
        return res.status(403).json({ error: 'Not authorized to modify project statuses' });
      }
    }

    // Verify all statuses exist and belong to the project
    const projectStatuses = await TaskStatus.findAll({
      where: {
        project_id: projectId
      },
      transaction
    });

    if (projectStatuses.length !== statusOrder.length) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Status order must include all project statuses' });
    }

    const statusIds = projectStatuses.map(status => status.id.toString());
    for (const id of statusOrder) {
      if (!statusIds.includes(id.toString())) {
        await transaction.rollback();
        return res.status(400).json({ error: `Status id ${id} does not belong to this project` });
      }
    }

    // Update the order_position for each status
    for (let i = 0; i < statusOrder.length; i++) {
      await TaskStatus.update(
        { order_position: i },
        {
          where: {
            id: statusOrder[i],
            project_id: projectId
          },
          transaction
        }
      );
    }

    await transaction.commit();
    res.status(200).json({ message: 'Statuses reordered successfully' });
  } catch (error) {
    await transaction.rollback();
    logger.error(`Error reordering statuses for project ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Server error reordering statuses' });
  }
};

module.exports = {
  getProjectStatuses,
  createStatus,
  updateStatus,
  deleteStatus,
  reorderStatuses
};