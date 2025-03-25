const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { validate, noteSchemas } = require('../middleware/validation.middleware');
const noteController = require('../controllers/note.controller');
const router = express.Router();

// Protected routes (require authentication)
router.get('/', auth, noteController.getAllNotes);
router.get('/:id', auth, noteController.getNoteById);
router.post('/', auth, validate(noteSchemas.createNote), noteController.createNote);
router.put('/:id', auth, validate(noteSchemas.updateNote), noteController.updateNote);
router.delete('/:id', auth, noteController.deleteNote);
router.post('/:id/share', auth, validate(noteSchemas.shareNote), noteController.shareNote);

module.exports = router;