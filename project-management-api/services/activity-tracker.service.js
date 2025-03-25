const UserActivity = require('../models/user-activity.model');
const Task = require('../models/task.model');
const Project = require('../models/project.model');
const logger = require('../utils/logger');

class ActivityTrackerService {
  /**
   * Record a user activity in the database
   * 
   * @param {Object} data - Activity data
   * @param {number} data.userId - User ID
   * @param {string} data.activityType - Type of activity
   * @param {string} [data.description] - Optional description
   * @param {number} [data.taskId] - Related task ID
   * @param {number} [data.projectId] - Related project ID
   * @param {number} [data.teamId] - Related team ID
   * @param {number} [data.durationMinutes] - Duration in minutes (for time tracking)
   * @returns {Promise<Object>} - Created activity record
   */
  static async recordActivity(data) {
    try {
      // Extract required data
      const { 
        userId, 
        activityType, 
        description, 
        taskId, 
        projectId, 
        teamId, 
        durationMinutes 
      } = data;
      
      // Validate required fields
      if (!userId || !activityType) {
        throw new Error('User ID and activity type are required');
      }
      
      // If task ID is provided but not project/team ID, try to get them
      let finalProjectId = projectId;
      let finalTeamId = teamId;
      
      if (taskId && (!projectId || !teamId)) {
        try {
          const task = await Task.findByPk(taskId, {
            include: [
              {
                model: Project,
                attributes: ['id', 'team_id']
              }
            ]
          });
          
          if (task && task.Project) {
            finalProjectId = task.Project.id;
            finalTeamId = task.Project.team_id;
          }
        } catch (error) {
          logger.warn('Error fetching task relations:', error.message);
          // Continue without project/team ID if lookup fails
        }
      }
      
      // Create activity record
      const activity = await UserActivity.create({
        user_id: userId,
        activity_type: activityType,
        description,
        task_id: taskId || null,
        project_id: finalProjectId || null,
        team_id: finalTeamId || null,
        duration_minutes: durationMinutes || null,
        created_at: new Date()
      });
      
      return activity;
    } catch (error) {
      logger.error('Error recording user activity:', error);
      // Return null instead of throwing to prevent disrupting the main app flow
      return null;
    }
  }
  
  /**
   * Record task creation
   */
  static async trackTaskCreated(userId, taskId, taskName) {
    return this.recordActivity({
      userId,
      activityType: 'task_created',
      description: `Created task: ${taskName}`,
      taskId
    });
  }
  
  /**
   * Record task update
   */
  static async trackTaskUpdated(userId, taskId, description) {
    return this.recordActivity({
      userId,
      activityType: 'task_updated',
      description: description || 'Updated task details',
      taskId
    });
  }
  
  /**
   * Record task assignment
   */
  static async trackTaskAssigned(userId, taskId, assigneeId, assigneeName) {
    return this.recordActivity({
      userId,
      activityType: 'task_assigned',
      description: `Assigned to ${assigneeName || 'another user'}`,
      taskId
    });
  }
  
  /**
   * Record task status change
   */
  static async trackTaskStatusChanged(userId, taskId, newStatus) {
    return this.recordActivity({
      userId,
      activityType: 'task_status_changed',
      description: `Changed status to ${newStatus}`,
      taskId
    });
  }
  
  /**
   * Record comment added
   */
  static async trackCommentAdded(userId, taskId, commentContent) {
    return this.recordActivity({
      userId,
      activityType: 'comment_added',
      description: commentContent ? `Added comment: ${commentContent.substring(0, 50)}${commentContent.length > 50 ? '...' : ''}` : 'Added a comment',
      taskId
    });
  }
  
  /**
   * Record time tracked
   */
  static async trackTimeTracked(userId, taskId, durationMinutes, description) {
    return this.recordActivity({
      userId,
      activityType: 'time_tracked',
      description: description || `Tracked ${durationMinutes} minutes`,
      taskId,
      durationMinutes
    });
  }
  
  /**
   * Record user login
   */
  static async trackLogin(userId) {
    return this.recordActivity({
      userId,
      activityType: 'login',
      description: 'User logged in'
    });
  }
  
  /**
   * Record user logout
   */
  static async trackLogout(userId) {
    return this.recordActivity({
      userId,
      activityType: 'logout',
      description: 'User logged out'
    });
  }
}

module.exports = ActivityTrackerService;