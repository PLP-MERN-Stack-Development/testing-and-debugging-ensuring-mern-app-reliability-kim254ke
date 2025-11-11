// src/components/TodoList.jsx
import React, { useState } from 'react';
import './TodoList.css';

function TodoList({ todos, onDelete, onUpdate, onToggle }) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('medium');

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setEditPriority(todo.priority);
  };

  const saveEdit = async (id) => {
    await onUpdate(id, { title: editTitle, description: editDescription, priority: editPriority });
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="todo-list">
      {todos.length === 0 && <div className="empty-message">No todos yet. Add one above!</div>}

      {todos.map((todo) => (
        <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
          {editingId === todo._id ? (
            <div className="edit-form">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
              <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div className="edit-buttons">
                <button onClick={() => saveEdit(todo._id)}>Save</button>
                <button className="cancel" onClick={cancelEdit}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="todo-main">
                <input
                  type="checkbox"
                  checked={todo.completed || false}
                  onChange={() => onToggle(todo._id)}
                />
                <div className="todo-text">
                  <h3>{todo.title}</h3>
                  <p>{todo.description}</p>
                </div>
              </div>
              <div className={`priority ${todo.priority}`}>{todo.priority}</div>
              <div className="todo-actions">
                <button onClick={() => startEdit(todo)}>Edit</button>
                <button className="delete" onClick={() => onDelete(todo._id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TodoList;
