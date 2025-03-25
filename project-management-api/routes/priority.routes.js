const express = require('express');
const { auth, adminAuth } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');
const priorityController = require('../controllers/priority.controller');
const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all priorities (any authenticated user)
router.get('/', priorityController.getAllPriorities);
router.get('/:id', priorityController.getPriorityById);

// Admin-only routes for managing priorities
// Note: The controller also checks for admin role as a second layer of security
router.post('/', adminAuth, validate(schemas.createPriority), priorityController.createPriority);
router.put('/:id', adminAuth, validate(schemas.updatePriority), priorityController.updatePriority);
router.delete('/:id', adminAuth, priorityController.deletePriority);
router.put('/reorder', adminAuth, priorityController.reorderPriorities);

module.exports = router;