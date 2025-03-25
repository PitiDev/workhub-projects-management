// plugins/socket.ts
import { io, Socket } from 'socket.io-client';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  let socket: Socket | null = null;
  
  const connectSocket = () => {
    const token = localStorage.getItem('token');
    
    if (!token || socket) return;
    
    // Parse the base URL to get the host for Socket.IO connection
    const apiUrl = new URL(config.public.apiBaseUrl);
    const socketUrl = `${apiUrl.protocol}//${apiUrl.host}`;
    
    console.log('Connecting to socket at:', socketUrl);
    
    // Enhanced Socket.IO connection options to help with CORS
    socket = io(socketUrl, {
      auth: {
        token
      },
      transports: ['websocket', 'polling'], // Try both, but websocket first
      autoConnect: true,
      withCredentials: true, // This helps with CORS credentials
      extraHeaders: {
        "Origin": window.location.origin // Explicitly set the origin
      },
      forceNew: true, // Create a new connection
      reconnectionAttempts: 5 // Limit reconnection attempts
    });
    
    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      // Log more details about the error for troubleshooting
      console.error('Error details:', {
        message: error.message,
        description: error.description,
        context: error.context
      });
    });
    
    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });
    
    // Try to reconnect if connection fails
    socket.io.on("reconnect_attempt", (attempt) => {
      console.log(`Socket reconnection attempt ${attempt}`);
    });
    
    socket.io.on("reconnect_error", (error) => {
      console.error('Socket reconnection error:', error);
    });
    
    socket.io.on("reconnect_failed", () => {
      console.error('Socket reconnection failed after maximum attempts');
    });
    
    return socket;
  };
  
  // Rest of your socket plugin code remains the same
  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  };
  
  const getSocket = () => {
    if (!socket) {
      return connectSocket();
    }
    return socket;
  };
  
  const joinProjectRoom = (projectId: number) => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.emit('join-project', { projectId });
    }
  };
  
  const leaveProjectRoom = (projectId: number) => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.emit('leave-project', { projectId });
    }
  };
  
  const subscribeToNotifications = () => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.emit('subscribe-notifications');
    }
  };
  
  const markNotificationRead = (notificationId: number) => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.emit('mark-notification-read', { notificationId });
    }
  };
  
  const markAllNotificationsRead = () => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.emit('mark-all-notifications-read');
    }
  };
  
  const onTaskCreated = (callback: Function) => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.on('task-created', callback);
    }
  };
  
  const onTaskUpdated = (callback: Function) => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.on('task-updated', callback);
    }
  };
  
  const onTaskDeleted = (callback: Function) => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.on('task-deleted', callback);
    }
  };
  
  const onNewNotification = (callback: Function) => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.on('new-notification', callback);
    }
  };
  
  const onNotificationCount = (callback: Function) => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.on('notification-count', callback);
    }
  };
  
  const createTask = (taskData: any) => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.emit('create-task', taskData);
    }
  };
  
  const updateTask = (taskId: number, taskData: any) => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.emit('update-task', { taskId, ...taskData });
    }
  };
  
  const deleteTask = (taskId: number) => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.emit('delete-task', { taskId });
    }
  };
  
  const addComment = (taskId: number, content: string) => {
    const socketInstance = getSocket();
    if (socketInstance) {
      socketInstance.emit('add-comment', { taskId, content });
    }
  };
  
  return {
    provide: {
      socket: {
        connectSocket,
        disconnectSocket,
        getSocket,
        joinProjectRoom,
        leaveProjectRoom,
        subscribeToNotifications,
        markNotificationRead,
        markAllNotificationsRead,
        onTaskCreated,
        onTaskUpdated,
        onTaskDeleted,
        onNewNotification,
        onNotificationCount,
        createTask,
        updateTask,
        deleteTask,
        addComment
      }
    }
  };
});