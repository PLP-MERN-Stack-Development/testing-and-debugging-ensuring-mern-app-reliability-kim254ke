import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// Mock posts route for testing
app.post('/api/posts', (req, res) => {
  res.status(201).json({ _id: 'mockid', ...req.body });
});

export default app;
