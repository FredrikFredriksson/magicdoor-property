const express = require('express');
const router = express.Router();

// In-memory storage
let notes = [];
let nextId = 1;

// Controller functions
const getNotes = (req, res) => {
  res.json(notes);
};

const getNote = (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  res.json(note);
};

const createNote = (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: 'Content is required' });
  }

  const note = {
    id: nextId++,
    content,
    createdAt: new Date().toISOString()
  };

  notes.push(note);
  res.status(201).json(note);
};

const updateNote = (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  const { content } = req.body;
  if (content) note.content = content;

  res.json(note);
};

const deleteNote = (req, res) => {
  const index = notes.findIndex(n => n.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }

  notes.splice(index, 1);
  res.json({ message: 'Note deleted' });
};

// Base routes
router
  .route('/')
  .get(getNotes)
  .post(createNote);

// Single note routes
router
  .route('/:id')
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);

module.exports = router;
