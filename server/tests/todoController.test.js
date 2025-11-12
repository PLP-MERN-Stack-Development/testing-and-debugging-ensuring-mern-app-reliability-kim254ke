// tests/todoController.test.js
import request from 'supertest';
import app from '../src/server.js';
import Todo from '../src/models/Todo.js';

describe('Todo Controller', () => {
  test('should get all todos', async () => {
    await Todo.create({ title: 'Test Todo 1' });
    await Todo.create({ title: 'Test Todo 2', completed: true });

    const response = await request(app)
      .get('/api/todos')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0].title).toBe('Test Todo 2'); // Sorted by createdAt desc
  });

  test('should filter todos by completed status', async () => {
    await Todo.create({ title: 'Completed Todo', completed: true });
    await Todo.create({ title: 'Incomplete Todo', completed: false });

    // Get completed todos
    const completedResponse = await request(app)
      .get('/api/todos?completed=true')
      .expect(200);

    expect(completedResponse.body.data).toHaveLength(1);
    expect(completedResponse.body.data[0].completed).toBe(true);

    // Get incomplete todos
    const incompleteResponse = await request(app)
      .get('/api/todos?completed=false')
      .expect(200);

    expect(incompleteResponse.body.data).toHaveLength(1);
    expect(incompleteResponse.body.data[0].completed).toBe(false);
  });

  test('should create a new todo', async () => {
    const todoData = {
      title: 'New Todo',
      description: 'Test description',
      priority: 'high'
    };

    const response = await request(app)
      .post('/api/todos')
      .send(todoData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe(todoData.title);
    expect(response.body.data.description).toBe(todoData.description);
    expect(response.body.data.priority).toBe(todoData.priority);
    expect(response.body.data.completed).toBe(false);
  });

  test('should return 400 when creating todo without title', async () => {
    const response = await request(app)
      .post('/api/todos')
      .send({})
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('required');
  });

  test('should update a todo', async () => {
    const todo = await Todo.create({ title: 'Original Todo' });

    const updateData = {
      title: 'Updated Todo',
      description: 'Updated description',
      priority: 'low',
      completed: true
    };

    const response = await request(app)
      .put(`/api/todos/${todo._id}`)
      .send(updateData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe(updateData.title);
    expect(response.body.data.description).toBe(updateData.description);
    expect(response.body.data.priority).toBe(updateData.priority);
    expect(response.body.data.completed).toBe(updateData.completed);
  });

  test('should return 404 when updating non-existent todo', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    
    const response = await request(app)
      .put(`/api/todos/${fakeId}`)
      .send({ title: 'Updated Todo' })
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Todo not found');
  });

  test('should delete a todo', async () => {
    const todo = await Todo.create({ title: 'To Delete' });

    const response = await request(app)
      .delete(`/api/todos/${todo._id}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Todo deleted');

    // Verify deletion
    const deletedTodo = await Todo.findById(todo._id);
    expect(deletedTodo).toBeNull();
  });

  test('should return 404 when deleting non-existent todo', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    
    const response = await request(app)
      .delete(`/api/todos/${fakeId}`)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Todo not found');
  });

  test('should toggle todo completion', async () => {
    const todo = await Todo.create({ title: 'Toggle Test', completed: false });

    // Toggle to completed
    const response = await request(app)
      .patch(`/api/todos/${todo._id}/toggle`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.completed).toBe(true);

    // Verify in database
    const updatedTodo = await Todo.findById(todo._id);
    expect(updatedTodo.completed).toBe(true);

    // Toggle back to incomplete
    await request(app)
      .patch(`/api/todos/${todo._id}/toggle`)
      .expect(200);

    // Verify in database
    const toggledBackTodo = await Todo.findById(todo._id);
    expect(toggledBackTodo.completed).toBe(false);
  });

  test('should return 404 when toggling non-existent todo', async () => {
    const fakeId = '507f1f77bcf86cd799439011';
    
    const response = await request(app)
      .patch(`/api/todos/${fakeId}/toggle`)
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Todo not found');
  });

  test('should delete all todos', async () => {
    await Todo.create({ title: 'Todo 1' });
    await Todo.create({ title: 'Todo 2' });
    await Todo.create({ title: 'Todo 3' });

    const response = await request(app)
      .delete('/api/todos/all')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('All todos deleted');

    // Verify all todos are deleted
    const allTodos = await Todo.find();
    expect(allTodos).toHaveLength(0);
  });

  test('should return test route', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);

    expect(response.body.message).toBe('MERN Testing API');
  });
});