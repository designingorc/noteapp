const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware'); // Protect these routes

// @route   GET api/notes
// @desc    Get all notes for a user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
    try {
        const notes = await pool.query('SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
        res.json(notes.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/notes
// @desc    Create a new note
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    try {
        const newNote = await pool.query(
            'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [req.user.id, title, content]
        );
        res.json(newNote.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/notes/:id
// @desc    Get a single note by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const note = await pool.query('SELECT * FROM notes WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
        if (note.rows.length === 0) {
            return res.status(404).json({ msg: 'Note not found or you do not have access' });
        }
        res.json(note.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    try {
        const updatedNote = await pool.query(
            'UPDATE notes SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *',
            [title, content, req.params.id, req.user.id]
        );
        if (updatedNote.rows.length === 0) {
            return res.status(404).json({ msg: 'Note not found or you do not have access' });
        }
        res.json(updatedNote.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   DELETE api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedNote = await pool.query('DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING *', [req.params.id, req.user.id]);
        if (deletedNote.rows.length === 0) {
            return res.status(404).json({ msg: 'Note not found or you do not have access' });
        }
        res.json({ msg: 'Note removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;