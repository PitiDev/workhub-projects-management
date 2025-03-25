const Joi = require('joi');

/**
 * Request validation middleware
 * @param {Object} schema - Joi validation schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        error: 'Validation failed',
        details: errors
      });
    }

    next();
  };
};

// Define validation schemas
const schemas = {
  // Auth schemas
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    profile_image: Joi.string().allow(null, '')
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  changePassword: Joi.object({
    current_password: Joi.string().required(),
    new_password: Joi.string().min(6).required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    new_password: Joi.string().min(6).required()
  }),

  // Team schemas
  createTeam: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null, '')
  }),

  updateTeam: Joi.object({
    name: Joi.string(),
    description: Joi.string().allow(null, '')
  }),

  teamMember: Joi.object({
    user_id: Joi.number().required(),
    role: Joi.string().valid('owner', 'admin', 'member').default('member')
  }),

  // Project schemas
  createProject: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    color: Joi.string().regex(/^#[0-9A-Fa-f]{6}$/).allow(null, ''),
    icon: Joi.string().allow(null, ''),
    team_id: Joi.number().required(),
    is_private: Joi.boolean().default(false)
  }),

  updateProject: Joi.object({
    name: Joi.string(),
    description: Joi.string().allow(null, ''),
    color: Joi.string().regex(/^#[0-9A-Fa-f]{6}$/).allow(null, ''),
    icon: Joi.string().allow(null, ''),
    team_id: Joi.number(),
    is_private: Joi.boolean(),
    status: Joi.string().valid('active', 'archived')
  }),

  // Task schemas
  createTask: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    project_id: Joi.number().required(),
    status_id: Joi.number().required(),
    type_id: Joi.number().allow(null),
    priority_id: Joi.number().allow(null),
    parent_task_id: Joi.number().allow(null),
    assignee_id: Joi.number().allow(null),
    estimated_time: Joi.number().min(0).allow(null),
    start_date: Joi.date().iso().allow(null),
    due_date: Joi.date().iso().allow(null)
  }),

  updateTask: Joi.object({
    title: Joi.string(),
    description: Joi.string().allow(null, ''),
    status_id: Joi.number(),
    type_id: Joi.number().allow(null),
    priority_id: Joi.number().allow(null),
    parent_task_id: Joi.number().allow(null),
    assignee_id: Joi.number().allow(null),
    estimated_time: Joi.number().min(0).allow(null),
    start_date: Joi.date().iso().allow(null),
    due_date: Joi.date().iso().allow(null)
  }),

  // Task status schemas
  createTaskStatus: Joi.object({
    project_id: Joi.number().required(),
    name: Joi.string().required(),
    color: Joi.string().regex(/^#[0-9A-Fa-f]{6}$/).allow(null, ''),
    order_position: Joi.number().min(0).default(0)
  }),

  updateTaskStatus: Joi.object({
    name: Joi.string(),
    color: Joi.string().regex(/^#[0-9A-Fa-f]{6}$/).allow(null, ''),
    order_position: Joi.number().min(0)
  }),

  // Time entry schemas
  createTimeEntry: Joi.object({
    // task_id: Joi.number().required(),
    start_time: Joi.date().iso().required(),
    end_time: Joi.date().iso().allow(null),
    duration: Joi.number().min(0).allow(null),
    description: Joi.string().allow(null, '')
  }),

  updateTimeEntry: Joi.object({
    start_time: Joi.date().iso(),
    end_time: Joi.date().iso().allow(null),
    duration: Joi.number().min(0).allow(null),
    description: Joi.string().allow(null, '')
  }),

  // Comment schemas
  createComment: Joi.object({
    task_id: Joi.number().required(),
    content: Joi.string().required()
  }),

  updateComment: Joi.object({
    content: Joi.string().required()
  }),

  // Priority schemas
  createPriority: Joi.object({
    name: Joi.string().required(),
    color: Joi.string().regex(/^#[0-9A-Fa-f]{6}$/).allow(null, ''),
    icon: Joi.string().allow(null, ''),
    order_position: Joi.number().integer().min(0)
  }),

  updatePriority: Joi.object({
    name: Joi.string(),
    color: Joi.string().regex(/^#[0-9A-Fa-f]{6}$/).allow(null, ''),
    icon: Joi.string().allow(null, ''),
    order_position: Joi.number().integer().min(0)
  }),

  createTimeEntrycreateTimeEntry: Joi.object({
    // Remove task_id requirement since we get it from the URL
    start_time: Joi.date(),
    description: Joi.string().allow('', null)
  }),

  // Note schemas

};

const noteSchemas = {
  createNote: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().allow(''),
    parent_id: Joi.number().allow(null),
    project_id: Joi.number().allow(null),
    task_id: Joi.number().allow(null),
    is_markdown: Joi.boolean(),
    blocks: Joi.array().items(
      Joi.object({
        type: Joi.string().valid('text', 'heading', 'image', 'code', 'quote', 'list', 'checklist', 'divider', 'embed').required(),
        content: Joi.string().allow(''),
        metadata: Joi.object()
      })
    )
  }),
  
  updateNote: Joi.object({
    title: Joi.string(),
    content: Joi.string().allow(''),
    parent_id: Joi.number().allow(null),
    project_id: Joi.number().allow(null),
    task_id: Joi.number().allow(null),
    is_markdown: Joi.boolean(),
    is_pinned: Joi.boolean(),
    is_archived: Joi.boolean(),
    blocks: Joi.array().items(
      Joi.object({
        type: Joi.string().valid('text', 'heading', 'image', 'code', 'quote', 'list', 'checklist', 'divider', 'embed').required(),
        content: Joi.string().allow(''),
        metadata: Joi.object()
      })
    )
  }),
  
  shareNote: Joi.object({
    user_id: Joi.number().required(),
    permission: Joi.string().valid('view', 'edit', 'admin').default('view')
  })
};


// Add these to your existing schemas object
const statusSchemas = {
  createStatus: Joi.object({
    name: Joi.string().required().max(50).messages({
      'string.empty': 'Status name is required',
      'string.max': 'Status name cannot exceed 50 characters'
    }),
    color: Joi.string().pattern(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i).allow(null, '').messages({
      'string.pattern.base': 'Color must be a valid hex color code (e.g., #FFF or #FFFFFF)'
    })
  }),
  
  updateStatus: Joi.object({
    name: Joi.string().max(50).messages({
      'string.max': 'Status name cannot exceed 50 characters'
    }),
    color: Joi.string().pattern(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i).allow(null, '').messages({
      'string.pattern.base': 'Color must be a valid hex color code (e.g., #FFF or #FFFFFF)'
    })
  }).min(1),
  
  reorderStatuses: Joi.object({
    statusOrder: Joi.array().items(Joi.number().integer().positive()).min(1).required().messages({
      'array.base': 'Status order must be an array',
      'array.min': 'Status order array cannot be empty'
    })
  })
};

module.exports = {
  validate,
  schemas,
  noteSchemas,
  statusSchemas
};