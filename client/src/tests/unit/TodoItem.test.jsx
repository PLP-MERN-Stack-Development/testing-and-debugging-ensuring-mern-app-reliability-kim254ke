// src/tests/unit/TodoItem.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import TodoApp from '../../components/TodoApp';
import axios from 'axios';

jest.mock('axios');

describe('TodoApp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders TodoApp component', () => {
    // Mock the initial load
    axios.get.mockResolvedValue({ data: { data: [] } });
    
    render(<TodoApp />);
    
    // Check for the Add Todo button
    expect(screen.getByText(/Add Todo/i)).toBeInTheDocument();
  });
});