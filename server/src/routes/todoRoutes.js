// server/src/routes/todoRoutes.js

const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo.js');

// @desc    Get all todos
// @route   GET /api/todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.status(200).json({ success: true, data: todos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @desc    Create a todo
// @route   POST /api/todos
router.post('/', async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json({ success: true, data: todo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Add other routes (PUT, DELETE) here later if needed

module.exports = router;