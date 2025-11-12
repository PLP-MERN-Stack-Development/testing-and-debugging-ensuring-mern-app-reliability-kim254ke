// tests/Todo.test.js
import Todo from '../src/models/Todo.js';

describe('Todo Model', () => {
  test('should create a todo with valid data', async () => {
    const validTodo = {
      title: 'Test Todo',
      description: 'Test Description',
      priority: 'high'
    };

    const todo = await Todo.create(validTodo);

    expect(todo.title).toBe(validTodo.title);
    expect(todo.description).toBe(validTodo.description);
    expect(todo.priority).toBe(validTodo.priority);
    expect(todo.completed).toBe(false);
    expect(todo.createdAt).toBeDefined();
    expect(todo.updatedAt).toBeDefined();
  });

  test('should fail without a title', async () => {
    const invalidTodo = {
      description: 'Test Description',
      priority: 'high'
    };

    await expect(Todo.create(invalidTodo)).rejects.toThrow();
  });

  test('should fail with title shorter than 3 characters', async () => {
    const invalidTodo = {
      title: 'AB',
      description: 'Test Description'
    };

    await expect(Todo.create(invalidTodo)).rejects.toThrow();
  });

  test('should use default values', async () => {
    const todo = await Todo.create({ title: 'Test Todo' });

    expect(todo.description).toBe('');
    expect(todo.priority).toBe('medium');
    expect(todo.completed).toBe(false);
  });

  test('should trim title', async () => {
    const todo = await Todo.create({ title: '  Test Todo  ' });

    expect(todo.title).toBe('Test Todo');
  });

  test('should reject invalid priority', async () => {
    const invalidTodo = {
      title: 'Test Todo',
      priority: 'invalid'
    };

    await expect(Todo.create(invalidTodo)).rejects.toThrow();
  });

  test('should toggle completion status using instance method', async () => {
    const todo = await Todo.create({ title: 'Test Todo', completed: false });

    expect(todo.completed).toBe(false);

    await todo.toggleComplete();

    expect(todo.completed).toBe(true);

    await todo.toggleComplete();

    expect(todo.completed).toBe(false);
  });

  test('should find todos by priority using static method', async () => {
    await Todo.create({ title: 'Low Priority', priority: 'low' });
    await Todo.create({ title: 'Medium Priority', priority: 'medium' });
    await Todo.create({ title: 'High Priority', priority: 'high' });

    const highPriorityTodos = await Todo.findByPriority('high');
    expect(highPriorityTodos).toHaveLength(1);
    expect(highPriorityTodos[0].title).toBe('High Priority');

    const mediumPriorityTodos = await Todo.findByPriority('medium');
    expect(mediumPriorityTodos).toHaveLength(1);
    expect(mediumPriorityTodos[0].title).toBe('Medium Priority');
  });

  test('should find incomplete todos using static method', async () => {
    await Todo.create({ title: 'Completed Todo', completed: true });
    await Todo.create({ title: 'Incomplete Todo 1', completed: false });
    await Todo.create({ title: 'Incomplete Todo 2', completed: false });

    const incompleteTodos = await Todo.findIncomplete();
    expect(incompleteTodos).toHaveLength(2);
    expect(incompleteTodos.every(todo => todo.completed === false)).toBe(true);
  });
});