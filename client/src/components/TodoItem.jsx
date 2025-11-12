// src/components/TodoItem.jsx
import React, { useState } from 'react';
import './TodoItem.css';

const TodoItem = ({ todo, onDelete, onUpdate, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium');

  const handleSave = async () => {
    await onUpdate(todo._id, {
      title: editTitle,
      description: editDescription,
      priority: editPriority
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority || 'medium');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
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
          />
          <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <div className="edit-buttons">
            <button onClick={handleSave}>Save</button>
            <button className="cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
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
        <button onClick={() => setIsEditing(true)}>Edit</button>
        <button className="delete" onClick={() => onDelete(todo._id)}>Delete</button>
      </div>
    </div>
  );
};

export default TodoItem;