const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const Task = require('../models/task.model');
const Project = require('../models/project.model');
const TaskStatus = require('../models/task-status.model');
const User = require('../models/user.model');
const TeamMember = require('../models/team-member.model');
const Priority = require('../models/priority.model');
const TaskType = require('../models/task-type.model');
const Checklist = require('../models/checklist.model');
const ChecklistItem = require('../models/checklist-item.model');
const Comment = require('../models/comment.model');
const Attachment = require('../models/attachment.model');
const TimeEntry = require('../models/time-entry.model');
const logger = require('../utils/logger');
const ActivityTrackerService = require('../services/activity-tracker.service');


/**
 * Get all tasks
 * @route GET /api/tasks
 */
const getAllTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      project_id,
      status_id,
      assignee_id,
      priority_id,
      type_id,
      search,
      due_date_start,
      due_date_end,
      start_date_start,
      start_date_end,
      limit = 50,
      offset = 0,
      sort_by = 'updated_at',
      sort_dir = 'desc'
    } = req.query;

    // Check if user is admin
    const isAdmin = req.user.role === 'admin';

    // Build base query options
    const options = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_by, sort_dir.toUpperCase()]],
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'color'],
          required: true
        },
        {
          model: TaskStatus,
          as: 'status',
          attributes: ['id', 'name', 'color']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        },
        {
          model: Priority,
          as: 'priority',
          attributes: ['id', 'name', 'color', 'icon']
        },
        {
          model: TaskType,
          as: 'type',
          attributes: ['id', 'name', 'color', 'icon']
        }
      ]
    };

    // Add where conditions based on query parameters
    const whereClause = {};

    if (project_id) {
      whereClause.project_id = project_id;
    }

    if (status_id) {
      whereClause.status_id = status_id;
    }

    if (assignee_id === 'me') {
      whereClause.assignee_id = userId;
    } else if (assignee_id === 'unassigned') {
      whereClause.assignee_id = null;
    } else if (assignee_id) {
      whereClause.assignee_id = assignee_id;
    }

    if (priority_id) {
      whereClause.priority_id = priority_id;
    }

    if (type_id) {
      whereClause.type_id = type_id;
    }

    if (search) {
      whereClause.title = { [Op.like]: `%${search}%` };
    }

    if (due_date_start && due_date_end) {
      whereClause.due_date = {
        [Op.between]: [due_date_start, due_date_end]
      };
    } else if (due_date_start) {
      whereClause.due_date = { [Op.gte]: due_date_start };
    } else if (due_date_end) {
      whereClause.due_date = { [Op.lte]: due_date_end };
    }

    if (start_date_start && start_date_end) {
      whereClause.start_date = {
        [Op.between]: [start_date_start, start_date_end]
      };
    } else if (start_date_start) {
      whereClause.start_date = { [Op.gte]: start_date_start };
    } else if (start_date_end) {
      whereClause.start_date = { [Op.lte]: start_date_end };
    }

    options.where = whereClause;

    // If not admin, ensure user can only see tasks they have access to
    if (!isAdmin) {
      // Get teams that the user is a member of
      const userTeams = await TeamMember.findAll({
        where: { user_id: userId },
        attributes: ['team_id']
      });

      const userTeamIds = userTeams.map(tm => tm.team_id);

      // Add team-based access restriction to the project include
      options.include[0].where = {
        team_id: { [Op.in]: userTeamIds }
      };

      // Also include tasks assigned to the user or created by the user
      if (!whereClause.assignee_id) {
        options.where = {
          ...whereClause,
          [Op.or]: [
            { assignee_id: userId },
            { created_by: userId }
          ]
        };
      }
    }

    // Get tasks with pagination
    const { count, rows } = await Task.findAndCountAll(options);

    // Add counts for child items
    for (const task of rows) {
      // Get comment count
      const commentCount = await Comment.count({
        where: { task_id: task.id }
      });
      task.dataValues.commentCount = commentCount;

      // Get attachment count
      const attachmentCount = await Attachment.count({
        where: { task_id: task.id }
      });
      task.dataValues.attachmentCount = attachmentCount;

      // Get checklist counts
      const checklists = await Checklist.findAll({
        where: { task_id: task.id },
        include: [
          {
            model: ChecklistItem,
            attributes: ['id', 'is_completed']
          }
        ]
      });

      let totalItems = 0;
      let completedItems = 0;

      checklists.forEach(checklist => {
        const items = checklist.ChecklistItems || [];
        totalItems += items.length;
        completedItems += items.filter(item => item.is_completed).length;
      });

      task.dataValues.checklistTotal = totalItems;
      task.dataValues.checklistCompleted = completedItems;
    }

    res.status(200).json({
      data: rows,
      meta: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    logger.error('Error getting tasks:', error);
    res.status(500).json({ error: 'Server error getting tasks' });
  }
};

