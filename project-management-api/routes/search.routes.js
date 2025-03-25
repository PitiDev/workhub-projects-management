// routes/search.routes.js
const express = require('express');
const router = express.Router();
const searchController = require('../controllers/search.controller');
const { auth } = require('../middleware/auth.middleware');

/**
 * @route GET /api/search
 * @desc Global search across projects and tasks
 * @access Private
 */
router.get('/', auth, searchController.globalSearch);

/**
 * @route GET /api/search/projects
 * @desc Search projects
 * @access Private
 */
router.get('/projects', auth, searchController.searchProjects);

/**
 * @route GET /api/search/tasks
 * @desc Search tasks
 * @access Private
 */
router.get('/tasks', auth, searchController.searchTasks);

module.exports = router;

// In your main routes index file (routes/index.js), add:
// app.use('/api/search', require('./search.routes'));