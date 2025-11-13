// src/App.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import axios from 'axios';
import App from './App';

// Mock axios for this specific test file
jest.mock('axios');

const mockResponse = {
  data: [
    { _id: '1', title: 'Todo 1', description: 'A description', priority: 'medium', completed: false },
    { _id: '2', title: 'Todo 2', description: 'Another description', priority: 'high', completed: true },
  ]
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set the default mock for the initial fetch
    axios.get.mockResolvedValue(mockResponse);
  });

  test('renders app header', () => {
    render(<App />);
    expect(screen.getByText(/MERN Todo App/i)).toBeInTheDocument();
    expect(screen.getByText(/Testing and Debugging Assignment/i)).toBeInTheDocument();
  });

  test('fetches and displays todos', async () => {
    render(<App />);
    
    // Wait for the loading to complete and todos to appear
    await act(async () => {
      jest.runAllTimers();
    });
    
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Todo 2')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('adds a new todo', async () => {
    const newTodo = { _id: '3', title: 'New Todo', description: '', priority: 'medium', completed: false };
    axios.post.mockResolvedValue({ data: { data: newTodo } });

    render(<App />);
    
    // Wait for initial todos to load
    await act(async () => {
      jest.runAllTimers();
    });
    
    await waitFor(() => screen.getByText('Todo 1'));

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
        expect.stringContaining('/todos'),
        expect.objectContaining({
          title: 'New Todo',
          description: '',
          priority: 'medium',
        })
      );
    });
    
    await waitFor(() => {
      expect(screen.getByText('New Todo')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('deletes a todo', async () => {
    axios.delete.mockResolvedValue({});

    render(<App />);
    
    // Wait for initial todos to load
    await act(async () => {
      jest.runAllTimers();
    });
    
    await waitFor(() => screen.getByText('Todo 1'));

    await act(async () => {
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);
      
      // Run timers to resolve the promise
      jest.runAllTimers();
    });

    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
    
    await waitFor(() => {
      expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('toggles todo completion', async () => {
    const toggledTodo = { ...mockResponse.data[0], completed: true };
    axios.patch.mockResolvedValue({ data: { data: toggledTodo } });

    render(<App />);
    
    // Wait for initial todos to load
    await act(async () => {
      jest.runAllTimers();
    });
    
    await waitFor(() => screen.getByText('Todo 1'));

    await act(async () => {
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      
      // Run timers to resolve the promise
      jest.runAllTimers();
    });

    await waitFor(() => expect(axios.patch).toHaveBeenCalledTimes(1));
    
    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0].checked).toBe(true);
    }, { timeout: 3000 });
  });

  test('updates a todo title', async () => {
    const updatedTodo = { ...mockResponse.data[0], title: 'Updated Todo' };
    axios.put.mockResolvedValue({ data: { data: updatedTodo } });

    render(<App />);
    
    // Wait for initial todos to load
    await act(async () => {
      jest.runAllTimers();
    });
    
    await waitFor(() => screen.getByText('Todo 1'));

    await act(async () => {
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    });

    await act(async () => {
      const input = screen.getByPlaceholderText('Title');
      fireEvent.change(input, { target: { value: 'Updated Todo' } });

      const saveButton = screen.getByText(/save/i);
      fireEvent.click(saveButton);
      
      // Run timers to resolve the promise
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/todos/1'),
        expect.objectContaining({
          title: 'Updated Todo',
          description: 'A description',
          priority: 'medium',
        })
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Updated Todo')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('filters todos', async () => {
    render(<App />);
    
    // Wait for initial todos to load
    await act(async () => {
      jest.runAllTimers();
    });
    
    await waitFor(() => screen.getByText('Todo 1'));

    await act(async () => {
      fireEvent.click(screen.getByText(/completed/i));
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('?completed=true'));
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/active/i));
      jest.runAllTimers();
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('?completed=false'));
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/^all$/i));
      jest.runAllTimers();
    });

    await waitFor(() => {
      // Use a more robust Jest matcher
      expect(axios.get).toHaveBeenLastCalledWith(expect.stringMatching(/\/todos$/));
    });
  });
});