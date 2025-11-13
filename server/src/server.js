// src/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Make sure this is properly configured

// MongoDB Todo Schema & Model
const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters"]
    },
    description: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    completed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

// Routes

// Test route
app.get("/", (req, res) => {
  res.json({ message: "MERN Testing API" });
});

// Get todos (with optional filter)
app.get("/api/todos", async (req, res) => {
  try {
    const { completed } = req.query;
    let filter = {};
    if (completed === "true") filter.completed = true;
    if (completed === "false") filter.completed = false;

    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: todos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add a new todo
app.post("/api/todos", async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json({ success: true, data: todo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update a todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!todo) return res.status(404).json({ success: false, message: "Todo not found" });
    res.json({ success: true, data: todo });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// --- ROUTE ORDER FIX ---
// Delete all todos route is placed BEFORE the delete by id route.
app.delete("/api/todos/all", async (req, res) => {
  try {
    await Todo.deleteMany({});
    res.json({ success: true, message: "All todos deleted" });
  } catch (err) {
    console.error("❌ ERROR in DELETE /api/todos/all:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete a todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ success: false, message: "Todo not found" });
    res.json({ success: true, message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle todo completion
app.patch("/api/todos/:id/toggle", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ success: false, message: "Todo not found" });

    todo.completed = !todo.completed;
    await todo.save();

    res.json({ success: true, data: todo });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Import posts routes
import postsRouter from './routes/posts.js';

// Use posts routes
app.use('/api/posts', postsRouter);

// Connect to MongoDB
/* istanbul ignore next */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Only start server if not in test environment
/* istanbul ignore next */
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

export default app; // for testing