const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');
const commentController = require('../controllers/comment.controller');
const router = express.Router();

// All routes require authentication
router.use(auth);

// Comment routes
router.get('/task/:taskId', commentController.getTaskComments);
router.post('/task/:taskId', validate(schemas.createComment), commentController.addTaskComment);
router.put('/:id', validate(schemas.updateComment), commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;