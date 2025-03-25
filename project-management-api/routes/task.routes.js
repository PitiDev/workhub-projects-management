const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');
const taskController = require('../controllers/task.controller');
const commentController = require('../controllers/comment.controller');
const searchController = require('../controllers/search.controller');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/search', searchController.searchTasks);

// Task routes
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validate(schemas.createTask), taskController.createTask);
router.put('/:id', validate(schemas.updateTask), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// Task comments
// router.get('/:id/comments', taskController.getTaskComments);
// router.post('/:id/comments', validate(schemas.createComment), taskController.addTaskComment);

// Task time tracking
router.get('/:id/time-entries', taskController.getTaskTimeEntries); // Add this line
router.post('/:id/time-entries', validate(schemas.createTimeEntry), taskController.startTimeTracking);
router.put('/:id/time-entries/:entryId', taskController.stopTimeTracking);

// Task checklists
router.post('/:id/checklists', taskController.createTaskChecklist);
router.get('/:id/checklists', taskController.getTaskChecklist);


// Get tasks by project
router.get('/project/:projectId', taskController.getTasksByProject);

// Task comments
router.get('/:taskId/comments', commentController.getTaskComments);
router.post('/:taskId/comments', validate(schemas.createComment), commentController.addTaskComment);


module.exports = router;