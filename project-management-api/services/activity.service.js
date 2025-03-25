const UserActivity = require('../models/user-activity.model');
const Task = require('../models/task.model');
const Project = require('../models/project.model');

/**
 * Service to track and record user activities for reporting purposes
 */
const activityService = {
  /**
   * Record task creation activity
   * @param {number} userId - The ID of the user
   * @param {number} taskId - The ID of the task
   */
  async trackTaskCreated(userId, taskId) {
    try {
      // Get related project and team info
      const task = await Task.findByPk(taskId, {
        include: [
          {
            model: Project,
            attributes: ['id', 'team_id']
          }
        ]
      });

      if (!task) {
        throw new Error(`Task with ID ${taskId} not found`);
      }

      await UserActivity.create({
        user_id: userId,
        activity_type: 'task_created',
        task_id: taskId,
        project_id: task.Project.id,
        team_id: task.Project.team_id
      });
    } catch (error) {
      console.error('Error tracking task creation:', error);
      // Don't throw - activity tracking should not break the main flow
    }
  },

  /**
   * Record task update activity
   * @param {number} userId - The ID of the user
   * @param {number} taskId - The ID of the task
   */
  async trackTaskUpdated(userId, taskId) {
    try {
      // Get related project and team info
      const task = await Task.findByPk(taskId, {
        include: [
          {
            model: Project,
            attributes: ['id', 'team_id']
          }
        ]
      });

      if (!task) {
        throw new Error(`Task with ID ${taskId} not found`);
      }

      await UserActivity.create({
        user_id: userId,
        activity_type: 'task_updated',
        task_id: taskId,
        project_id: task.Project.id,
        team_id: task.Project.team_id
      });
    } catch (error) {
      console.error('Error tracking task update:', error);
      // Don't throw - activity tracking should not break the main flow
    }
  },

  /**
   * Record task comment activity
   * @param {number} userId - The ID of the user
   * @param {number} taskId - The ID of the task
   */
  async trackTaskCommented(userId, taskId) {
    try {
      // Get related project and team info
      const task = await Task.findByPk(taskId, {
        include: [
          {
            model: Project,
            attributes: ['id', 'team_id']
          }
        ]
      });

      if (!task) {
        throw new Error(`Task with ID ${taskId} not found`);
      }

      await UserActivity.create({
        user_id: userId,
        activity_type: 'task_commented',
        task_id: taskId,
        project_id: task.Project.id,
        team_id: task.Project.team_id
      });
    } catch (error) {
      console.error('Error tracking task comment:', error);
      // Don't throw - activity tracking should not break the main flow
    }
  },

  /**
   * Record time tracking activity
   * @param {number} userId - The ID of the user
   * @param {number} taskId - The ID of the task
   * @param {number} duration - The duration of time tracked in minutes
   */
  async trackTimeTracked(userId, taskId, duration) {
    try {
      // Get related project and team info
      const task = await Task.findByPk(taskId, {
        include: [
          {
            model: Project,
            attributes: ['id', 'team_id']
          }
        ]
      });

      if (!task) {
        throw new Error(`Task with ID ${taskId} not found`);
      }

      await UserActivity.create({
        user_id: userId,
        activity_type: 'time_tracked',
        task_id: taskId,
        project_id: task.Project.id,
        team_id: task.Project.team_id,
        duration
      });
    } catch (error) {
      console.error('Error tracking time entry:', error);
      // Don't throw - activity tracking should not break the main flow
    }
  }
};

module.exports = activityService;