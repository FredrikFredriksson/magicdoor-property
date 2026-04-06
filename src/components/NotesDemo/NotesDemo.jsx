import React, { useState, useEffect } from 'react';

const API_URL = '/api/notes';

const styles = {
  page: {
    minHeight: '80vh',
    padding: '2rem',
    paddingTop: '120px',
    background: '#f0f2f5',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '1.5rem',
  },
  error: {
    color: '#d32f2f',
    background: '#fdecea',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    outline: 'none',
    background: 'white',
  },
  btn: (bg) => ({
    padding: '0.6rem 1.2rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    backgroundColor: bg,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  }),
  card: {
    background: 'white',
    borderRadius: '10px',
    padding: '1rem 1.2rem',
    marginBottom: '0.75rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  noteContent: {
    flex: 1,
    fontSize: '0.95rem',
    color: '#333',
    lineHeight: '1.5',
    wordBreak: 'break-word',
  },
  noteDate: {
    fontSize: '0.75rem',
    color: '#999',
    marginTop: '0.3rem',
  },
  actions: {
    display: 'flex',
    gap: '0.4rem',
    flexShrink: 0,
  },
  smallBtn: (bg) => ({
    padding: '0.35rem 0.7rem',
    fontSize: '0.75rem',
    fontWeight: '600',
    backgroundColor: bg,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  }),
  detail: {
    background: '#e8f4fd',
    border: '1px solid #90caf9',
    borderRadius: '10px',
    padding: '1rem 1.2rem',
    marginBottom: '1.5rem',
  },
  detailLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#1565c0',
    marginBottom: '0.4rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sectionLabel: {
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '0.75rem',
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    padding: '2rem',
    fontSize: '0.95rem',
  },
};

const NotesDemo = () => {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [error, setError] = useState('');

  // GET /notes
  const fetchNotes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setNotes(data);
      console.log('GET /notes -', data.length, 'notes retrieved');
    } catch (err) {
      setError('Failed to fetch notes');
      console.error('GET /notes - Error:', err);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  // POST /notes or PUT /notes/:id
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!content.trim()) { setError('Note cannot be empty'); return; }

    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        });
        const data = await res.json();
        console.log('PUT /notes/' + editingId + ' -', data);
        setEditingId(null);
      } else {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        });
        const data = await res.json();
        console.log('POST /notes -', data);
      }
      setContent('');
      fetchNotes();
    } catch (err) {
      setError('Failed to save note');
      console.error('Error:', err);
    }
  };

  // GET /notes/:id
  const handleView = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const data = await res.json();
      setSelectedNote(data);
      console.log('GET /notes/' + id + ' -', data);
    } catch (err) {
      setError('Failed to fetch note');
      console.error('GET /notes/' + id + ' - Error:', err);
    }
  };

  const handleEdit = (note) => {
    setContent(note.content);
    setEditingId(note.id);
    setSelectedNote(null);
  };

  // DELETE /notes/:id
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      console.log('DELETE /notes/' + id + ' - Note deleted');
      if (selectedNote && selectedNote.id === id) setSelectedNote(null);
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note');
      console.error('DELETE /notes/' + id + ' - Error:', err);
    }
  };

  return (
    <article className="page" style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Notes Demo</h1>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder={editingId ? 'Edit your note...' : 'Write a new note...'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.btn(editingId ? '#FF9800' : '#4CAF50')}>
            {editingId ? 'Update' : 'Add'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setContent(''); setEditingId(null); }}
              style={styles.btn('#888')}
            >
              Cancel
            </button>
          )}
        </form>

        {selectedNote && (
          <div style={styles.detail}>
            <p style={styles.detailLabel}>GET /notes/{selectedNote.id}</p>
            <p style={{ margin: '0 0 0.3rem', fontSize: '0.95rem', color: '#333' }}>
              {selectedNote.content}
            </p>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#666' }}>
              Created: {new Date(selectedNote.createdAt).toLocaleString()}
            </p>
            <button onClick={() => setSelectedNote(null)} style={styles.smallBtn('#888')}>
              Close
            </button>
          </div>
        )}

        <p style={styles.sectionLabel}>All Notes ({notes.length})</p>

        {notes.length === 0 ? (
          <p style={styles.empty}>No notes yet — add one above.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} style={styles.card}>
              <div>
                <p style={styles.noteContent}>{note.content}</p>
                <p style={styles.noteDate}>
                  #{note.id} &middot; {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>
              <div style={styles.actions}>
                <button onClick={() => handleView(note.id)} style={styles.smallBtn('#FF9800')}>
                  View
                </button>
                <button onClick={() => handleEdit(note)} style={styles.smallBtn('#2196F3')}>
                  Edit
                </button>
                <button onClick={() => handleDelete(note.id)} style={styles.smallBtn('#f44336')}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </article>
  );
};

export default NotesDemo;
