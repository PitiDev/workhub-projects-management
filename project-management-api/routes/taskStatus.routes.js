const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');
const taskStatusController = require('../controllers/taskStatus.controller');

const router = express.Router({ mergeParams: true }); // To access projectId from parent router

// All routes require authentication
router.use(auth);

// Get all statuses for a project
router.get('/', taskStatusController.getProjectStatuses);

// Create a new status
router.post('/', validate(schemas.createStatus), taskStatusController.createStatus);

// Update a status
router.put('/:statusId', validate(schemas.updateStatus), taskStatusController.updateStatus);

// Delete a status
router.delete('/:statusId', taskStatusController.deleteStatus);

// Reorder statuses
router.put('/reorder', validate(schemas.reorderStatuses), taskStatusController.reorderStatuses);

module.exports = router;