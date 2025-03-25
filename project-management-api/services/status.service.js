// services/status.service.js
const { Status, Task, Project } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Get all statuses for a project
 * @param {number} projectId - Project ID
 * @returns {Array} - List of statuses
 */
exports.getStatusesByProject = async (projectId) => {
  try {
    const statuses = await Status.findAll({
      where: { project_id: projectId },
      order: [['order_position', 'ASC']],
      attributes: ['id', 'name', 'color', 'order_position', 'created_at', 'updated_at']
    });
    
    return statuses;
  } catch (error) {
    console.error(`Error in status.service.getStatusesByProject(${projectId}):`, error);
    throw error;
  }
};

/**
 * Get status by ID
 * @param {number} statusId - Status ID
 * @returns {Object} - Status object
 */
exports.getStatusById = async (statusId) => {
  try {
    const status = await Status.findByPk(statusId, {
      attributes: ['id', 'project_id', 'name', 'color', 'order_position', 'created_at', 'updated_at']
    });
    
    if (!status) {
      throw new Error('Status not found');
    }
    
    return status;
  } catch (error) {
    console.error(`Error in status.service.getStatusById(${statusId}):`, error);
    throw error;
  }
};

/**
 * Create a new status for a project
 * @param {number} projectId - Project ID
 * @param {Object} statusData - Status data
 * @returns {Object} - Created status
 */
exports.createStatus = async (projectId, statusData) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Verify project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Get max order position
    const maxPositionStatus = await Status.findOne({
      where: { project_id: projectId },
      order: [['order_position', 'DESC']],
      attributes: ['order_position'],
      transaction
    });
    
    const newPosition = maxPositionStatus ? maxPositionStatus.order_position + 1 : 0;
    
    // Create status
    const status = await Status.create({
      project_id: projectId,
      name: statusData.name,
      color: statusData.color || '#6B7280', // Default gray color
      order_position: statusData.order_position !== undefined ? statusData.order_position : newPosition
    }, { transaction });
    
    // If order_position was specified, we need to reorder other statuses
    if (statusData.order_position !== undefined) {
      await reorderStatuses(projectId, status.id, statusData.order_position, transaction);
    }
    
    await transaction.commit();
    return status;
  } catch (error) {
    await transaction.rollback();
    console.error(`Error in status.service.createStatus(${projectId}):`, error);
    throw error;
  }
};

/**
 * Update a status
 * @param {number} statusId - Status ID
 * @param {Object} statusData - Status data to update
 * @returns {Object} - Updated status
 */
exports.updateStatus = async (statusId, statusData) => {
  const transaction = await sequelize.transaction();
  
  try {
    const status = await Status.findByPk(statusId, { transaction });
    
    if (!status) {
      throw new Error('Status not found');
    }
    
    // Update name and color if provided
    if (statusData.name !== undefined) {
      status.name = statusData.name;
    }
    
    if (statusData.color !== undefined) {
      status.color = statusData.color;
    }
    
    // Handle position update if provided
    if (statusData.order_position !== undefined && statusData.order_position !== status.order_position) {
      await reorderStatuses(status.project_id, status.id, statusData.order_position, transaction);
      status.order_position = statusData.order_position;
    }
    
    await status.save({ transaction });
    await transaction.commit();
    
    return status;
  } catch (error) {
    await transaction.rollback();
    console.error(`Error in status.service.updateStatus(${statusId}):`, error);
    throw error;
  }
};

/**
 * Delete a status
 * @param {number} statusId - Status ID
 * @param {number} newStatusId - ID of status to move tasks to (optional)
 * @returns {boolean} - Success
 */
exports.deleteStatus = async (statusId, newStatusId = null) => {
  const transaction = await sequelize.transaction();
  
  try {
    const status = await Status.findByPk(statusId, {
      transaction,
      include: [{
        model: Project,
        as: 'project',
        attributes: ['id']
      }]
    });
    
    if (!status) {
      throw new Error('Status not found');
    }
    
    // Check if this is the only status in the project
    const statusCount = await Status.count({
      where: { project_id: status.project_id },
      transaction
    });
    
    if (statusCount <= 1) {
      throw new Error('Cannot delete the last status in a project');
    }
    
    // Handle tasks in this status
    if (newStatusId) {
      // Move tasks to another status
      const newStatus = await Status.findByPk(newStatusId, { transaction });
      
      if (!newStatus || newStatus.project_id !== status.project_id) {
        throw new Error('Invalid target status');
      }
      
      await Task.update(
        { status_id: newStatusId },
        { where: { status_id: statusId }, transaction }
      );
    } else {
      // Check if there are tasks with this status
      const taskCount = await Task.count({
        where: { status_id: statusId },
        transaction
      });
      
      if (taskCount > 0) {
        throw new Error('Cannot delete status with tasks. Provide a new status ID to move tasks.');
      }
    }
    
    // Reorder remaining statuses
    await Status.update(
      { order_position: sequelize.literal('order_position - 1') },
      {
        where: {
          project_id: status.project_id,
          order_position: { [Op.gt]: status.order_position }
        },
        transaction
      }
    );
    
    // Delete the status
    await status.destroy({ transaction });
    
    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    console.error(`Error in status.service.deleteStatus(${statusId}):`, error);
    throw error;
  }
};

/**
 * Reorder statuses in a project
 * @param {number} projectId - Project ID
 * @param {Array} statusOrder - Array of status IDs in the desired order
 * @returns {Array} - Updated statuses
 */
