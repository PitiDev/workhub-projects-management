// routes/analytics.routes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { auth } = require('../middleware/auth.middleware');

// Apply authentication middleware to all analytics routes
router.use(auth);

// Dashboard overview metrics
router.get('/overview', analyticsController.getOverview);

// Task completion trend data
router.get('/tasks/trend', analyticsController.getTaskCompletionTrend);

// Task status distribution
router.get('/tasks/status-distribution', analyticsController.getTaskStatusDistribution);

// Project progress data
router.get('/projects/progress', analyticsController.getProjectProgress);

// Team performance metrics
router.get('/team/performance', analyticsController.getTeamPerformance);

// Task priority distribution by project
router.get('/tasks/priority-distribution', analyticsController.getTaskPriorityDistribution);

// Recent activity
router.get('/activity', analyticsController.getRecentActivity);

// Burndown data for specific project
router.get('/projects/:projectId/burndown', analyticsController.getBurndownChart);

// User productivity metrics
router.get('/users/:userId/productivity', analyticsController.getUserProductivity);

// Task completion by assignee
router.get('/tasks/by-assignee', analyticsController.getTaskCompletionByAssignee);

// Task growth over time
router.get('/tasks/growth', analyticsController.getTaskGrowthTrend);

module.exports = router;