/**
 * Get task by ID
 * @route GET /api/tasks/:id
 */
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the task with all its related data
    const task = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'color', 'team_id'],
          required: true
        },
        {
          model: TaskStatus,
          as: 'status',
          attributes: ['id', 'name', 'color']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        },
        {
          model: Priority,
          as: 'priority',
          attributes: ['id', 'name', 'color', 'icon']
        },
        {
          model: TaskType,
          as: 'type',
          attributes: ['id', 'name', 'color', 'icon']
        },
        {
          model: Task,
          as: 'parentTask',
          attributes: ['id', 'title']
        },
        {
          model: Task,
          as: 'subtasks',
          attributes: ['id', 'title', 'status_id', 'assignee_id'],
          include: [
            {
              model: TaskStatus,
              as: 'status',
              attributes: ['id', 'name', 'color']
            },
            {
              model: User,
              as: 'assignee',
              attributes: ['id', 'first_name', 'last_name', 'profile_image']
            }
          ]
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user has access to the task
    if (!isAdmin) {
      // Check if user is member of the project's team
      const isMember = await TeamMember.findOne({
        where: {
          team_id: task.Project.team_id,
          user_id: userId
        }
      });

      // Allow access if user is creator, assignee, or team member
      if (!isMember && task.created_by !== userId && task.assignee_id !== userId) {
        return res.status(403).json({ error: 'Not authorized to access this task' });
      }
    }

    // Get comments
    const comments = await Comment.findAll({
      where: { task_id: id },
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        }
      ],
      order: [['created_at', 'ASC']]
    });
    task.dataValues.comments = comments;

    // Get attachments
    const attachments = await Attachment.findAll({
      where: { task_id: id },
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        }
      ],
      order: [['created_at', 'DESC']]
    });
    task.dataValues.attachments = attachments;

    // Get checklists with items
    const checklists = await Checklist.findAll({
      where: { task_id: id },
      include: [
        {
          model: ChecklistItem,
          order: [['order_position', 'ASC']]
        }
      ],
      order: [['created_at', 'ASC']]
    });
    task.dataValues.checklists = checklists;

    // Get time entries
    const timeEntries = await TimeEntry.findAll({
      where: { task_id: id },
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: 10
    });
    task.dataValues.timeEntries = timeEntries;

    // Calculate total time spent
    const totalTime = await TimeEntry.sum('duration', {
      where: { task_id: id }
    });
    task.dataValues.totalTimeSpent = totalTime || 0;

    res.status(200).json({
      data: task
    });
  } catch (error) {
    logger.error(`Error getting task ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error getting task' });
  }
};

/**
 * Create new task
 * @route POST /api/tasks
 */
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project_id,
      status_id,
      type_id,
      priority_id,
      priority,  // Handle both priority and priority_id
      parent_task_id,
      assignee_id,
      estimated_time,
      start_date,
      due_date
    } = req.body;

    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';





    // Check if project exists
    const project = await Project.findByPk(project_id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has access to the project
    if (!isAdmin) {
      // Check if user is member of the project's team
      const isMember = await TeamMember.findOne({
        where: {
          team_id: project.team_id,
          user_id: userId
        }
      });

      if (!isMember) {
        return res.status(403).json({ error: 'Not authorized to create tasks in this project' });
      }
    }

    // Check if status exists and belongs to the project
    const status = await TaskStatus.findOne({
      where: {
        id: status_id,
        project_id
      }
    });

    if (!status) {
      return res.status(404).json({ error: 'Status not found in this project' });
    }

    // Validate parent task if provided
    if (parent_task_id) {
      const parentTask = await Task.findOne({
        where: {
          id: parent_task_id,
          project_id
        }
      });

      if (!parentTask) {
        return res.status(404).json({ error: 'Parent task not found in this project' });
      }
    }

    // Handle priority field conversion if needed
    let finalPriorityId = priority_id;
    if (!finalPriorityId && priority) {
      try {
        // Look up priority ID from string value (if sent as string)
        const priorityRecord = await Priority.findOne({
          where: {
            name: {
              [Op.like]: `%${priority}%`
            }
          }
        });

        if (priorityRecord) {
          finalPriorityId = priorityRecord.id;
        }
      } catch (err) {
        logger.error('Error finding priority:', err);
        // Continue even if priority lookup fails
      }
    }

    // Validate assignee if provided
    if (assignee_id) {
      const assignee = await User.findByPk(assignee_id);
      if (!assignee) {
        return res.status(404).json({ error: `Assignee with ID ${assignee_id} not found` });
      }
    }

    // Create the task
    const task = await Task.create({
      title,
      description,
      project_id,
      status_id,
      type_id: type_id || null,
      priority_id: finalPriorityId || null,
      parent_task_id: parent_task_id || null,
      assignee_id: assignee_id || null,
      estimated_time: estimated_time || 0,
      start_date: start_date || null,
      due_date: due_date || null,
      created_by: userId
    });

    // Track the activity
    await ActivityTrackerService.trackTaskCreated(
      req.user.id,
      task.id,
      task.title
    );

    // Get the created task with associations
    const createdTask = await Task.findByPk(task.id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'color']
        },
        {
          model: TaskStatus,
          as: 'status',
          attributes: ['id', 'name', 'color']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        },
        {
          model: Priority,
          as: 'priority',
          attributes: ['id', 'name', 'color', 'icon']
        },
        {
          model: TaskType,
          as: 'type',
          attributes: ['id', 'name', 'color', 'icon']
        }
      ]
    });

    // If task is assigned, send notification to the assignee
    if (assignee_id && assignee_id !== userId) {
      // In a real app, this would trigger a notification
      // This would typically use socket.io or a notification service
      logger.info(`Task ${task.id} assigned to user ${assignee_id}`);
    }

    res.status(201).json({
      message: 'Task created successfully',
      data: createdTask
    });
  } catch (error) {
    logger.error('Error creating task:', error);
    res.status(500).json({ error: 'Server error creating task', details: error.message });
  }
};

/**
 * Update task
 * @route PUT /api/tasks/:id
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status_id,
      type_id,
      priority_id,
      parent_task_id,
      assignee_id,
      estimated_time,
      start_date,
      due_date
    } = req.body;

    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the task with project information
    const task = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'team_id']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user has permission to update this task
    if (!isAdmin && task.created_by !== userId && task.assignee_id !== userId) {
      // Check if user is an admin or owner of the team
      const teamMember = await TeamMember.findOne({
        where: {
          team_id: task.Project.team_id,
          user_id: userId,
          role: { [Op.in]: ['owner', 'admin'] }
        }
      });

      if (!teamMember) {
        return res.status(403).json({ error: 'Not authorized to update this task' });
      }
    }

    // If status_id is provided, check if it belongs to the task's project
    if (status_id) {
      const status = await TaskStatus.findOne({
        where: {
          id: status_id,
          project_id: task.project_id
        }
      });

      if (!status) {
        return res.status(404).json({ error: 'Status not found in this project' });
      }
    }

    // Track status change if status_id was provided and changed
    if (status_id && status_id !== task.status_id) {
      const newStatus = await TaskStatus.findByPk(status_id);
      await ActivityTrackerService.trackTaskStatusChanged(
        req.user.id,
        task.id,
        newStatus ? newStatus.name : 'new status'
      );
    }

    // Track assignment if assignee_id was provided and changed
    if (assignee_id !== undefined && assignee_id !== task.assignee_id) {
      let assigneeName = 'another user';
      if (assignee_id) {
        const assignee = await User.findByPk(assignee_id);
        if (assignee) {
          assigneeName = `${assignee.first_name} ${assignee.last_name}`;
        }
      } else {
        assigneeName = 'unassigned';
      }

      await ActivityTrackerService.trackTaskAssigned(
        req.user.id,
        task.id,
        assignee_id,
        assigneeName
      );
    }

    // Track general update if other fields changed
    const hasOtherChanges = title || description !== undefined || priority_id !== undefined
      || type_id !== undefined || parent_task_id !== undefined || estimated_time !== undefined
      || start_date !== undefined || due_date !== undefined;

    if (hasOtherChanges) {
      await ActivityTrackerService.trackTaskUpdated(
        req.user.id,
        task.id,
        title ? `Updated task: ${title}` : 'Updated task details'
      );
    }

    // If parent_task_id is provided, validate it
    if (parent_task_id && parent_task_id !== task.parent_task_id) {
      // Prevent task from being its own parent
      if (parseInt(parent_task_id) === parseInt(id)) {
        return res.status(400).json({ error: 'Task cannot be its own parent' });
      }

      // Check if parent task exists in the same project
      const parentTask = await Task.findOne({
        where: {
          id: parent_task_id,
          project_id: task.project_id
        }
      });

      if (!parentTask) {
        return res.status(404).json({ error: 'Parent task not found in this project' });
      }

      // Prevent circular references
      let currentParent = parentTask;
      while (currentParent && currentParent.parent_task_id) {
        if (parseInt(currentParent.parent_task_id) === parseInt(id)) {
          return res.status(400).json({ error: 'Circular task dependency detected' });
        }

        currentParent = await Task.findByPk(currentParent.parent_task_id);
      }
    }

    // Capture previous assignee for notification
    const previousAssigneeId = task.assignee_id;

    // Update the task
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status_id) updateData.status_id = status_id;
    if (type_id !== undefined) updateData.type_id = type_id;
    if (priority_id !== undefined) updateData.priority_id = priority_id;
    if (parent_task_id !== undefined) updateData.parent_task_id = parent_task_id;
    if (assignee_id !== undefined) updateData.assignee_id = assignee_id;
    if (estimated_time !== undefined) updateData.estimated_time = estimated_time;
    if (start_date !== undefined) updateData.start_date = start_date;
    if (due_date !== undefined) updateData.due_date = due_date;

    await task.update(updateData);

    // If assignee changed, send notification to the new assignee
    if (assignee_id && assignee_id !== previousAssigneeId && assignee_id !== userId) {
      // In a real app, this would trigger a notification
      logger.info(`Task ${task.id} reassigned to user ${assignee_id}`);
    }

    // Get the updated task with associations
    const updatedTask = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'name', 'color']
        },
        {
          model: TaskStatus,
          as: 'status',
          attributes: ['id', 'name', 'color']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        },
        {
          model: Priority,
          as: 'priority',
          attributes: ['id', 'name', 'color', 'icon']
        },
        {
          model: TaskType,
          as: 'type',
          attributes: ['id', 'name', 'color', 'icon']
        }
      ]
    });

    res.status(200).json({
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    logger.error(`Error updating task ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error updating task' });
  }
};