exports.reorderStatuses = async (projectId, statusOrder) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Verify project exists
    const project = await Project.findByPk(projectId, { transaction });
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Get all statuses for this project
    const existingStatuses = await Status.findAll({
      where: { project_id: projectId },
      attributes: ['id'],
      transaction
    });
    
    const existingIds = existingStatuses.map(status => status.id);
    
    // Validate statusOrder contains all and only the statuses that belong to the project
    if (statusOrder.length !== existingIds.length || 
        !statusOrder.every(id => existingIds.includes(id))) {
      throw new Error('Invalid status order: must include all and only statuses that belong to the project');
    }
    
    // Update each status's order_position
    const updatePromises = statusOrder.map((statusId, index) => {
      return Status.update(
        { order_position: index },
        { where: { id: statusId }, transaction }
      );
    });
    
    await Promise.all(updatePromises);
    
    // Get updated statuses
    const updatedStatuses = await Status.findAll({
      where: { project_id: projectId },
      order: [['order_position', 'ASC']],
      transaction
    });
    
    await transaction.commit();
    return updatedStatuses;
  } catch (error) {
    await transaction.rollback();
    console.error(`Error in status.service.reorderStatuses(${projectId}):`, error);
    throw error;
  }
};

/**
 * Move a task to a different status
 * @param {number} taskId - Task ID
 * @param {number} statusId - New status ID
 * @returns {Object} - Updated task
 */
exports.moveTaskToStatus = async (taskId, statusId) => {
  const transaction = await sequelize.transaction();
  
  try {
    const task = await Task.findByPk(taskId, {
      include: [{ model: Project, as: 'project', attributes: ['id'] }],
      transaction
    });
    
    if (!task) {
      throw new Error('Task not found');
    }
    
    const status = await Status.findByPk(statusId, { transaction });
    
    if (!status) {
      throw new Error('Status not found');
    }
    
    // Ensure status belongs to the same project as the task
    if (status.project_id !== task.project_id) {
      throw new Error('Status does not belong to the task\'s project');
    }
    
    // Update task status
    task.status_id = statusId;
    task.updated_at = new Date();
    
    await task.save({ transaction });
    await transaction.commit();
    
    return task;
  } catch (error) {
    await transaction.rollback();
    console.error(`Error in status.service.moveTaskToStatus(${taskId}, ${statusId}):`, error);
    throw error;
  }
};

/**
 * Initialize default statuses for a new project
 * @param {number} projectId - Project ID
 * @returns {Array} - Created statuses
 */
exports.initializeDefaultStatuses = async (projectId) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Default statuses with their colors
    const defaultStatuses = [
      { name: 'To Do', color: '#6B7280', order_position: 0 }, // Gray
      { name: 'In Progress', color: '#F59E0B', order_position: 1 }, // Amber
      { name: 'Review', color: '#7E57C2', order_position: 2 }, // Purple
      { name: 'Done', color: '#16A34A', order_position: 3 } // Green
    ];
    
    // Create statuses
    const createPromises = defaultStatuses.map(status => {
      return Status.create({
        project_id: projectId,
        name: status.name,
        color: status.color,
        order_position: status.order_position
      }, { transaction });
    });
    
    const createdStatuses = await Promise.all(createPromises);
    
    await transaction.commit();
    return createdStatuses;
  } catch (error) {
    await transaction.rollback();
    console.error(`Error in status.service.initializeDefaultStatuses(${projectId}):`, error);
    throw error;
  }
};

/**
 * Get tasks by status
 * @param {number} statusId - Status ID
 * @param {Object} options - Query options (limit, offset)
 * @returns {Object} - Tasks and count
 */
exports.getTasksByStatus = async (statusId, options = {}) => {
  try {
    const { count, rows: tasks } = await Task.findAndCountAll({
      where: { status_id: statusId },
      limit: options.limit,
      offset: options.offset,
      order: [['updated_at', 'DESC']],
      include: [
        {
          model: Status,
          as: 'status',
          attributes: ['id', 'name', 'color']
        }
      ]
    });
    
    return { count, tasks };
  } catch (error) {
    console.error(`Error in status.service.getTasksByStatus(${statusId}):`, error);
    throw error;
  }
};

// Helper function to reorder statuses after a position change
async function reorderStatuses(projectId, statusId, newPosition, transaction) {
  // Get the status to make sure it exists
  const status = await Status.findByPk(statusId, { transaction });
  
  if (!status) {
    throw new Error('Status not found');
  }
  
  const oldPosition = status.order_position;
  
  // Get max order position
  const maxPositionStatus = await Status.findOne({
    where: { project_id: projectId },
    order: [['order_position', 'DESC']],
    attributes: ['order_position'],
    transaction
  });
  
  const maxPosition = maxPositionStatus ? maxPositionStatus.order_position : 0;
  
  // Make sure newPosition is valid
  newPosition = Math.max(0, Math.min(maxPosition, newPosition));
  
  // If position didn't change, do nothing
  if (newPosition === oldPosition) {
    return;
  }
  
  // Update positions of other statuses
  if (newPosition > oldPosition) {
    // Moving down - decrement positions of statuses between old and new position
    await Status.update(
      { order_position: sequelize.literal('order_position - 1') },
      {
        where: {
          project_id: projectId,
          order_position: { [Op.gt]: oldPosition, [Op.lte]: newPosition },
          id: { [Op.ne]: statusId }
        },
        transaction
      }
    );
  } else {
    // Moving up - increment positions of statuses between new and old position
    await Status.update(
      { order_position: sequelize.literal('order_position + 1') },
      {
        where: {
          project_id: projectId,
          order_position: { [Op.gte]: newPosition, [Op.lt]: oldPosition },
          id: { [Op.ne]: statusId }
        },
        transaction
      }
    );
  }
  
  // Update the status's position
  await Status.update(
    { order_position: newPosition },
    { where: { id: statusId }, transaction }
  );
}