import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TodoApp from './components/TodoApp';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get('/api/todos'); // replace with your API URL
        setTodos(res.data || []);
      } catch (error) {
        console.error('Error fetching todos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const addTodo = async (title) => {
    try {
      const res = await axios.post('/api/todos', { title });
      setTodos([...todos, res.data]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const res = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  return (
    <div>
      <h1>MERN Todo App</h1>
      <p>Testing and Debugging Assignment</p>
      {loading ? <p>Loading...</p> : <TodoApp todos={todos} addTodo={addTodo} deleteTodo={deleteTodo} toggleTodo={toggleTodo} />}
    </div>
  );
};

export default App;
