import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TodoList from './components/TodoList';
import AddTodo from './components/AddTodo';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/todos`;
      if (filter === 'completed') {
        url += '?completed=true';
      } else if (filter === 'incomplete') {
        url += '?completed=false';
      }
      
      const response = await axios.get(url);
      setTodos(response.data.data);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (todoData) => {
    try {
      const response = await axios.post(`${API_URL}/todos`, todoData);
      setTodos([response.data.data, ...todos]);
      return response.data.data;
    } catch (err) {
      setError('Failed to add todo');
      throw err;
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, updates);
      setTodos(todos.map(todo => 
        todo._id === id ? response.data.data : todo
      ));
      return response.data.data;
    } catch (err) {
      setError('Failed to update todo');
      throw err;
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      throw err;
    }
  };

  const toggleComplete = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/todos/${id}/toggle`);
      setTodos(todos.map(todo => 
        todo._id === id ? response.data.data : todo
      ));
    } catch (err) {
      setError('Failed to toggle todo');
      throw err;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>MERN Todo App</h1>
        <p>Testing and Debugging Assignment</p>
      </header>

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
            className={filter === 'incomplete' ? 'active' : ''}
            onClick={() => setFilter('incomplete')}
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

        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <TodoList 
            todos={todos}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
            onToggle={toggleComplete}
          />
        )}
      </main>
    </div>
  );
}

export default App;