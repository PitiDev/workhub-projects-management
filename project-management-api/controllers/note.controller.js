const { Note, NoteBlock, NoteShare, Tag } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Get all notes for the current user
exports.getAllNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all notes created by the user or shared with the user
    const notes = await Note.findAll({
      where: {
        [Op.or]: [
          { user_id: userId },  // Changed from created_by to user_id
          {
            '$shares.user_id$': userId
          }
        ],
        is_archived: false
      },
      include: [
        {
          model: NoteShare,
          as: 'shares',
          required: false
        },
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] },
          required: false
        }
      ],
      order: [
        ['is_pinned', 'DESC'],
        ['updated_at', 'DESC']
      ]
    });

    return res.json({
      success: true,
      data: notes
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notes',
      error: error.message
    });
  }
};

// Get a note by ID
exports.getNoteById = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;

    // Find the note with its blocks and tags
    const note = await Note.findOne({
      where: { id: noteId },
      include: [
        {
          model: NoteBlock,
          as: 'blocks',
          order: [['order_position', 'ASC']]
        },
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] }
        },
        {
          model: NoteShare,
          as: 'shares',
          required: false
        }
      ]
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check if the user has access to this note
    const hasAccess = note.user_id === userId || 
                     note.shares.some(share => share.user_id === userId);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    return res.json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error('Error fetching note:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch note',
      error: error.message
    });
  }
};

// Create a new note
exports.createNote = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { title, content, parent_id, project_id, task_id, is_markdown, blocks } = req.body;
    const userId = req.user.id;

    // Create the note
    const note = await Note.create({
      title: title || 'Untitled',
      content,
      parent_id,
      project_id,
      task_id,
      is_markdown: is_markdown === undefined ? true : is_markdown,
      user_id: userId,     // Add user_id field
      created_by: userId
    }, { transaction: t });

    // Create blocks if provided
    if (blocks && blocks.length > 0) {
      const noteBlocks = blocks.map((block, index) => ({
        note_id: note.id,
        type: block.type,
        content: block.content,
        metadata: block.metadata,
        order_position: index
      }));

      await NoteBlock.bulkCreate(noteBlocks, { transaction: t });
    }

    await t.commit();

    return res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: note
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating note:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create note',
      error: error.message
    });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const noteId = req.params.id;
    const userId = req.user.id;
    const { title, content, parent_id, project_id, task_id, is_markdown, is_pinned, is_archived, blocks } = req.body;

    // Find the note
    const note = await Note.findByPk(noteId, {
      include: [
        {
          model: NoteShare,
          as: 'shares',
          required: false
        }
      ]
    });

    if (!note) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check if the user has permission to update the note
    const isOwner = note.user_id === userId;
    const sharedWithUser = note.shares.find(share => 
      share.user_id === userId && ['edit', 'admin'].includes(share.permission)
    );

    if (!isOwner && !sharedWithUser) {
      await t.rollback();
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update the note
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (parent_id !== undefined) updateData.parent_id = parent_id;
    if (project_id !== undefined) updateData.project_id = project_id;
    if (task_id !== undefined) updateData.task_id = task_id;
    if (is_markdown !== undefined) updateData.is_markdown = is_markdown;
    if (is_pinned !== undefined) updateData.is_pinned = is_pinned;
    if (is_archived !== undefined) updateData.is_archived = is_archived;

    await note.update(updateData, { transaction: t });

    // Update blocks if provided
    if (blocks) {
      // First, delete existing blocks
      await NoteBlock.destroy({
        where: { note_id: noteId },
        transaction: t
      });

      // Then create new blocks
      if (blocks.length > 0) {
        const noteBlocks = blocks.map((block, index) => ({
          note_id: noteId,
          type: block.type,
          content: block.content,
          metadata: block.metadata,
          order_position: index
        }));

        await NoteBlock.bulkCreate(noteBlocks, { transaction: t });
      }
    }

    await t.commit();

    // Fetch the updated note with all its associations
    const updatedNote = await Note.findByPk(noteId, {
      include: [
        {
          model: NoteBlock,
          as: 'blocks',
          order: [['order_position', 'ASC']]
        },
        {
          model: Tag,
          as: 'tags',
          through: { attributes: [] }
        }
      ]
    });

    return res.json({
      success: true,
      message: 'Note updated successfully',
      data: updatedNote
    });
  } catch (error) {
    await t.rollback();
    console.error('Error updating note:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update note',
      error: error.message
    });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;

    // Find the note
    const note = await Note.findByPk(noteId, {
      include: [
        {
          model: NoteShare,
          as: 'shares',
          required: false
        }
      ]
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check if the user has permission to delete the note
    const isOwner = note.user_id === userId;
    const isAdmin = note.shares.some(share => 
      share.user_id === userId && share.permission === 'admin'
    );

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete the note (cascades to blocks, shares, etc. through foreign keys)
    await note.destroy();

    return res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete note',
      error: error.message
    });
  }
};

// Share a note with another user
exports.shareNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    const userId = req.user.id;
    const { user_id, permission } = req.body;

    // Find the note
    const note = await Note.findByPk(noteId, {
      include: [
        {
          model: NoteShare,
          as: 'shares',
          required: false
        }
      ]
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Check if the user has permission to share the note
    const isOwner = note.user_id === userId;
    const isAdmin = note.shares.some(share => 
      share.user_id === userId && share.permission === 'admin'
    );

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Cannot share with the owner
    if (note.user_id === user_id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot share note with its owner'
      });
    }

    // Check if the note is already shared with the user
    const existingShare = await NoteShare.findOne({
      where: {
        note_id: noteId,
        user_id: user_id
      }
    });

    if (existingShare) {
      // Update existing share
      await existingShare.update({
        permission,
        shared_by: userId
      });
    } else {
      // Create new share
      await NoteShare.create({
        note_id: noteId,
        user_id: user_id,
        permission,
        shared_by: userId
      });
    }

    return res.json({
      success: true,
      message: 'Note shared successfully'
    });
  } catch (error) {
    console.error('Error sharing note:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to share note',
      error: error.message
    });
  }
};