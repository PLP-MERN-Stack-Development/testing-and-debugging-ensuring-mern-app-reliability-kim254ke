// client/src/tests/unit/TodoItem.test.jsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react'; // 1. Import waitFor
import TodoApp from '../../components/TodoApp';
import axios from 'axios';

jest.mock('axios');

describe('TodoApp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders TodoApp component and handles initial load', async () => {
    // Mock the initial load to return an empty list of todos
    axios.get.mockResolvedValue({ data: { data: [] } });
    
    render(<TodoApp />);
    
    // 2. Use waitFor to wait for the component to finish updating
    // This ensures the state update from useEffect is complete before we check the DOM.
    await waitFor(() => {
      // We can check for an element that should be there after the data is "loaded"
      expect(screen.getByText(/Add Todo/i)).toBeInTheDocument();
    });
  });
});