const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const Checklist = require('../models/checklist.model');
const ChecklistItem = require('../models/checklist-item.model');
const Task = require('../models/task.model');
const Project = require('../models/project.model');
const TeamMember = require('../models/team-member.model');
const logger = require('../utils/logger');

/**
 * Get a checklist item by ID
 * @route GET /api/checklist-items/:id
 * @access Private
 */
const getChecklistItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the checklist item
    const checklistItem = await ChecklistItem.findByPk(id, {
      include: [
        {
          model: Checklist,
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
        }
      ]
    });

    if (!checklistItem) {
      return res.status(404).json({ error: 'Checklist item not found' });
    }

    // Get associated task for authorization
    const task = checklistItem.Checklist.Task;

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
        return res.status(403).json({ error: 'Not authorized to access this checklist item' });
      }
    }

    res.status(200).json({
      data: checklistItem
    });
  } catch (error) {
    logger.error(`Error getting checklist item ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error getting checklist item' });
  }
};

/**
 * Update a checklist item
 * @route PUT /api/checklist-items/:id
 * @access Private
 */
const updateChecklistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, is_completed, order_position } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the checklist item
    const checklistItem = await ChecklistItem.findByPk(id, {
      include: [
        {
          model: Checklist,
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
        }
      ]
    });

    if (!checklistItem) {
      return res.status(404).json({ error: 'Checklist item not found' });
    }

    // Get associated task for authorization
    const task = checklistItem.Checklist.Task;

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
        return res.status(403).json({ error: 'Not authorized to update this checklist item' });
      }
    }

    // Update the checklist item
    const updateData = {};
    if (content !== undefined) updateData.content = content;
    if (is_completed !== undefined) updateData.is_completed = is_completed;
    if (order_position !== undefined) updateData.order_position = order_position;

    await checklistItem.update(updateData);

    res.status(200).json({
      message: 'Checklist item updated successfully',
      data: checklistItem
    });
  } catch (error) {
    logger.error(`Error updating checklist item ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error updating checklist item' });
  }
};

/**
 * Delete a checklist item
 * @route DELETE /api/checklist-items/:id
 * @access Private
 */
const deleteChecklistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the checklist item
    const checklistItem = await ChecklistItem.findByPk(id, {
      include: [
        {
          model: Checklist,
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
        }
      ]
    });

    if (!checklistItem) {
      return res.status(404).json({ error: 'Checklist item not found' });
    }

    // Get associated task for authorization
    const task = checklistItem.Checklist.Task;

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
        return res.status(403).json({ error: 'Not authorized to delete this checklist item' });
      }
    }

    // Delete the checklist item
    await checklistItem.destroy();

    res.status(200).json({
      message: 'Checklist item deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting checklist item ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error deleting checklist item' });
  }
};

/**
 * Create a checklist item
 * @route POST /api/checklists/:id/items
 * @access Private
 */
const createChecklistItem = async (req, res) => {
  try {
    const { id } = req.params; // Checklist ID
    const { content, is_completed, order_position } = req.body;
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
        return res.status(403).json({ error: 'Not authorized to modify this checklist' });
      }
    }

    // Get max order position
    const maxOrderPosition = await ChecklistItem.max('order_position', {
      where: { checklist_id: id }
    }) || 0;

    // Create checklist item
    const checklistItem = await ChecklistItem.create({
      checklist_id: id,
      content: content,
      is_completed: is_completed || false,
      order_position: order_position || maxOrderPosition + 1
    });

    res.status(201).json({
      message: 'Checklist item created successfully',
      data: checklistItem
    });
  } catch (error) {
    logger.error(`Error creating checklist item for checklist ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error creating checklist item' });
  }
};

module.exports = {
  getChecklistItemById,
  updateChecklistItem,
  deleteChecklistItem,
  createChecklistItem
};