// server/tests/postsRoutes.test.js

const request = require('supertest');
const app = require('../src/app.js');

describe('Posts Routes', () => {
  test('should create a post with valid data', async () => {
    const postData = { title: 'Test Post', content: 'This is test content.' };

    const response = await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(201);

    // Expect the response structure our new route provides
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe(postData.title);
    expect(response.body.data.content).toBe(postData.content);
  });

  test('should return 400 when title is missing', async () => {
    const postData = { content: 'This is test content.' };

    const response = await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Title and content are required');
  });

  test('should return 400 when content is missing', async () => {
    const postData = { title: 'Test Post' };

    const response = await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Title and content are required');
  });

  test('should return 400 when body is empty', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send({})
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Title and content are required');
  });
});