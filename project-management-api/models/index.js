// Import all models
const User = require('./user.model');
const Team = require('./team.model');
const TeamMember = require('./team-member.model');
const Project = require('./project.model');
const TaskStatus = require('./task-status.model');
const Priority = require('./priority.model');
const TaskType = require('./task-type.model');
const Task = require('./task.model');
const TimeEntry = require('./time-entry.model');
const Comment = require('./comment.model');
const Attachment = require('./attachment.model');
const Notification = require('./notification.model');
const Tag = require('./tag.model');
const TaskTag = require('./task-tag.model');
const Checklist = require('./checklist.model');
const ChecklistItem = require('./checklist-item.model');
const View = require('./view.model');

// Import note-related models
const Note = require('./note.model');
const NoteBlock = require('./note-block.model');
const NoteTag = require('./note-tag.model');
const NoteShare = require('./note-share.model');

const UserActivity = require('./user-activity.model');


// Define associations

// User associations
User.hasMany(Team, { foreignKey: 'created_by', as: 'createdTeams' });
User.hasMany(Project, { foreignKey: 'created_by', as: 'createdProjects' });
User.hasMany(Task, { foreignKey: 'created_by', as: 'createdTasks' });
User.hasMany(Task, { foreignKey: 'assignee_id', as: 'assignedTasks' });
User.hasMany(TimeEntry, { foreignKey: 'user_id' });
User.hasMany(Comment, { foreignKey: 'user_id' });
User.hasMany(Attachment, { foreignKey: 'user_id' });
User.hasMany(Notification, { foreignKey: 'user_id' });
User.belongsToMany(Team, { through: TeamMember, foreignKey: 'user_id' });
// User-Note associations
User.hasMany(Note, { foreignKey: 'user_id', as: 'notes' });
User.hasMany(Note, { foreignKey: 'created_by', as: 'createdNotes' });
User.belongsToMany(Note, { through: NoteShare, foreignKey: 'user_id', as: 'sharedNotes' });

// Team associations
Team.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Team.hasMany(Project, { foreignKey: 'team_id' });
Team.belongsToMany(User, { through: TeamMember, foreignKey: 'team_id' });
Team.hasMany(TeamMember, { foreignKey: 'team_id' });

// TeamMember associations
TeamMember.belongsTo(Team, { foreignKey: 'team_id' });
TeamMember.belongsTo(User, { foreignKey: 'user_id' });

// Project associations
Project.belongsTo(Team, { foreignKey: 'team_id' });
Project.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Project.hasMany(Task, { foreignKey: 'project_id' });
Project.hasMany(TaskStatus, { foreignKey: 'project_id' });
Project.hasMany(TaskType, { foreignKey: 'project_id' });
Project.hasMany(Tag, { foreignKey: 'project_id' });
Project.hasMany(View, { foreignKey: 'project_id' });
// Project-Note associations
Project.hasMany(Note, { foreignKey: 'project_id', as: 'notes' });

// TaskStatus associations
TaskStatus.belongsTo(Project, { foreignKey: 'project_id' });
TaskStatus.hasMany(Task, { foreignKey: 'status_id' });

// Priority associations
Priority.hasMany(Task, { foreignKey: 'priority_id' });

// TaskType associations
TaskType.belongsTo(Project, { foreignKey: 'project_id' });
TaskType.hasMany(Task, { foreignKey: 'type_id' });

