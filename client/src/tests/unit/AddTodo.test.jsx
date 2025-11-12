// src/tests/unit/AddTodo.test.jsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TodoApp from '../../components/TodoApp';
import axios from 'axios';

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
});