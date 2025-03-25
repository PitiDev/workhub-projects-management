const express = require('express');
const { auth } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');
const teamController = require('../controllers/team.controller');
const router = express.Router();

// All routes require authentication
router.use(auth);

// Team routes
router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.post('/', validate(schemas.createTeam), teamController.createTeam);
router.put('/:id', validate(schemas.updateTeam), teamController.updateTeam);
router.delete('/:id', teamController.deleteTeam);

// Team member routes
router.get('/:id/members', teamController.getTeamMembers);
router.post('/:id/members', validate(schemas.teamMember), teamController.addTeamMember);
router.put('/:id/members/:userId', validate(schemas.teamMember), teamController.updateTeamMember);
router.delete('/:id/members/:userId', teamController.removeTeamMember);

module.exports = router;