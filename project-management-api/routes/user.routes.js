const express = require('express');
const { auth, adminAuth } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');
const userController = require('../controllers/user.controller');
const router = express.Router();

// Public routes - none

// Protected routes (require authentication)
router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, userController.updateUserProfile);
router.post('/change-password', auth, userController.changePassword);

router.get('/check-email', userController.checkUserEmail);
router.get('/search', userController.searchUsers);


// Admin routes
router.get('/', auth, userController.getAllUsers);
router.get('/:id', auth, userController.getUserById);
router.post('/', adminAuth, validate(schemas.createUser), userController.createUser);
router.put('/:id', auth, validate(schemas.updateUser), userController.updateUser);
router.delete('/:id', adminAuth, userController.deleteUser);




module.exports = router;