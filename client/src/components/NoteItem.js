import React from 'react';

const NoteItem = ({ note, onEdit, onDelete }) => {
    return (
        <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h4>{note.title}</h4>
            <p>{note.content}</p>
            <small>Created: {new Date(note.created_at).toLocaleString()}</small><br/>
            {note.updated_at && <small>Updated: {new Date(note.updated_at).toLocaleString()}</small>}
            <div>
                <button onClick={() => onEdit(note)} style={{ marginRight: '10px' }}>Edit</button>
                <button onClick={() => onDelete(note.id)}>Delete</button>
            </div>
        </div>
    );
};

export default NoteItem;