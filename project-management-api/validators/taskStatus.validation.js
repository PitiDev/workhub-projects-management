const Joi = require('joi');

// Validation schema for creating a task status
const createTaskStatus = Joi.object({
  name: Joi.string().required().max(50).messages({
    'string.empty': 'Status name is required',
    'string.max': 'Status name cannot exceed 50 characters'
  }),
  color: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).messages({
    'string.pattern.base': 'Color must be a valid hex color code (e.g., #ff0000)'
  })
});

// Validation schema for updating a task status
const updateTaskStatus = Joi.object({
  name: Joi.string().max(50).messages({
    'string.max': 'Status name cannot exceed 50 characters'
  }),
  color: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).messages({
    'string.pattern.base': 'Color must be a valid hex color code (e.g., #ff0000)'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// Validation schema for reordering task statuses
const reorderTaskStatuses = Joi.object({
  statusOrder: Joi.array().items(Joi.number().integer().positive()).required().messages({
    'array.base': 'Status order must be an array',
    'array.empty': 'Status order cannot be empty',
    'number.base': 'Status IDs must be numbers',
    'number.integer': 'Status IDs must be integers',
    'number.positive': 'Status IDs must be positive'
  })
});

module.exports = {
  createTaskStatus,
  updateTaskStatus,
  reorderTaskStatuses
};