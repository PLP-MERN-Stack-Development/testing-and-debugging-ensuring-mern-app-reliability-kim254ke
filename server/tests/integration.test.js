// tests/integration.test.js
import request from 'supertest';
import app from '../src/server.js';
import Todo from '../src/models/Todo.js'; // Add this import

describe('Todo API Integration', () => {
  test('full CRUD workflow', async () => {
    // Create
    const createResponse = await request(app)
      .post('/api/todos')
      .send({ title: 'Integration Test Todo', priority: 'high' })
      .expect(201);
    
    const todoId = createResponse.body.data._id;
    expect(createResponse.body.data.title).toBe('Integration Test Todo');
    expect(createResponse.body.data.priority).toBe('high');

    // Read all
    const getAllResponse = await request(app)
      .get('/api/todos')
      .expect(200);
    expect(getAllResponse.body.data).toHaveLength(1);

    // Update
    await request(app)
      .put(`/api/todos/${todoId}`)
      .send({ title: 'Updated Todo', priority: 'low' })
      .expect(200);

    // Verify update
    const updatedResponse = await request(app)
      .get('/api/todos')
      .expect(200);
    expect(updatedResponse.body.data[0].title).toBe('Updated Todo');
    expect(updatedResponse.body.data[0].priority).toBe('low');

    // Toggle
    await request(app)
      .patch(`/api/todos/${todoId}/toggle`)
      .expect(200);

    // Verify toggle
    const toggledResponse = await request(app)
      .get('/api/todos')
      .expect(200);
    expect(toggledResponse.body.data[0].completed).toBe(true);

    // Delete
    await request(app)
      .delete(`/api/todos/${todoId}`)
      .expect(200);

    // Verify deletion - wait a bit for deletion to process
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const finalResponse = await request(app)
      .get('/api/todos')
      .expect(200);
    expect(finalResponse.body.data).toHaveLength(0);
  });

  test('filter and sort workflow', async () => {
    // Create todos with different completion status and priorities
    await Todo.create({ title: 'High Priority Incomplete', priority: 'high', completed: false });
    await Todo.create({ title: 'Low Priority Complete', priority: 'low', completed: true });
    await Todo.create({ title: 'Medium Priority Incomplete', priority: 'medium', completed: false });

    // Get all todos
    const allResponse = await request(app)
      .get('/api/todos')
      .expect(200);
    expect(allResponse.body.data).toHaveLength(3);

    // Get only completed todos
    const completedResponse = await request(app)
      .get('/api/todos?completed=true')
      .expect(200);
    expect(completedResponse.body.data).toHaveLength(1);
    expect(completedResponse.body.data[0].title).toBe('Low Priority Complete');

    // Get only incomplete todos
    const incompleteResponse = await request(app)
      .get('/api/todos?completed=false')
      .expect(200);
    expect(incompleteResponse.body.data).toHaveLength(2);

    // Verify sorting (newest first)
    const todos = incompleteResponse.body.data;
    expect(new Date(todos[0].createdAt) >= new Date(todos[1].createdAt)).toBe(true);
  });
});