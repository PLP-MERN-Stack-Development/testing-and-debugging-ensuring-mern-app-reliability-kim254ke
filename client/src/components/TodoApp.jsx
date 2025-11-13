// src/components/TodoApp.jsx
import React, { useState, useEffect, useCallback } from 'react'; // 1. Import useCallback
import axios from 'axios';
import AddTodo from './AddTodo';
import TodoList from './TodoList';

const API_URL = 'http://localhost:5000/api/todos';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed

  // 2. Wrap fetchTodos in useCallback
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      let url = API_URL;
      if (filter === 'active') url += '?completed=false';
      if (filter === 'completed') url += '?completed=true';
      
      const response = await axios.get(url);
      const todosData = response.data.data || response.data || [];
      setTodos(Array.isArray(todosData) ? todosData : []);
    } catch (err) {
      console.error('Failed to fetch todos', err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, [filter]); // 3. Add any dependencies fetchTodos uses from outside itself (in this case, 'filter')

  // 4. Now you can safely add fetchTodos to the useEffect dependency array
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // ... the rest of your component (addTodo, toggleTodo, etc.) remains the same
  const addTodo = async (todoData) => {
    try {
      const response = await axios.post(API_URL, todoData);
      const addedTodo = response.data.data || response.data;
      setTodos(prev => [...prev, addedTodo]);
    } catch (err) {
      throw new Error('Failed to add todo');
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t._id === id);
    if (!todo) return;
    
    const newCompletedStatus = !todo.completed;
    setTodos(prev => prev.map(t => t._id === id ? { ...t, completed: newCompletedStatus } : t));

    try {
      await axios.patch(`${API_URL}/${id}/toggle`, { completed: newCompletedStatus });
    } catch (err) {
      console.error('Failed to toggle todo', err);
      setTodos(prev => prev.map(t => t._id === id ? { ...t, completed: !newCompletedStatus } : t));
    }
  };

  const deleteTodo = async (id) => {
    const originalTodos = todos;
    setTodos(prev => prev.filter(t => t._id !== id));

    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (err) {
      console.error('Failed to delete todo', err);
      setTodos(originalTodos);
    }
  };

  const updateTodo = async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      const updatedTodo = response.data.data || response.data;
      setTodos(prev => prev.map(t => t._id === id ? updatedTodo : t));
    } catch (err) {
      console.error('Failed to update todo', err);
    }
  };

  return (
    <main className="App-main">
      <AddTodo onAdd={addTodo} />

      <div className="filter-buttons">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={filter === 'active' ? 'active' : ''} 
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button 
          className={filter === 'completed' ? 'active' : ''} 
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <TodoList 
          todos={todos} 
          onDelete={deleteTodo} 
          onUpdate={updateTodo} 
          onToggle={toggleTodo} 
        />
      )}
    </main>
  );
}