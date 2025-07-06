import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // You'll need to create this for basic styling

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(API_URL);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingNoteId) {
        // Update existing note
        await axios.put(`${API_URL}/${editingNoteId}`, { title, content});
        setEditingNoteId(null);
      } else {
        // Create new note
        await axios.post(API_URL, { title, content, color: getRandomColor() });
      }
      setTitle('');
      setContent('');
      fetchNotes(); // Refresh notes list
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleEdit = (note) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchNotes(); // Refresh notes list
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };
  
  const COLORS = ['lightblue', 'lightgreen', 'lightyellow', 'lightpink', 'lightsalmon'];

  function getRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  return (
    <div className="app-container">
      <form className="note-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" required value={title} onChange={(e) => setTitle(e.target.value)}/>
        <textarea placeholder="Content" rows={10} required value={content} onChange={(e) => setContent(e.target.value)} />

        <button type="submit">{editingNoteId ? 'Update Note' : 'Add Note'}</button>
        {editingNoteId && <button onClick={() => {setEditingNoteId(null); setTitle(''); setContent('');}}>Cancel Edit</button>}
      </form>
      <div className="notes-grid">
          {notes.map((note) => (
            <div key={note.id} className="note-item" style={{ backgroundColor: note.color || '#f9f9f9' }}>
              <div className="notes-header">
                <button onClick={() => handleDelete(note.id)}>x</button>
              </div>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              {/* <small>Created: {new Date(note.created_at).toLocaleString()}</small> */}
              <small>
                Created: {new Date(note.created_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </small>
              {note.updated_at && note.updated_at !== note.created_at && (
                // <small> | Updated: {new Date(note.updated_at).toLocaleString()}</small>
                <small>
                Updated: {new Date(note.updated_at).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </small>
              )}
              <button onClick={() => handleEdit(note)}>Edit</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
