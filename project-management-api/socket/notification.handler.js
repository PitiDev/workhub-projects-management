const logger = require('../utils/logger');
const Notification = require('../models/notification.model');

/**
 * Notification socket handler
 * @param {Object} io - Socket.IO instance
 * @param {Object} socket - Socket instance
 */
module.exports = (io, socket) => {
  /**
   * Subscribe to notifications
   */
  socket.on('subscribe-notifications', async () => {
    try {
      const userId = socket.user.id;
      logger.debug(`User ${userId} subscribed to notifications`);
      
      // Get unread notifications count for this user
      const unreadCount = await Notification.count({
        where: {
          user_id: userId,
          is_read: false
        }
      });
      
      // Send unread count to the user
      socket.emit('notification-count', { count: unreadCount });
    } catch (error) {
      logger.error('Socket error in subscribe-notifications:', error);
      socket.emit('error', { message: 'Failed to subscribe to notifications' });
    }
  });
  
  /**
   * Mark notification as read
   */
  socket.on('mark-notification-read', async (notificationId) => {
    try {
      const userId = socket.user.id;
      logger.debug(`User ${userId} marking notification ${notificationId} as read`);
      
      // Update notification
      await Notification.update(
        { is_read: true },
        {
          where: {
            id: notificationId,
            user_id: userId
          }
        }
      );
      
      // Get new unread count
      const unreadCount = await Notification.count({
        where: {
          user_id: userId,
          is_read: false
        }
      });
      
      // Send updated count to the user
      socket.emit('notification-count', { count: unreadCount });
    } catch (error) {
      logger.error('Socket error in mark-notification-read:', error);
      socket.emit('error', { message: 'Failed to mark notification as read' });
    }
  });
  
  /**
   * Mark all notifications as read
   */
  socket.on('mark-all-notifications-read', async () => {
    try {
      const userId = socket.user.id;
      logger.debug(`User ${userId} marking all notifications as read`);
      
      // Update all notifications
      await Notification.update(
        { is_read: true },
        {
          where: {
            user_id: userId,
            is_read: false
          }
        }
      );
      
      // Send updated count to the user
      socket.emit('notification-count', { count: 0 });
    } catch (error) {
      logger.error('Socket error in mark-all-notifications-read:', error);
      socket.emit('error', { message: 'Failed to mark all notifications as read' });
    }
  });
  
  /**
   * Create and send a notification to a user
   * @param {number} userId - User ID
   * @param {Object} notification - Notification data
   */
  const sendNotification = async (userId, notification) => {
    try {
      // Create notification in database
      const newNotification = await Notification.create({
        user_id: userId,
        title: notification.title,
        content: notification.content,
        link: notification.link,
        is_read: false
      });
      
      // Send notification to the user in real-time
      io.to(`user:${userId}`).emit('new-notification', newNotification);
      
      // Get new unread count
      const unreadCount = await Notification.count({
        where: {
          user_id: userId,
          is_read: false
        }
      });
      
      // Send updated count to the user
      io.to(`user:${userId}`).emit('notification-count', { count: unreadCount });
    } catch (error) {
      logger.error('Error sending notification:', error);
    }
  };
  
  // Attach the sendNotification function to the socket for other handlers to use
  socket.sendNotification = sendNotification;
  
  /**
   * Listen for notifications to send from other parts of the application
   */
  socket.on('send-notification', async ({ userId, notification }) => {
    try {
      // Only users with admin role or the notification creator can send notifications
      if (socket.user.role !== 'admin' && notification.created_by !== socket.user.id) {
        return socket.emit('error', { message: 'Not authorized to send notifications' });
      }
      
      await sendNotification(userId, notification);
    } catch (error) {
      logger.error('Socket error in send-notification:', error);
      socket.emit('error', { message: 'Failed to send notification' });
    }
  });
  
  /**
   * Listen for system notifications
   * These are notifications sent by the system itself, not by users
   */
  socket.on('system-notification', async ({ userId, notification }) => {
    try {
      // Only server-side code should use this event
      // This is for security purposes
      if (socket.handshake.address !== '::1' && socket.handshake.address !== '127.0.0.1') {
        return logger.warn('Unauthorized system notification attempt', {
          ip: socket.handshake.address,
          userId: socket.user.id
        });
      }
      
      await sendNotification(userId, notification);
    } catch (error) {
      logger.error('Socket error in system-notification:', error);
    }
  });
  
  /**
   * Delete notification
   */
  socket.on('delete-notification', async (notificationId) => {
    try {
      const userId = socket.user.id;
      logger.debug(`User ${userId} deleting notification ${notificationId}`);
      
      // Delete notification
      await Notification.destroy({
        where: {
          id: notificationId,
          user_id: userId
        }
      });
      
      // Get new unread count
      const unreadCount = await Notification.count({
        where: {
          user_id: userId,
          is_read: false
        }
      });
      
      // Send updated count to the user
      socket.emit('notification-count', { count: unreadCount });
    } catch (error) {
      logger.error('Socket error in delete-notification:', error);
      socket.emit('error', { message: 'Failed to delete notification' });
    }
  });
};