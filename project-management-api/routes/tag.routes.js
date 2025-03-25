const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');
const router = express.Router();

// All routes require authentication
router.use(auth);

// Get all tags for a project
router.get('/project/:projectId', (req, res) => {
  res.status(200).json({
    message: "This endpoint will list tags for a specific project",
    info: "Tag management is typically handled through project endpoints"
  });
});

module.exports = router;