import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTodo from '../../components/AddTodo';

describe('AddTodo Component', () => {
  let mockOnAdd;

  beforeEach(() => {
    mockOnAdd = jest.fn().mockResolvedValue({});
  });

  test('renders add todo form', () => {
    render(<AddTodo onAdd={mockOnAdd} />);
    
    expect(screen.getByText('Add New Todo')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo title')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo description')).toBeInTheDocument();
    expect(screen.getByLabelText('Todo priority')).toBeInTheDocument();
  });

  test('allows user to type in title input', async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    const titleInput = screen.getByLabelText('Todo title');
    await user.type(titleInput, 'New Todo');
    
    expect(titleInput.value).toBe('New Todo');
  });

  test('allows user to type in description textarea', async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    const descInput = screen.getByLabelText('Todo description');
    await user.type(descInput, 'Test description');
    
    expect(descInput.value).toBe('Test description');
  });

  test('allows user to select priority', async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    const prioritySelect = screen.getByLabelText('Todo priority');
    await user.selectOptions(prioritySelect, 'high');
    
    expect(prioritySelect.value).toBe('high');
  });

  test('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    await user.type(screen.getByLabelText('Todo title'), 'Test Todo');
    await user.type(screen.getByLabelText('Todo description'), 'Test description');
    await user.selectOptions(screen.getByLabelText('Todo priority'), 'high');
    
    await user.click(screen.getByText('Add Todo'));
    
    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test description',
        priority: 'high'
      });
    });
  });

  test('shows error when title is empty', async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    await user.click(screen.getByText('Add Todo'));
    
    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  test('shows error when title is too short', async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    await user.type(screen.getByLabelText('Todo title'), 'ab');
    await user.click(screen.getByText('Add Todo'));
    
    expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument();
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  test('clears form after successful submission', async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    const titleInput = screen.getByLabelText('Todo title');
    const descInput = screen.getByLabelText('Todo description');
    
    await user.type(titleInput, 'Test Todo');
    await user.type(descInput, 'Test description');
    await user.click(screen.getByText('Add Todo'));
    
    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(descInput.value).toBe('');
    });
  });

  test('trims whitespace from inputs', async () => {
    const user = userEvent.setup();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    await user.type(screen.getByLabelText('Todo title'), '  Test Todo  ');
    await user.type(screen.getByLabelText('Todo description'), '  Test description  ');
    await user.click(screen.getByText('Add Todo'));
    
    await waitFor(() => {
      expect(mockOnAdd).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test description',
        priority: 'medium'
      });
    });
  });

  test('shows loading state during submission', async () => {
    const slowMockOnAdd = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    const user = userEvent.setup();
    render(<AddTodo onAdd={slowMockOnAdd} />);
    
    await user.type(screen.getByLabelText('Todo title'), 'Test Todo');
    await user.click(screen.getByText('Add Todo'));
    
    expect(screen.getByText('Adding...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Add Todo')).toBeInTheDocument();
    });
  });

  test('disables inputs during submission', async () => {
    const slowMockOnAdd = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    const user = userEvent.setup();
    render(<AddTodo onAdd={slowMockOnAdd} />);
    
    await user.type(screen.getByLabelText('Todo title'), 'Test Todo');
    await user.click(screen.getByText('Adding...'));
    
    expect(screen.getByLabelText('Todo title')).toBeDisabled();
  });

  test('shows error message when submission fails', async () => {
    mockOnAdd.mockRejectedValue(new Error('Network error'));
    const user = userEvent.setup();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    await user.type(screen.getByLabelText('Todo title'), 'Test Todo');
    await user.click(screen.getByText('Add Todo'));
    
    await waitFor(() => {
      expect(screen.getByText('Failed to add todo')).toBeInTheDocument();
    });
  });
});