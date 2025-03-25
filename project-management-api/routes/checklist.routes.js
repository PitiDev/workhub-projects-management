const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const checklistController = require('../controllers/checklist.controller');
const checklistItemController = require('../controllers/checklist-item.controller');
const router = express.Router();

// All routes require authentication
router.use(auth);

// Checklist routes
router.get('/:id', checklistController.getChecklistById);
router.put('/:id', checklistController.updateChecklist);
router.delete('/:id', checklistController.deleteChecklist);

// Checklist item routes
router.post('/:id/items', checklistItemController.createChecklistItem);
router.get('/:id/items', checklistController.getChecklistItems);

// Alternative route pattern for checklist item updates
router.put('/:checklistId/items/:id', (req, res) => {
  // Set the ID parameter from the URL and forward to the updateChecklistItem controller
  req.params.id = req.params.id;
  checklistItemController.updateChecklistItem(req, res);
});

module.exports = router;