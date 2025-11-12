// src/components/TodoApp.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/todos';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '', priority: 'medium' });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', priority: 'medium' });

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, [filter]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      let url = API_URL;
      if (filter === 'active') url += '?completed=false';
      if (filter === 'completed') url += '?completed=true';
      
      const response = await axios.get(url);
      // Handle different response structures
      const todosData = response.data.data || response.data || [];
      setTodos(Array.isArray(todosData) ? todosData : []);
    } catch (err) {
      console.error('Failed to fetch todos', err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  // Add new todo
  const addTodo = async () => {
    if (!newTodo.title.trim()) return;
    
    // Create a local todo immediately for better UX
    const localTodo = { 
      _id: Date.now().toString(), 
      title: newTodo.title, 
      description: newTodo.description,
      priority: newTodo.priority,
      completed: false 
    };
    
    // Update UI immediately
    setTodos(prev => [...prev, localTodo]);
    setNewTodo({ title: '', description: '', priority: 'medium' });
    
    try {
      const response = await axios.post(API_URL, newTodo);
      const addedTodo = response.data.data || response.data;
      if (addedTodo) {
        // Replace the local todo with the server one
        setTodos(prev => prev.map(t => t._id === localTodo._id ? addedTodo : t));
      }
    } catch (err) {
      console.error('Failed to add todo', err);
      // Keep the local todo even if API fails
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id, completed) => {
    // Update UI immediately
    setTodos(prev => prev.map(t => t._id === id ? { ...t, completed } : t));
    
    try {
      const response = await axios.patch(`${API_URL}/${id}`, { completed });
      const updatedTodo = response.data.data || response.data;
      if (updatedTodo) {
        // Update with server response
        setTodos(prev => prev.map(t => t._id === id ? updatedTodo : t));
      }
    } catch (err) {
      console.error('Failed to toggle todo', err);
      // Keep the local state even if API fails
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    // Update UI immediately
    setTodos(prev => prev.filter(t => t._id !== id));
    
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (err) {
      console.error('Failed to delete todo', err);
      // Keep the local state even if API fails
    }
  };

  // Start editing
  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditForm({ title: todo.title, description: todo.description || '', priority: todo.priority || 'medium' });
  };

  // Save edit
  const saveEdit = async () => {
    // Update UI immediately
    setTodos(prev => prev.map(t => t._id === editingId ? { ...t, ...editForm } : t));
    setEditingId(null);
    
    try {
      const response = await axios.put(`${API_URL}/${editingId}`, editForm);
      const updatedTodo = response.data.data || response.data;
      if (updatedTodo) {
        // Update with server response
        setTodos(prev => prev.map(t => t._id === editingId ? updatedTodo : t));
      }
    } catch (err) {
      console.error('Failed to update todo', err);
      // Keep the local state even if API fails
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Todo List</h2>

      {/* Add Todo Form */}
      <div style={{ marginBottom: '1rem' }}>
        <input
          value={newTodo.title}
          onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
          placeholder="Enter todo title"
        />
        <button onClick={addTodo} disabled={!newTodo.title.trim()}>
          Add Todo
        </button>
      </div>

      {/* Filter Buttons */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>

      {/* Todo List */}
      {loading ? (
        <p>Loading...</p>
      ) : todos.length === 0 ? (
        <p>No todos yet.</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo._id} style={{ marginBottom: '0.5rem' }}>
              {editingId === todo._id ? (
                // Edit mode
                <div>
                  <input
                    placeholder="Title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                  <button onClick={saveEdit}>Save</button>
                </div>
              ) : (
                // View mode
                <div>
                  <label style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                    <input
                      type="checkbox"
                      checked={todo.completed || false}
                      onChange={() => toggleTodo(todo._id, !todo.completed)}
                    />
                    {todo.title}
                  </label>
                  <button onClick={() => startEdit(todo)} style={{ marginLeft: '0.5rem' }}>
                    Edit
                  </button>
                  <button onClick={() => deleteTodo(todo._id)} style={{ marginLeft: '0.5rem' }}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}