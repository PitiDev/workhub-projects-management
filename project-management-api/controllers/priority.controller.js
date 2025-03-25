const { Op } = require('sequelize');
const Priority = require('../models/priority.model');
const logger = require('../utils/logger');

/**
 * Get all priorities
 * @route GET /api/priorities
 */
const getAllPriorities = async (req, res) => {
  try {
    // Get priorities ordered by position
    const priorities = await Priority.findAll({
      order: [['order_position', 'ASC']]
    });

    res.status(200).json({
      data: priorities
    });
  } catch (error) {
    logger.error('Error getting priorities:', error);
    res.status(500).json({ error: 'Server error getting priorities' });
  }
};

/**
 * Get priority by ID
 * @route GET /api/priorities/:id
 */
const getPriorityById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find priority
    const priority = await Priority.findByPk(id);

    if (!priority) {
      return res.status(404).json({ error: 'Priority not found' });
    }

    res.status(200).json({
      data: priority
    });
  } catch (error) {
    logger.error(`Error getting priority ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error getting priority' });
  }
};

/**
 * Create new priority (admin only)
 * @route POST /api/priorities
 */
const createPriority = async (req, res) => {
  try {
    // Only admins can create global priorities
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only administrators can create global priorities' });
    }

    const { name, color, icon, order_position } = req.body;

    // Get current max order position if not provided
    let position = order_position;
    if (position === undefined) {
      const maxPosition = await Priority.max('order_position');
      position = (maxPosition !== null ? maxPosition : -1) + 1;
    }

    // Create new priority
    const priority = await Priority.create({
      name,
      color,
      icon,
      order_position: position
    });

    res.status(201).json({
      message: 'Priority created successfully',
      data: priority
    });
  } catch (error) {
    logger.error('Error creating priority:', error);
    res.status(500).json({ error: 'Server error creating priority' });
  }
};

/**
 * Update priority (admin only)
 * @route PUT /api/priorities/:id
 */
const updatePriority = async (req, res) => {
  try {
    // Only admins can update global priorities
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only administrators can update global priorities' });
    }

    const { id } = req.params;
    const { name, color, icon, order_position } = req.body;

    // Check if priority exists
    const priority = await Priority.findByPk(id);
    if (!priority) {
      return res.status(404).json({ error: 'Priority not found' });
    }

    // Update the priority
    const updateData = {};
    if (name) updateData.name = name;
    if (color !== undefined) updateData.color = color;
    if (icon !== undefined) updateData.icon = icon;
    if (order_position !== undefined) updateData.order_position = order_position;

    await priority.update(updateData);

    res.status(200).json({
      message: 'Priority updated successfully',
      data: priority
    });
  } catch (error) {
    logger.error(`Error updating priority ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error updating priority' });
  }
};

/**
 * Delete priority (admin only)
 * @route DELETE /api/priorities/:id
 */
const deletePriority = async (req, res) => {
  try {
    // Only admins can delete global priorities
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only administrators can delete global priorities' });
    }

    const { id } = req.params;

    // Check if priority exists
    const priority = await Priority.findByPk(id);
    if (!priority) {
      return res.status(404).json({ error: 'Priority not found' });
    }

    // Delete the priority
    await priority.destroy();

    res.status(200).json({
      message: 'Priority deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting priority ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error deleting priority' });
  }
};

/**
 * Reorder priorities (admin only)
 * @route PUT /api/priorities/reorder
 */
const reorderPriorities = async (req, res) => {
  try {
    // Only admins can reorder global priorities
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only administrators can reorder global priorities' });
    }

    const { priorityOrder } = req.body;

    if (!Array.isArray(priorityOrder)) {
      return res.status(400).json({ error: 'Priority order must be an array of priority IDs' });
    }

    // Get all priorities
    const priorities = await Priority.findAll();
    const priorityIds = priorities.map(p => p.id);

    // Check if all priorities exist
    for (const priorityId of priorityOrder) {
      if (!priorityIds.includes(priorityId)) {
        return res.status(400).json({ error: `Priority with ID ${priorityId} not found` });
      }
    }

    // Update order positions
    for (let i = 0; i < priorityOrder.length; i++) {
      await Priority.update(
        { order_position: i },
        { where: { id: priorityOrder[i] } }
      );
    }

    // Get updated priorities
    const updatedPriorities = await Priority.findAll({
      order: [['order_position', 'ASC']]
    });

    res.status(200).json({
      message: 'Priorities reordered successfully',
      data: updatedPriorities
    });
  } catch (error) {
    logger.error('Error reordering priorities:', error);
    res.status(500).json({ error: 'Server error reordering priorities' });
  }
};

module.exports = {
  getAllPriorities,
  getPriorityById,
  createPriority,
  updatePriority,
  deletePriority,
  reorderPriorities
};