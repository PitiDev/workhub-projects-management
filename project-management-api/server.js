const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const errorMiddleware = require('./middleware/error.middleware');

// Load environment variables
dotenv.config();

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 3001;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIO(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  }
});
require('./socket')(io);

// Middleware
app.use(cors(require('./config/cors')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Load database and test connection
const { testConnection } = require('./config/database');
testConnection()
  .then(() => {
    logger.info('Database connection successful');
  })
  .catch((error) => {
    logger.error('Database connection failed:', error);
    process.exit(1);
  });

// Load models and associations
// This line is crucial - it ensures all associations are set up before routes
require('./models');

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/teams', require('./routes/team.routes'));
app.use('/api/projects', require('./routes/project.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/priorities', require('./routes/priority.routes'));
app.use('/api/time-entries', require('./routes/time-entry.routes'));
app.use('/api/comments', require('./routes/comment.routes'));
app.use('/api/attachments', require('./routes/attachment.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/tags', require('./routes/tag.routes'));
app.use('/api/checklists', require('./routes/checklist.routes'));
app.use('/api/views', require('./routes/view.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));
app.use('/api/notes', require('./routes/note.routes'));
app.use('/api/checklists',require('./routes/checklist.routes'));
app.use('/api/checklist-items',require('./routes/checklist-item.routes'));
app.use('/api/comments', require('./routes/comment.routes'));
app.use('/api/status', require('./routes/taskStatus.routes'));
app.use('/api/reports', require('./routes/report.routes'));
app.use('/api/search', require('./routes/search.routes'));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware (should be last)
app.use(errorMiddleware);

// Start the server
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
});


// app.get('/test-email-lookup', async (req, res) => {
//   try {
//     const { email } = req.query;
//     console.log('Direct test route called with email:', email);
    
//     if (!email) {
//       return res.status(400).json({ message: 'Email parameter required' });
//     }
    
//     // Access the User model directly
//     const User = require('./models/user.model'); // Adjust path as needed
    
//     // Query for the user
//     const user = await User.findOne({
//       where: { email: email }
//     });
    
//     console.log('Database query result:', user);
    
//     if (!user) {
//       return res.json({ 
//         message: 'User not found',
//         email: email
//       });
//     }
    
//     // Return user data
//     return res.json({
//       message: 'User found',
//       user: {
//         id: user.id,
//         email: user.email,
//         name: `${user.first_name} ${user.last_name}`
//       }
//     });
//   } catch (error) {
//     console.error('Error in direct test route:', error);
//     return res.status(500).json({
//       message: 'Error processing request',
//       error: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// });

module.exports = { app, server, io };