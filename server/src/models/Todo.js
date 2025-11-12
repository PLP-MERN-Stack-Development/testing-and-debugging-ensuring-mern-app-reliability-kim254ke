// src/models/Todo.js
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters"],
      trim: true  // Ensure the title is trimmed
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

// Instance method
todoSchema.methods.toggleComplete = async function () {
  this.completed = !this.completed;
  await this.save();
};

// Static methods
todoSchema.statics.findByPriority = function (priority) {
  return this.find({ priority });
};
todoSchema.statics.findIncomplete = function () {
  return this.find({ completed: false });
};

// Prevent model overwriting in tests
export default mongoose.models.Todo || mongoose.model("Todo", todoSchema);