// src/routes/posts.js
import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
  console.log('Posts route - Request body:', req.body); // Debug log
  
  try {
    // Check if req.body exists
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Request body is empty' });
    }
    
    const { title, content } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    res.status(201).json({ _id: 'mockid', title, content });
  } catch (error) {
    console.error('Posts route error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;