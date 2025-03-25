const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const checklistItemController = require('../controllers/checklist-item.controller');
const router = express.Router();

// All routes require authentication
router.use(auth);

// Checklist item routes
router.get('/:id', checklistItemController.getChecklistItemById);
router.put('/:id', checklistItemController.updateChecklistItem);
router.delete('/:id', checklistItemController.deleteChecklistItem);

module.exports = router;