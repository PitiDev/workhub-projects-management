const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/report.controller');
const { authMiddleware } = require('../middleware/auth.middleware');
const { auth } = require('../middleware/auth.middleware');


// Debug route to check if the router is loaded
router.get('/test', (req, res) => {
    res.json({ message: 'Reports API is working!' });
  });
  
// Apply authentication middleware to all routes
router.use(auth);

// User assignments report
router.get('/user-assignments/:teamId', reportsController.getUserAssignments);

// Project completion report
router.get('/project-completion/:teamId', reportsController.getProjectCompletion);

// User activity report
router.get('/user-activity/:teamId', reportsController.getUserActivity);

// Task distribution by status 
router.get('/task-distribution/:projectId', reportsController.getTaskDistribution);

// Time tracking report
router.get('/time-tracking', reportsController.getTimeTracking);

module.exports = router;