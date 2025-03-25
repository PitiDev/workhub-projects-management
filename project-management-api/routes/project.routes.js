const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');
const projectController = require('../controllers/project.controller');
const searchController = require('../controllers/search.controller');

const router = express.Router();

// All routes require authentication
router.use(auth);

router.get('/search', searchController.searchProjects);

// Import sub-routes
const taskStatusRoutes = require('./taskStatus.routes');


// Project routes
router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', validate(schemas.createProject), projectController.createProject);
router.put('/:id', validate(schemas.updateProject), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Project status routes
router.get('/:id/statuses', projectController.getProjectStatuses);
router.post('/:id/statuses', validate(schemas.createTaskStatus), projectController.createProjectStatus);
router.put('/:projectId/statuses/:statusId', validate(schemas.updateTaskStatus), projectController.updateProjectStatus);
router.delete('/:projectId/statuses/:statusId', projectController.deleteProjectStatus);
router.put('/:id/statuses/reorder', projectController.reorderProjectStatuses);

router.use('/:projectId/statuses', taskStatusRoutes);




module.exports = router;