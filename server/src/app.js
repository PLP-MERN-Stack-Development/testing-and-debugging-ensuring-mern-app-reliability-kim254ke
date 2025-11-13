// server/src/app.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const todoRoutes = require('./routes/todoRoutes');
const postsRoutes = require('./routes/postsRoutes'); // Require the new routes

app.use('/api/todos', todoRoutes);
app.use('/api/posts', postsRoutes); // Use the new routes

// A basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

module.exports = app;