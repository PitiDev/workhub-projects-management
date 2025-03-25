const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const Checklist = require('../models/checklist.model');
const ChecklistItem = require('../models/checklist-item.model');
const Task = require('../models/task.model');
const Project = require('../models/project.model');
const TeamMember = require('../models/team-member.model');
const logger = require('../utils/logger');

/**
 * Get a checklist by ID
 * @route GET /api/checklists/:id
 * @access Private
 */
const getChecklistById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the checklist with items
    const checklist = await Checklist.findByPk(id, {
      include: [
        {
          model: ChecklistItem,
          order: [['order_position', 'ASC']]
        },
        {
          model: Task,
          include: [
            {
              model: Project,
              attributes: ['id', 'team_id']
            }
          ]
        }
      ]
    });

    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }

    // Get associated task for authorization
    const task = checklist.Task;

    // Check if user has access to the task
    if (!isAdmin) {
      // Check if user is member of the project's team
      const isMember = await TeamMember.findOne({
        where: {
          team_id: task.Project.team_id,
          user_id: userId
        }
      });

      // Allow access if user is creator, assignee, or team member
      if (!isMember && task.created_by !== userId && task.assignee_id !== userId) {
        return res.status(403).json({ error: 'Not authorized to access this checklist' });
      }
    }

    res.status(200).json({
      data: checklist
    });
  } catch (error) {
    logger.error(`Error getting checklist ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error getting checklist' });
  }
};

/**
 * Update a checklist
 * @route PUT /api/checklists/:id
 * @access Private
 */
const updateChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the checklist
    const checklist = await Checklist.findByPk(id, {
      include: [
        {
          model: Task,
          include: [
            {
              model: Project,
              attributes: ['id', 'team_id']
            }
          ]
        }
      ]
    });

    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }

    // Get associated task for authorization
    const task = checklist.Task;

    // Check if user has access to the task
    if (!isAdmin) {
      // Check if user is member of the project's team
      const isMember = await TeamMember.findOne({
        where: {
          team_id: task.Project.team_id,
          user_id: userId
        }
      });

      // Allow access if user is creator, assignee, or team member
      if (!isMember && task.created_by !== userId && task.assignee_id !== userId) {
        return res.status(403).json({ error: 'Not authorized to update this checklist' });
      }
    }

    // Update the checklist
    await checklist.update({ title });

    // Get updated checklist with items
    const updatedChecklist = await Checklist.findByPk(id, {
      include: [
        {
          model: ChecklistItem,
          order: [['order_position', 'ASC']]
        }
      ]
    });

    res.status(200).json({
      message: 'Checklist updated successfully',
      data: updatedChecklist
    });
  } catch (error) {
    logger.error(`Error updating checklist ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error updating checklist' });
  }
};

/**
 * Delete a checklist
 * @route DELETE /api/checklists/:id
 * @access Private
 */
const deleteChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the checklist
    const checklist = await Checklist.findByPk(id, {
      include: [
        {
          model: Task,
          include: [
            {
              model: Project,
              attributes: ['id', 'team_id']
            }
          ]
        }
      ]
    });

    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }

    // Get associated task for authorization
    const task = checklist.Task;

    // Check if user has access to the task
    if (!isAdmin) {
      // Check if user is member of the project's team
      const isMember = await TeamMember.findOne({
        where: {
          team_id: task.Project.team_id,
          user_id: userId
        }
      });

      // Allow access if user is creator, assignee, or team member
      if (!isMember && task.created_by !== userId && task.assignee_id !== userId) {
        return res.status(403).json({ error: 'Not authorized to delete this checklist' });
      }
    }

    // Delete the checklist
    await checklist.destroy();

    res.status(200).json({
      message: 'Checklist deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting checklist ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error deleting checklist' });
  }
};

/**
 * Get checklist items
 * @route GET /api/checklists/:id/items
 * @access Private
 */
const getChecklistItems = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the checklist
    const checklist = await Checklist.findByPk(id, {
      include: [
        {
          model: Task,
          include: [
            {
              model: Project,
              attributes: ['id', 'team_id']
            }
          ]
        }
      ]
    });

    if (!checklist) {
      return res.status(404).json({ error: 'Checklist not found' });
    }

    // Get associated task for authorization
    const task = checklist.Task;

    // Check if user has access to the task
    if (!isAdmin) {
      // Check if user is member of the project's team
      const isMember = await TeamMember.findOne({
        where: {
          team_id: task.Project.team_id,
          user_id: userId
        }
      });

      // Allow access if user is creator, assignee, or team member
      if (!isMember && task.created_by !== userId && task.assignee_id !== userId) {
        return res.status(403).json({ error: 'Not authorized to access this checklist' });
      }
    }

    // Get checklist items
    const items = await ChecklistItem.findAll({
      where: { checklist_id: id },
      order: [['order_position', 'ASC']]
    });

    res.status(200).json({
      data: items
    });
  } catch (error) {
    logger.error(`Error getting checklist items for checklist ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error getting checklist items' });
  }
};

module.exports = {
  getChecklistById,
  updateChecklist,
  deleteChecklist,
  getChecklistItems
};