// Task associations
Task.belongsTo(Project, { foreignKey: 'project_id' });
Task.belongsTo(TaskStatus, { foreignKey: 'status_id', as: 'status' });
Task.belongsTo(TaskType, { foreignKey: 'type_id', as: 'type' });
Task.belongsTo(Priority, { foreignKey: 'priority_id', as: 'priority' });
Task.belongsTo(User, { foreignKey: 'assignee_id', as: 'assignee' });
Task.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Task.belongsTo(Task, { foreignKey: 'parent_task_id', as: 'parentTask' });
Task.hasMany(Task, { foreignKey: 'parent_task_id', as: 'subtasks' });
Task.hasMany(TimeEntry, { foreignKey: 'task_id' });
Task.hasMany(Comment, { foreignKey: 'task_id' });
Task.hasMany(Attachment, { foreignKey: 'task_id' });
Task.hasMany(Checklist, { foreignKey: 'task_id' });
Task.belongsToMany(Tag, { through: TaskTag, foreignKey: 'task_id' });
// Task-Note associations
Task.hasMany(Note, { foreignKey: 'task_id', as: 'notes' });

// TimeEntry associations
TimeEntry.belongsTo(Task, { foreignKey: 'task_id' });
TimeEntry.belongsTo(User, { foreignKey: 'user_id' });

// Comment associations
Comment.belongsTo(Task, { foreignKey: 'task_id' });
Comment.belongsTo(User, { foreignKey: 'user_id' });

// Attachment associations
Attachment.belongsTo(Task, { foreignKey: 'task_id' });
Attachment.belongsTo(User, { foreignKey: 'user_id' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'user_id' });

// Tag associations
Tag.belongsTo(Project, { foreignKey: 'project_id' });
Tag.belongsToMany(Task, { through: TaskTag, foreignKey: 'tag_id' });
Tag.belongsToMany(Note, { through: NoteTag, foreignKey: 'tag_id', otherKey: 'note_id', as: 'notes' });

// TaskTag associations
TaskTag.belongsTo(Task, { foreignKey: 'task_id' });
TaskTag.belongsTo(Tag, { foreignKey: 'tag_id' });

// Checklist associations
Checklist.belongsTo(Task, { foreignKey: 'task_id' });
Checklist.hasMany(ChecklistItem, { foreignKey: 'checklist_id' });

// ChecklistItem associations
ChecklistItem.belongsTo(Checklist, { foreignKey: 'checklist_id' });

// View associations
View.belongsTo(Project, { foreignKey: 'project_id' });
View.belongsTo(User, { foreignKey: 'user_id' });

// Note model associations
Note.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Note.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Note.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
Note.belongsTo(Task, { foreignKey: 'task_id', as: 'task' });
Note.belongsTo(Note, { foreignKey: 'parent_id', as: 'parent' });
Note.hasMany(Note, { foreignKey: 'parent_id', as: 'children' });
Note.hasMany(NoteBlock, { foreignKey: 'note_id', as: 'blocks', onDelete: 'CASCADE' });
Note.hasMany(NoteShare, { foreignKey: 'note_id', as: 'shares', onDelete: 'CASCADE' });
Note.belongsToMany(User, { through: NoteShare, foreignKey: 'note_id', otherKey: 'user_id', as: 'sharedWith' });
Note.belongsToMany(Tag, { through: NoteTag, foreignKey: 'note_id', otherKey: 'tag_id', as: 'tags' });

// NoteBlock associations
NoteBlock.belongsTo(Note, { foreignKey: 'note_id', as: 'note' });

// NoteShare associations
NoteShare.belongsTo(Note, { foreignKey: 'note_id', as: 'note' });
NoteShare.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
NoteShare.belongsTo(User, { foreignKey: 'shared_by', as: 'sharedBy' });

// NoteTag associations
NoteTag.belongsTo(Note, { foreignKey: 'note_id' });
NoteTag.belongsTo(Tag, { foreignKey: 'tag_id' });

// Export all models
module.exports = {
  User,
  Team,
  TeamMember,
  Project,
  TaskStatus,
  Priority,
  TaskType,
  Task,
  TimeEntry,
  Comment,
  Attachment,
  Notification,
  Tag,
  TaskTag,
  Checklist,
  ChecklistItem,
  View,
  // Note models
  Note,
  NoteBlock,
  NoteTag,
  NoteShare,
  UserActivity
};