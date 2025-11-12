// src/App.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import axios from 'axios';
import App from './App';

// Mock all axios methods
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
}));

const mockTodos = [
  { _id: '1', title: 'Todo 1', completed: false },
  { _id: '2', title: 'Todo 2', completed: true },
];

describe('App Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: { data: mockTodos } });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders app header', () => {
    render(<App />);
    expect(screen.getByText(/MERN Todo App/i)).toBeInTheDocument();
    expect(screen.getByText(/Testing and Debugging Assignment/i)).toBeInTheDocument();
  });

  test('fetches and displays todos', async () => {
    render(<App />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  test('adds a new todo', async () => {
    const newTodo = { _id: '3', title: 'New Todo', description: '', priority: 'medium', completed: false };
    axios.post.mockResolvedValue({ data: { data: newTodo } });

    render(<App />);
    await waitFor(() => screen.getByText('Todo 1'));

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/enter todo title/i), {
        target: { value: 'New Todo' },
      });
      
      fireEvent.click(screen.getByText(/add todo/i));
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
    
    // Wait for the UI to update
    await waitFor(() => {
      expect(screen.getByText('New Todo')).toBeInTheDocument();
    });
  });

  test('deletes a todo', async () => {
    axios.delete.mockResolvedValue({});

    render(<App />);
    await waitFor(() => screen.getByText('Todo 1'));

    await act(async () => {
      const deleteButtons = screen.getAllByText(/delete/i);
      fireEvent.click(deleteButtons[0]);
    });

    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1));
    
    // Wait for the UI to update
    await waitFor(() => {
      expect(screen.queryByText('Todo 1')).not.toBeInTheDocument();
    });
  });

  test('toggles todo completion', async () => {
    const toggledTodo = { ...mockTodos[0], completed: true };
    axios.patch.mockResolvedValue({ data: { data: toggledTodo } });

    render(<App />);
    await waitFor(() => screen.getByText('Todo 1'));

    await act(async () => {
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
    });

    await waitFor(() => expect(axios.patch).toHaveBeenCalledTimes(1));
    
    // Wait for the UI to update
    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes[0].checked).toBe(true);
    });
  });

  test('updates a todo title', async () => {
    const updatedTodo = { ...mockTodos[0], title: 'Updated Todo', description: '', priority: 'medium' };
    axios.put.mockResolvedValue({ data: { data: updatedTodo } });

    render(<App />);
    await waitFor(() => screen.getByText('Todo 1'));

    await act(async () => {
      const editButtons = screen.getAllByText(/edit/i);
      fireEvent.click(editButtons[0]);
    });

    // Wait for the edit form to appear
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    });

    await act(async () => {
      const input = screen.getByPlaceholderText('Title');
      fireEvent.change(input, { target: { value: 'Updated Todo' } });

      const saveButton = screen.getByText(/save/i);
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/todos/1'),
        expect.objectContaining({
          title: 'Updated Todo',
          description: '',
          priority: 'medium',
        })
      );
    });

    // Wait for the UI to update
    await waitFor(() => {
      expect(screen.getByText('Updated Todo')).toBeInTheDocument();
    });
  });

  test('filters todos', async () => {
    render(<App />);
    await waitFor(() => screen.getByText('Todo 1'));

    await act(async () => {
      fireEvent.click(screen.getByText(/completed/i));
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('?completed=true'));
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/active/i));
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('?completed=false'));
    });

    await act(async () => {
      fireEvent.click(screen.getByText(/^all$/i));
    });

    await waitFor(() => {
      const lastCall = axios.get.mock.calls[axios.get.mock.calls.length - 1][0];
      expect(lastCall).toMatch(/\/todos$/);
    });
  });
});