// tests/postsRoutes.test.js
import request from 'supertest';
import app from '../src/server.js';

describe('Posts Routes', () => {
  test('should create a post', async () => {
    const postData = {
      title: 'Test Post',
      content: 'Test content'
    };

    const response = await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(201);

    expect(response.body._id).toBe('mockid');
    expect(response.body.title).toBe(postData.title);
    expect(response.body.content).toBe(postData.content);
  });

  test('should return 400 when title is missing', async () => {
    const postData = {
      content: 'Test content'
    };

    const response = await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(400);

    expect(response.body.error).toBe('Title is required');
  });

  test('should return 400 when content is missing', async () => {
    const postData = {
      title: 'Test Post'
    };

    const response = await request(app)
      .post('/api/posts')
      .send(postData)
      .expect(400);

    expect(response.body.error).toBe('Content is required');
  });

  test('should return 400 when body is empty', async () => {
    const response = await request(app)
      .post('/api/posts')
      .send({})
      .expect(400);

    expect(response.body.error).toBe('Request body is empty');
  });
});