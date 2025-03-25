const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const Comment = require('../models/comment.model');
const Task = require('../models/task.model');
const Project = require('../models/project.model');
const User = require('../models/user.model');
const TeamMember = require('../models/team-member.model');
const logger = require('../utils/logger');

/**
 * Get comments for a task
 * @route GET /api/tasks/:taskId/comments
 * @access Private
 */
const getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Check if task exists and user has access
    const task = await Task.findByPk(taskId, {
      include: [
        {
          model: Project,
          attributes: ['id', 'team_id']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

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
        return res.status(403).json({ error: 'Not authorized to access comments for this task' });
      }
    }

    // Get comments for the task
    const comments = await Comment.findAll({
      where: { task_id: taskId },
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    res.status(200).json({
      data: comments
    });
  } catch (error) {
    logger.error(`Error getting comments for task ${req.params.taskId}:`, error);
    res.status(500).json({ error: 'Server error getting task comments' });
  }
};

/**
 * Add a comment to a task
 * @route POST /api/tasks/:taskId/comments
 * @access Private
 */
const addTaskComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    // Check if task exists and user has access
    const task = await Task.findByPk(taskId, {
      include: [
        {
          model: Project,
          attributes: ['id', 'team_id']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

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
        return res.status(403).json({ error: 'Not authorized to comment on this task' });
      }
    }

    // Create the comment
    const comment = await Comment.create({
      task_id: taskId,
      user_id: userId,
      content: content.trim()
    });

    // Get the created comment with user info
    const createdComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        }
      ]
    });

    res.status(201).json({
      message: 'Comment added successfully',
      data: createdComment
    });
  } catch (error) {
    logger.error(`Error adding comment to task ${req.params.taskId}:`, error);
    res.status(500).json({ error: 'Server error adding comment' });
  }
};

/**
 * Delete a comment
 * @route DELETE /api/comments/:id
 * @access Private
 */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the comment
    const comment = await Comment.findByPk(id, {
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

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user is authorized to delete the comment
    // Users can delete their own comments or if they have admin privileges on the task
    if (!isAdmin && comment.user_id !== userId) {
      // Check if user is project admin or owner
      const isMember = await TeamMember.findOne({
        where: {
          team_id: comment.Task.Project.team_id,
          user_id: userId,
          role: { [Op.in]: ['owner', 'admin'] }
        }
      });

      if (!isMember) {
        return res.status(403).json({ error: 'Not authorized to delete this comment' });
      }
    }

    // Delete the comment
    await comment.destroy();

    res.status(200).json({
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting comment ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error deleting comment' });
  }
};

/**
 * Update a comment
 * @route PUT /api/comments/:id
 * @access Private
 */
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    // Find the comment
    const comment = await Comment.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
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

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Users can only edit their own comments
    if (!isAdmin && comment.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to edit this comment' });
    }

    // Update the comment
    await comment.update({
      content: content.trim()
    });

    // Get updated comment
    const updatedComment = await Comment.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        }
      ]
    });

    res.status(200).json({
      message: 'Comment updated successfully',
      data: updatedComment
    });
  } catch (error) {
    logger.error(`Error updating comment ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error updating comment' });
  }
};

module.exports = {
  getTaskComments,
  addTaskComment,
  deleteComment,
  updateComment
};