/**
 * Delete task
 * @route DELETE /api/tasks/:id
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // Find the task with project information
    const task = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'team_id']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user has permission to delete this task
    if (!isAdmin && task.created_by !== userId) {
      // Check if user is an admin or owner of the team
      const teamMember = await TeamMember.findOne({
        where: {
          team_id: task.Project.team_id,
          user_id: userId,
          role: { [Op.in]: ['owner', 'admin'] }
        }
      });

      if (!teamMember) {
        return res.status(403).json({ error: 'Not authorized to delete this task' });
      }
    }

    // Delete the task (cascade delete will handle related entities)
    await task.destroy();

    res.status(200).json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting task ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error deleting task' });
  }
};

/**
 * Get task comments
 * @route GET /api/tasks/:id/comments
 */
const getTaskComments = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // First check if task exists and user has access
    const task = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'team_id']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user has access to the task
    if (!isAdmin) {
      // Check if user is member of the project's team
      const isMember = await TeamMember.findOne({
        where: {
          team_id: task.Project.team_id,
          user_id: userId
        }
      });

      // Allow access if user is creator, assignee, or team member
      if (!isMember && task.created_by !== userId && task.assignee_id !== userId) {
        return res.status(403).json({ error: 'Not authorized to access this task' });
      }
    }

    // Get comments with user information
    const comments = await Comment.findAll({
      where: { task_id: id },
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    res.status(200).json({
      data: comments
    });
  } catch (error) {
    logger.error(`Error getting comments for task ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error getting task comments' });
  }
};

/**
 * Add comment to task
 * @route POST /api/tasks/:id/comments
 */
const addTaskComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // First check if task exists and user has access
    const task = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'team_id']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user has access to the task
    if (!isAdmin) {
      // Check if user is member of the project's team
      const isMember = await TeamMember.findOne({
        where: {
          team_id: task.Project.team_id,
          user_id: userId
        }
      });

      // Allow access if user is creator, assignee, or team member
      if (!isMember && task.created_by !== userId && task.assignee_id !== userId) {
        return res.status(403).json({ error: 'Not authorized to comment on this task' });
      }
    }

    // Create comment
    const comment = await Comment.create({
      task_id: id,
      user_id: userId,
      content
    });

    // Get comment with user information
    const createdComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        }
      ]
    });

    // Notify task assignee and creator if they're not the commenter
    if (task.assignee_id && task.assignee_id !== userId) {
      // In a real app, send notification to assignee
      logger.info(`New comment on task ${id} for assignee ${task.assignee_id}`);
    }

    if (task.created_by !== userId && task.created_by !== task.assignee_id) {
      // In a real app, send notification to creator
      logger.info(`New comment on task ${id} for creator ${task.created_by}`);
    }

    res.status(201).json({
      message: 'Comment added successfully',
      data: createdComment
    });
  } catch (error) {
    logger.error(`Error adding comment to task ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error adding task comment' });
  }
};

/**
 * Start time tracking for task
 * @route POST /api/tasks/:id/time-entries
 */
const startTimeTracking = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_time, description } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // First check if task exists and user has access
    const task = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'team_id']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await ActivityTrackerService.recordActivity({
      userId: req.user.id,
      activityType: 'time_tracked',
      description: `Started time tracking${description ? `: ${description}` : ''}`,
      taskId: parseInt(id),
      projectId: task.project_id,
      teamId: task.Project.team_id
    });


    // Check if user has access to the task
    if (!isAdmin) {
      // Check if user is member of the project's team
      const isMember = await TeamMember.findOne({
        where: {
          team_id: task.Project.team_id,
          user_id: userId
        }
      });

      // Allow access if user is creator, assignee, or team member
      if (!isMember && task.created_by !== userId && task.assignee_id !== userId) {
        return res.status(403).json({ error: 'Not authorized to track time for this task' });
      }
    }

    // Check if user already has an active time entry
    const activeEntry = await TimeEntry.findOne({
      where: {
        user_id: userId,
        end_time: null
      }
    });

    if (activeEntry) {
      return res.status(400).json({
        error: 'You already have an active time entry',
        activeEntry
      });
    }

    // Create time entry with task_id from URL parameter
    const timeEntry = await TimeEntry.create({
      task_id: parseInt(id), // Ensure it's an integer
      user_id: userId,
      start_time: start_time || new Date(),
      description
    });

    // Get time entry with user information
    const createdEntry = await TimeEntry.findByPk(timeEntry.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        }
      ]
    });

    res.status(201).json({
      message: 'Time tracking started successfully',
      data: createdEntry
    });
  } catch (error) {
    logger.error(`Error starting time tracking for task ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error starting time tracking' });
  }
};

/**
 * Get time entries for a task
 * @route GET /api/tasks/:id/time-entries
 */
const getTaskTimeEntries = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // First check if task exists and user has access
    const task = await Task.findByPk(id, {
      include: [
        {
          model: Project,
          attributes: ['id', 'team_id']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user has access to the task
    if (!isAdmin) {
      // Check if user is member of the project's team
      const isMember = await TeamMember.findOne({
        where: {
          team_id: task.Project.team_id,
          user_id: userId
        }
      });

      // Allow access if user is creator, assignee, or team member
      if (!isMember && task.created_by !== userId && task.assignee_id !== userId) {
        return res.status(403).json({ error: 'Not authorized to access time entries for this task' });
      }
    }

    // Get time entries for the task
    const timeEntries = await TimeEntry.findAll({
      where: { task_id: id },
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Important: Make sure the end_time is properly set as null for active entries
    // This debugging will help us see how the data is being returned
    logger.debug(`Time entries found for task ${id}: ${timeEntries.length}`);
    if (timeEntries.length > 0) {
      logger.debug(`First entry end_time: ${timeEntries[0].end_time}`);
      logger.debug(`First entry type: ${typeof timeEntries[0].end_time}`);
    }

    // Calculate total time spent
    const totalTimeSpent = await TimeEntry.sum('duration', {
      where: {
        task_id: id,
        duration: { [Op.not]: null } // Only count completed entries
      }
    }) || 0;

    res.status(200).json({
      data: timeEntries,
      meta: {
        totalTimeSpent
      }
    });
  } catch (error) {
    logger.error(`Error getting time entries for task ${req.params.id}:`, error);
    res.status(500).json({ error: 'Server error getting time entries' });
  }
};

/**
 * Stop time tracking for task
 * @route PUT /api/tasks/:id/time-entries/:entryId
 */
const stopTimeTracking = async (req, res) => {
  try {
    const { id, entryId } = req.params;
    const { end_time, description } = req.body;
    const userId = req.user.id;

    // Find the time entry
    const timeEntry = await TimeEntry.findOne({
      where: {
        id: entryId,
        task_id: id,
        user_id: userId,
        end_time: null
      }
    });

    if (!timeEntry) {
      return res.status(404).json({ error: 'Active time entry not found' });
    }

    // Calculate end time and duration
    const endTime = end_time ? new Date(end_time) : new Date();
    const startTime = new Date(timeEntry.start_time);
    const durationMs = endTime - startTime;
    const durationMinutes = Math.round(durationMs / 60000); // Convert to minutes

    // Update the time entry
    await timeEntry.update({
      end_time: endTime,
      duration: durationMinutes,
      description: description || timeEntry.description
    });

    // Get the updated time entry with user information
    const updatedEntry = await TimeEntry.findByPk(entryId, {
      include: [
        {
          model: User,
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        }
      ]
    });

    await ActivityTrackerService.trackTimeTracked(
      req.user.id,
      id,
      durationMinutes,
      description || 'Completed time tracking'
    );

    res.status(200).json({
      message: 'Time tracking stopped successfully',
      data: updatedEntry
    });
  } catch (error) {
    logger.error(`Error stopping time tracking for entry ${req.params.entryId}:`, error);
    res.status(500).json({ error: 'Server error stopping time tracking' });
  }
};

/**
 * Get task checklists with robust error handling
 * @route GET /api/tasks/:id/checklists
 * @access Private
 */
const getTaskChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // First check if task exists and user has access
    try {
      const task = await Task.findByPk(id, {
        include: [
          {
            model: Project,
            attributes: ['id', 'team_id']
          }
        ]
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Check if user has access to the task
      if (!isAdmin) {
        // Check if user is member of the project's team
        const isMember = await TeamMember.findOne({
          where: {
            team_id: task.Project.team_id,
            user_id: userId
          }
        });

        // Allow access if user is creator, assignee, or team member
        if (!isMember && task.created_by !== userId && task.assignee_id !== userId) {
          return res.status(403).json({ error: 'Not authorized to access this task' });
        }
      }
    } catch (error) {
      logger.error(`Error checking task access for task ${id}:`, error);
      return res.status(500).json({
        error: 'Error verifying task access',
        details: error.message
      });
    }

    // Get all checklists for the task with their items
    try {
      const checklists = await Checklist.findAll({
        where: { task_id: id },
        include: [
          {
            model: ChecklistItem,
            order: [['order_position', 'ASC']]
          }
        ],
        order: [['created_at', 'ASC']]
      });

      return res.status(200).json({
        message: 'Checklists retrieved successfully',
        data: checklists
      });
    } catch (error) {
      logger.error(`Error retrieving checklists for task ${id}:`, error);
      return res.status(500).json({
        error: 'Error retrieving checklists',
        details: error.message
      });
    }
  } catch (error) {
    logger.error(`Unexpected error in getTaskChecklist for task ${req.params.id}:`, error);
    console.error('Full error:', error);
    return res.status(500).json({
      error: 'Server error retrieving task checklists',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Create task checklist
 * @route POST /api/tasks/:id/checklists
 * @access Private
 */
const createTaskChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, items } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    // First check if task exists and user has access
    try {
      const task = await Task.findByPk(id, {
        include: [
          {
            model: Project,
            attributes: ['id', 'team_id']
          }
        ]
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Check if user has access to the task
      if (!isAdmin) {
        // Check if user is member of the project's team
        const isMember = await TeamMember.findOne({
          where: {
            team_id: task.Project.team_id,
            user_id: userId
          }
        });

        // Allow access if user is creator, assignee, or team member
        if (!isMember && task.created_by !== userId && task.assignee_id !== userId) {
          return res.status(403).json({ error: 'Not authorized to modify this task' });
        }
      }
    } catch (error) {
      logger.error(`Error checking task access for task ${id}:`, error);
      return res.status(500).json({
        error: 'Error verifying task access',
        details: error.message
      });
    }

    // Validate input
    if (!title) {
      return res.status(400).json({ error: 'Title is required for checklist' });
    }

    // Create checklist with transaction
    try {
      const result = await sequelize.transaction(async (t) => {
        // Create checklist
        const checklist = await Checklist.create({
          task_id: id,
          title
        }, { transaction: t });

        // Create checklist items if provided
        if (items && Array.isArray(items) && items.length > 0) {
          const checklistItems = items.map((item, index) => ({
            checklist_id: checklist.id,
            content: item.content,
            is_completed: item.is_completed || false,
            order_position: index
          }));

          await ChecklistItem.bulkCreate(checklistItems, { transaction: t });
        }

        return checklist;
      });

      // Get the created checklist with items
      const checklist = await Checklist.findByPk(result.id, {
        include: [
          {
            model: ChecklistItem,
            order: [['order_position', 'ASC']]
          }
        ]
      });

      return res.status(201).json({
        message: 'Checklist created successfully',
        data: checklist
      });
    } catch (error) {
      logger.error(`Error in DB transaction for creating checklist:`, error);
      return res.status(500).json({
        error: 'Error creating checklist',
        details: error.message
      });
    }
  } catch (error) {
    logger.error(`Unexpected error in createTaskChecklist for task ${req.params.id}:`, error);
    console.error('Full error:', error);
    return res.status(500).json({
      error: 'Server error creating task checklist',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Add a diagnostic endpoint for development
const checkChecklistSetup = async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    const modelInfo = {
      checklistModel: !!Checklist,
      checklistItemModel: !!ChecklistItem,
      checklistTableExists: false,
      checklistItemTableExists: false,
      taskModel: !!Task,
      sequelizeConnected: false
    };

    try {
      await sequelize.authenticate();
      modelInfo.sequelizeConnected = true;
    } catch (err) {
      modelInfo.sequelizeError = err.message;
    }

    try {
      await Checklist.findOne();
      modelInfo.checklistTableExists = true;
    } catch (err) {
      modelInfo.checklistTableError = err.message;
    }

    try {
      await ChecklistItem.findOne();
      modelInfo.checklistItemTableExists = true;
    } catch (err) {
      modelInfo.checklistItemTableError = err.message;
    }

    return res.status(200).json({
      message: 'Checklist system diagnostic',
      data: modelInfo
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error running diagnostic',
      details: error.message
    });
  }
};

/**
 * Get tasks by project ID
 * @route GET /api/projects/:projectId/tasks
 */
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    const {
      status_id,
      assignee_id,
      priority_id,
      type_id,
      search,
      due_date_start,
      due_date_end,
      start_date_start,
      start_date_end,
      limit = 50,
      offset = 0,
      sort_by = 'updated_at',
      sort_dir = 'desc'
    } = req.query;

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has access to the project
    if (!isAdmin) {
      // Check if user is member of the project's team
      const isMember = await TeamMember.findOne({
        where: {
          team_id: project.team_id,
          user_id: userId
        }
      });

      if (!isMember && project.created_by !== userId) {
        return res.status(403).json({ error: 'Not authorized to access this project' });
      }
    }

    // Build base query options
    const options = {
      where: { project_id: projectId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sort_by, sort_dir.toUpperCase()]],
      include: [
        {
          model: TaskStatus,
          as: 'status',
          attributes: ['id', 'name', 'color']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'first_name', 'last_name', 'email', 'profile_image']
        },
        {
          model: Priority,
          as: 'priority',
          attributes: ['id', 'name', 'color', 'icon']
        },
        {
          model: TaskType,
          as: 'type',
          attributes: ['id', 'name', 'color', 'icon']
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    };

    // Add where conditions based on query parameters
    if (status_id) {
      options.where.status_id = status_id;
    }

    if (assignee_id === 'me') {
      options.where.assignee_id = userId;
    } else if (assignee_id === 'unassigned') {
      options.where.assignee_id = null;
    } else if (assignee_id) {
      options.where.assignee_id = assignee_id;
    }

    if (priority_id) {
      options.where.priority_id = priority_id;
    }

    if (type_id) {
      options.where.type_id = type_id;
    }

    if (search) {
      options.where.title = { [Op.like]: `%${search}%` };
    }

    if (due_date_start && due_date_end) {
      options.where.due_date = {
        [Op.between]: [due_date_start, due_date_end]
      };
    } else if (due_date_start) {
      options.where.due_date = { [Op.gte]: due_date_start };
    } else if (due_date_end) {
      options.where.due_date = { [Op.lte]: due_date_end };
    }

    if (start_date_start && start_date_end) {
      options.where.start_date = {
        [Op.between]: [start_date_start, start_date_end]
      };
    } else if (start_date_start) {
      options.where.start_date = { [Op.gte]: start_date_start };
    } else if (start_date_end) {
      options.where.start_date = { [Op.lte]: start_date_end };
    }

    // Get tasks with pagination
    const { count, rows } = await Task.findAndCountAll(options);

    // Add counts for child items
    for (const task of rows) {
      // Get comment count
      const commentCount = await Comment.count({
        where: { task_id: task.id }
      });
      task.dataValues.commentCount = commentCount;

      // Get attachment count
      const attachmentCount = await Attachment.count({
        where: { task_id: task.id }
      });
      task.dataValues.attachmentCount = attachmentCount;

      // Get checklist counts
      const checklists = await Checklist.findAll({
        where: { task_id: task.id },
        include: [
          {
            model: ChecklistItem,
            attributes: ['id', 'is_completed']
          }
        ]
      });

      let totalItems = 0;
      let completedItems = 0;

      checklists.forEach(checklist => {
        const items = checklist.ChecklistItems || [];
        totalItems += items.length;
        completedItems += items.filter(item => item.is_completed).length;
      });

      task.dataValues.checklistTotal = totalItems;
      task.dataValues.checklistCompleted = completedItems;
    }

    res.status(200).json({
      data: rows,
      meta: {
        total: count,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    logger.error(`Error getting tasks for project ${req.params.projectId}:`, error);
    res.status(500).json({ error: 'Server error getting project tasks' });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskComments,
  addTaskComment,
  startTimeTracking,
  stopTimeTracking,
  createTaskChecklist,
  getTaskChecklist,
  createTaskChecklist,
  checkChecklistSetup,
  getTasksByProject,
  getTaskTimeEntries
};