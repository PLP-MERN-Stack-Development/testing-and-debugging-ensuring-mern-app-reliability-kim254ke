// src/tests/integration/TodoApp.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import axios from 'axios';
import TodoApp from '../../components/TodoApp';

// Mock axios for this specific test file
jest.mock('axios');

describe('TodoApp Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  test('fetches and displays todos on mount', async () => {
    const mockResponse = {
      data: [
        { _id: '1', title: 'Test Todo 1', completed: false, priority: 'medium', description: '' },
        { _id: '2', title: 'Test Todo 2', completed: true, priority: 'low', description: '' }
      ]
    };

    axios.get.mockResolvedValue(mockResponse);

    render(<TodoApp />);

    // IMPORTANT: Advance timers to resolve the promise from the mock
    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    }, { timeout: 3000 });

    expect(axios.get).toHaveBeenCalledWith(
      'http://localhost:5000/api/todos'
    );
  });

  test('adds a new todo', async () => {
    const mockResponse = { data: [{ _id: '1', title: 'Test Todo 1', completed: false, priority: 'medium', description: '' }] };
    const newTodo = { _id: '2', title: 'New Todo', completed: false, priority: 'medium', description: '' };
    
    axios.get.mockResolvedValue(mockResponse);
    axios.post.mockResolvedValue({ data: { data: newTodo } });

    render(<TodoApp />);
    
    // Wait for initial todos to load
    await act(async () => {
      jest.runAllTimers();
    });

    await waitFor(() => screen.getByText('Test Todo 1'));

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter todo title/i), {
        target: { value: 'New Todo' },
      });
      
      fireEvent.click(screen.getByText(/add todo/i));
      
      // Run timers to resolve the promise
      jest.runAllTimers();
    });

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
    
    await waitFor(() => {
      expect(screen.getByText('New Todo')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('toggles a todo', async () => {
    const mockResponse = { data: [{ _id: '1', title: 'Test Todo 1', completed: false, priority: 'medium', description: '' }] };

    axios.get.mockResolvedValue(mockResponse);
    axios.patch.mockResolvedValue({ data: { data: { _id: '1', title: 'Test Todo 1', completed: true } } });

    render(<TodoApp />);
    
    // Wait for initial todos to load
    await act(async () => {
      jest.runAllTimers();
    });
    
    await waitFor(() => screen.getByText('Test Todo 1'));

    // Get the checkbox before the act block
    const checkbox = screen.getByRole('checkbox');

    await act(async () => {
      fireEvent.click(checkbox);
      
      // Run timers to resolve the promise
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalledWith(
        'http://localhost:5000/api/todos/1/toggle',
        { completed: true }
      );
    });

    await waitFor(() => {
      // Re-get the checkbox to check its updated state
      const updatedCheckbox = screen.getByRole('checkbox');
      expect(updatedCheckbox.checked).toBe(true);
    }, { timeout: 3000 });
  });
});