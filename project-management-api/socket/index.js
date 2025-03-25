const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const logger = require('../utils/logger');
const Comment = require('../models/comment.model');
const User = require('../models/user.model');

/**
 * Socket.IO main handler
 * @param {Object} io - Socket.IO instance
 */
module.exports = (io) => {
  // Authentication middleware for Socket.IO (simplified version)
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        logger.debug('No token provided in socket connection');
        return next(); // Allow connection but without user authentication
      }
      
      // Verify token
      try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        socket.userId = decoded.id;
        logger.debug(`Socket authenticated for user ${decoded.id}`);
      } catch (err) {
        logger.warn('Invalid token in socket connection', err);
      }
      
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });
  
  // Handle connections
  io.on('connection', (socket) => {
    const userId = socket.userId;
    
    logger.info(`Socket connected: ${socket.id}, User: ${userId || 'unauthenticated'}`);
    
    // Basic events - can be expanded later
    if (userId) {
      socket.join(`user:${userId}`);
    }
    
    // Track which task rooms the user has joined
    const joinedTasks = new Set();

    // Join a task room to receive updates about that task
    socket.on('join-task', (taskId) => {
      if (!taskId) return;
      
      const roomName = `task:${taskId}`;
      socket.join(roomName);
      joinedTasks.add(roomName);
      logger.info(`Socket ${socket.id} joined room ${roomName}`);
    });

    // Leave a task room
    socket.on('leave-task', (taskId) => {
      if (!taskId) return;
      
      const roomName = `task:${taskId}`;
      socket.leave(roomName);
      joinedTasks.delete(roomName);
      logger.info(`Socket ${socket.id} left room ${roomName}`);
    });

    // Add a comment
    socket.on('add-comment', async (data) => {
      try {
        if (!socket.userId) {
          return socket.emit('error', { message: 'Authentication required' });
        }
        
        const { taskId, content } = data;
        
        if (!taskId || !content) {
          return socket.emit('error', { message: 'Missing required fields' });
        }

        // Create the comment in the database
        const comment = await Comment.create({
          task_id: taskId,
          user_id: socket.userId,
          content: content.trim()
        });

        // Get user information
        const user = await User.findByPk(socket.userId, {
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        });

        // Create the response object
        const commentData = {
          ...comment.toJSON(),
          User: user
        };

        // Broadcast to all clients in the task room
        io.to(`task:${taskId}`).emit('new-comment', commentData);
        
        // Emit success to the sender
        socket.emit('comment-added', { success: true, data: commentData });
        
        logger.info(`New comment added to task ${taskId} by user ${socket.userId}`);
      } catch (error) {
        logger.error('Error adding comment via socket:', error);
        socket.emit('error', { message: 'Failed to add comment' });
      }
    });

    // Update a comment
    socket.on('update-comment', async (data) => {
      try {
        if (!socket.userId) {
          return socket.emit('error', { message: 'Authentication required' });
        }
        
        const { commentId, content } = data;
        
        if (!commentId || !content) {
          return socket.emit('error', { message: 'Missing required fields' });
        }

        // Find the comment
        const comment = await Comment.findByPk(commentId);
        
        if (!comment) {
          return socket.emit('error', { message: 'Comment not found' });
        }
        
        // Check authorization
        if (comment.user_id !== socket.userId) {
          return socket.emit('error', { message: 'Not authorized to update this comment' });
        }

        // Update the comment
        await comment.update({ content: content.trim() });

        // Get updated comment with user info
        const updatedComment = await Comment.findByPk(commentId, {
          include: [
            {
              model: User,
              attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
            }
          ]
        });

        // Broadcast to all clients in the task room
        io.to(`task:${comment.task_id}`).emit('comment-updated', updatedComment);
        
        // Emit success to the sender
        socket.emit('comment-update-success', { success: true, data: updatedComment });
        
        logger.info(`Comment ${commentId} updated by user ${socket.userId}`);
      } catch (error) {
        logger.error('Error updating comment via socket:', error);
        socket.emit('error', { message: 'Failed to update comment' });
      }
    });

    // Delete a comment
    socket.on('delete-comment', async (data) => {
      try {
        if (!socket.userId) {
          return socket.emit('error', { message: 'Authentication required' });
        }
        
        const { commentId } = data;
        
        if (!commentId) {
          return socket.emit('error', { message: 'Missing required fields' });
        }

        // Find the comment
        const comment = await Comment.findByPk(commentId);
        
        if (!comment) {
          return socket.emit('error', { message: 'Comment not found' });
        }
        
        // Check authorization
        if (comment.user_id !== socket.userId) {
          return socket.emit('error', { message: 'Not authorized to delete this comment' });
        }

        const taskId = comment.task_id;

        // Delete the comment
        await comment.destroy();

        // Broadcast to all clients in the task room
        io.to(`task:${taskId}`).emit('comment-deleted', { id: commentId });
        
        // Emit success to the sender
        socket.emit('comment-delete-success', { success: true, id: commentId });
        
        logger.info(`Comment ${commentId} deleted by user ${socket.userId}`);
      } catch (error) {
        logger.error('Error deleting comment via socket:', error);
        socket.emit('error', { message: 'Failed to delete comment' });
      }
    });
    
    // Handle disconnections
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      
      // Leave all task rooms
      joinedTasks.forEach(room => {
        socket.leave(room);
      });
    });
  });
};