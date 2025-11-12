// src/tests/integration/TodoApp.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import TodoApp from '../../components/TodoApp';

jest.mock('axios');

describe('TodoApp Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays todos on mount', async () => {
    const mockTodos = {
      data: {
        data: [
          { _id: '1', title: 'Test Todo 1', completed: false },
          { _id: '2', title: 'Test Todo 2', completed: true }
        ]
      }
    };

    axios.get.mockResolvedValue(mockTodos);

    render(<TodoApp />);

    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith(
      'http://localhost:5000/api/todos'
    );
  });

  test('adds a new todo', async () => {
    const mockTodos = {
      data: {
        data: [
          { _id: '1', title: 'Test Todo 1', completed: false }
        ]
      }
    };

    const newTodo = { _id: '2', title: 'New Todo', completed: false };
    
    axios.get.mockResolvedValue(mockTodos);
    axios.post.mockResolvedValue({ data: { data: newTodo } });

    render(<TodoApp />);

    await waitFor(() => screen.getByText('Test Todo 1'));

    fireEvent.change(screen.getByPlaceholderText(/enter todo title/i), {
      target: { value: 'New Todo' },
    });
    
    fireEvent.click(screen.getByText(/add todo/i));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/todos',
        expect.objectContaining({
          title: 'New Todo',
          description: '',
          priority: 'medium'
        })
      );
    });
    
    expect(screen.getByText('New Todo')).toBeInTheDocument();
  });

  test('toggles a todo', async () => {
    const mockTodos = {
      data: {
        data: [
          { _id: '1', title: 'Test Todo 1', completed: false }
        ]
      }
    };

    axios.get.mockResolvedValue(mockTodos);
    axios.patch.mockResolvedValue({ data: { data: { _id: '1', title: 'Test Todo 1', completed: true } } });

    render(<TodoApp />);

    await waitFor(() => screen.getByText('Test Todo 1'));

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(
        'http://localhost:5000/api/todos/1',
        { completed: true }
      );
    });

    await waitFor(() => {
      expect(checkbox.checked).toBe(true);
    });
  });
});