// src/components/AddTodo.jsx
import React, { useState } from 'react';
import './AddTodo.css'; // Separate CSS file for AddTodo styling

function AddTodo({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }

    try {
      await onAdd({ title, description, priority });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setError('');
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}

      <label>
        Title
        <input
          type="text"
          placeholder="Enter todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Todo title"
        />
      </label>

      <label>
        Description
        <textarea
          placeholder="Enter todo description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          aria-label="Todo description"
        ></textarea>
      </label>

      <label>
        Priority
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          aria-label="Todo priority"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <button type="submit">Add Todo</button>
    </form>
  );
}

export default AddTodo;
