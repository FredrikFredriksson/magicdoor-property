const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/noteController');

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
