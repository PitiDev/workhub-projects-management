const logger = require('../utils/logger');
const Task = require('../models/task.model');

/**
 * Task socket handler
 * @param {Object} io - Socket.IO instance
 * @param {Object} socket - Socket instance
 */
module.exports = (io, socket) => {
  /**
   * Handle task creation event
   */
  socket.on('create-task', async (taskData) => {
    try {
      logger.debug('Socket event: create-task', { userId: socket.user.id, taskData });
      
      // Notify all users in the project room
      if (taskData && taskData.project_id) {
        io.to(`project:${taskData.project_id}`).emit('task-created', taskData);
      }
    } catch (error) {
      logger.error('Socket error in create-task:', error);
      socket.emit('error', { message: 'Failed to handle task creation event' });
    }
  });
  
  /**
   * Handle task update event
   */
  socket.on('update-task', async (taskData) => {
    try {
      logger.debug('Socket event: update-task', { userId: socket.user.id, taskId: taskData.id });
      
      // Notify all users in the project room
      if (taskData && taskData.project_id) {
        io.to(`project:${taskData.project_id}`).emit('task-updated', taskData);
      }
      
      // If task has an assignee, also notify them personally
      if (taskData.assignee_id) {
        io.to(`user:${taskData.assignee_id}`).emit('task-assigned', taskData);
      }
    } catch (error) {
      logger.error('Socket error in update-task:', error);
      socket.emit('error', { message: 'Failed to handle task update event' });
    }
  });
  
  /**
   * Handle task deletion event
   */
  socket.on('delete-task', async (taskData) => {
    try {
      logger.debug('Socket event: delete-task', { userId: socket.user.id, taskId: taskData.id });
      
      // Notify all users in the project room
      if (taskData && taskData.project_id) {
        io.to(`project:${taskData.project_id}`).emit('task-deleted', taskData);
      }
    } catch (error) {
      logger.error('Socket error in delete-task:', error);
      socket.emit('error', { message: 'Failed to handle task deletion event' });
    }
  });
  
  /**
   * Handle task comment event
   */
  socket.on('add-comment', async (commentData) => {
    try {
      logger.debug('Socket event: add-comment', { 
        userId: socket.user.id, 
        taskId: commentData.task_id 
      });
      
      // Find the task to get project_id
      const task = await Task.findByPk(commentData.task_id);
      
      if (task) {
        // Notify all users in the project room
        io.to(`project:${task.project_id}`).emit('comment-added', {
          ...commentData,
          project_id: task.project_id
        });
      }
    } catch (error) {
      logger.error('Socket error in add-comment:', error);
      socket.emit('error', { message: 'Failed to handle comment event' });
    }
  });
};