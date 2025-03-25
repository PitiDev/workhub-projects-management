// controllers/analytics.controller.js
const analyticsService = require('../services/analytics.service');

const analyticsController = {
  // Get dashboard overview metrics
  getOverview: async (req, res, next) => {
    try {
      const { period, project_id } = req.query;
      
      // Parse project_id to integer if it exists
      const projectId = project_id ? parseInt(project_id) : undefined;
      
      const data = await analyticsService.getOverview(period, projectId);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  // Get task completion trend data
  getTaskCompletionTrend: async (req, res, next) => {
    try {
      const { period, project_id } = req.query;
      const data = await analyticsService.getTaskCompletionTrend(period, project_id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  // Get task status distribution
  getTaskStatusDistribution: async (req, res, next) => {
    try {
      const { project_id } = req.query;
      const data = await analyticsService.getTaskStatusDistribution(project_id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  // Get project progress data
  getProjectProgress: async (req, res, next) => {
    try {
      const data = await analyticsService.getProjectProgress();
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  // Get team performance metrics
  getTeamPerformance: async (req, res, next) => {
    try {
      const { period } = req.query;
      const data = await analyticsService.getTeamPerformance(period);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  // Get task priority distribution by project
  getTaskPriorityDistribution: async (req, res, next) => {
    try {
      const data = await analyticsService.getTaskPriorityDistribution();
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  // Get recent activity
  getRecentActivity: async (req, res, next) => {
    try {
      const { limit } = req.query;
      const data = await analyticsService.getRecentActivity(limit);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  // Get burndown data for specific project
  getBurndownChart: async (req, res, next) => {
    try {
      const { projectId } = req.params;
      const { period } = req.query;
      const data = await analyticsService.getBurndownChart(projectId, period);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  // Get user productivity metrics
  getUserProductivity: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const { period } = req.query;
      const data = await analyticsService.getUserProductivity(userId, period);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  // Get task completion by assignee
  getTaskCompletionByAssignee: async (req, res, next) => {
    try {
      const { period, project_id } = req.query;
      const data = await analyticsService.getTaskCompletionByAssignee(period, project_id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  },

  // Get task growth over time
  getTaskGrowthTrend: async (req, res, next) => {
    try {
      const { period, project_id } = req.query;
      const data = await analyticsService.getTaskGrowthTrend(period, project_id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = analyticsController;