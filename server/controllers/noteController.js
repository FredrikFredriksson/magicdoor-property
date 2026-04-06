// In-memory storage (no database)
let notes = [];
let nextId = 1;

// @desc    Get all notes
// @route   GET /api/notes
// @access  Public
exports.getNotes = (req, res) => {
  res.json(notes);
};

// @desc    Get single note
// @route   GET /api/notes/:id
// @access  Public
exports.getNote = (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }
  res.json(note);
};

// @desc    Create a note
// @route   POST /api/notes
// @access  Public
exports.createNote = (req, res) => {
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

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Public
exports.updateNote = (req, res) => {
  const note = notes.find(n => n.id === parseInt(req.params.id));
  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  const { content } = req.body;
  if (content) note.content = content;

  res.json(note);
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Public
exports.deleteNote = (req, res) => {
  const index = notes.findIndex(n => n.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: 'Note not found' });
  }

  notes.splice(index, 1);
  res.json({ message: 'Note deleted' });
};
