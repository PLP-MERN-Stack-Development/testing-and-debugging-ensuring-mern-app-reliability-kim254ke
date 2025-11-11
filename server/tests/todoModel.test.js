const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Todo = require('../../src/models/Todo');

let mongoServer;

// Setup: Connect to in-memory database before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Cleanup: Clear database after each test
afterEach(async () => {
  await Todo.deleteMany({});
});

// Teardown: Close connection and stop server after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Todo Model Unit Tests', () => {
  describe('Todo Creation', () => {
    test('should create a todo with valid data', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'This is a test todo',
        priority: 'high'
      };

      const todo = await Todo.create(todoData);

      expect(todo).toBeDefined();
      expect(todo.title).toBe(todoData.title);
      expect(todo.description).toBe(todoData.description);
      expect(todo.priority).toBe(todoData.priority);
      expect(todo.completed).toBe(false);
    });

    test('should create a todo with minimal data', async () => {
      const todoData = { title: 'Minimal Todo' };
      const todo = await Todo.create(todoData);

      expect(todo.title).toBe('Minimal Todo');
      expect(todo.completed).toBe(false);
      expect(todo.priority).toBe('medium');
    });

    test('should fail when title is missing', async () => {
      const todoData = { description: 'No title' };

      await expect(Todo.create(todoData)).rejects.toThrow();
    });

    test('should fail when title is too short', async () => {
      const todoData = { title: 'ab' };

      await expect(Todo.create(todoData)).rejects.toThrow();
    });

    test('should fail when title is too long', async () => {
      const todoData = { title: 'a'.repeat(101) };

      await expect(Todo.create(todoData)).rejects.toThrow();
    });

    test('should fail with invalid priority', async () => {
      const todoData = {
        title: 'Test Todo',
        priority: 'invalid'
      };

      await expect(Todo.create(todoData)).rejects.toThrow();
    });
  });

  describe('Todo Instance Methods', () => {
    test('toggleComplete should toggle completed status', async () => {
      const todo = await Todo.create({ title: 'Toggle Test' });
      
      expect(todo.completed).toBe(false);
      
      await todo.toggleComplete();
      expect(todo.completed).toBe(true);
      
      await todo.toggleComplete();
      expect(todo.completed).toBe(false);
    });
  });

  describe('Todo Static Methods', () => {
    beforeEach(async () => {
      await Todo.create([
        { title: 'High Priority', priority: 'high' },
        { title: 'Medium Priority', priority: 'medium' },
        { title: 'Low Priority', priority: 'low' },
        { title: 'Completed Todo', completed: true },
      ]);
    });

    test('findByPriority should return todos with specific priority', async () => {
      const highPriorityTodos = await Todo.findByPriority('high');
      
      expect(highPriorityTodos).toHaveLength(1);
      expect(highPriorityTodos[0].priority).toBe('high');
    });

    test('findIncomplete should return only incomplete todos', async () => {
      const incompleteTodos = await Todo.findIncomplete();
      
      expect(incompleteTodos).toHaveLength(3);
      incompleteTodos.forEach(todo => {
        expect(todo.completed).toBe(false);
      });
    });
  });

  describe('Todo Validation', () => {
    test('should trim whitespace from title', async () => {
      const todo = await Todo.create({ title: '  Trimmed  ' });
      expect(todo.title).toBe('Trimmed');
    });

    test('should have timestamps', async () => {
      const todo = await Todo.create({ title: 'Timestamp Test' });
      
      expect(todo.createdAt).toBeDefined();
      expect(todo.updatedAt).toBeDefined();
    });
  });
});