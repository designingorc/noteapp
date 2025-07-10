import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import NoteForm from "../components/NoteForm";
import NoteItem from "../components/NoteItem";
import { useAuth } from "../context/AuthContext";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated]); // Fetch notes when authenticated

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error(
        "Error fetching notes:",
        err.response?.data?.msg || err.message
      );
    }
  };

  const handleAddOrUpdateNote = async (noteData) => {
    try {
      if (editingNote) {
        const res = await api.put(`/notes/${editingNote.id}`, noteData);
        setNotes(
          notes.map((note) => (note.id === res.data.id ? res.data : note))
        );
        setEditingNote(null);
      } else {
        const res = await api.post("/notes", noteData);
        setNotes([res.data, ...notes]);
      }
    } catch (err) {
      console.error(
        "Error saving note:",
        err.response?.data?.msg || err.message
      );
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await api.delete(`/notes/${id}`);
        setNotes(notes.filter((note) => note.id !== id));
      } catch (err) {
        console.error(
          "Error deleting note:",
          err.response?.data?.msg || err.message
        );
      }
    }
  };

  const handleEditClick = (note) => {
    setEditingNote(note);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  return (
    <div>
      <h1>My Notes</h1>
      <button onClick={logout} style={{ marginBottom: "20px" }}>
        Logout
      </button>
      <NoteForm
        note={editingNote}
        onSubmit={handleAddOrUpdateNote}
        onCancel={handleCancelEdit}
      />
      <hr />
      <h2>Your Notes</h2>
      {notes.length === 0 ? (
        <p>No notes yet. Create one above!</p>
      ) : (
        <div>
          {notes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onEdit={handleEditClick}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
