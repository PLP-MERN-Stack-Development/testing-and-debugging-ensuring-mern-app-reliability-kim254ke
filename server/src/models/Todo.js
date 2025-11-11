import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    completed: { type: Boolean, default: false },
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

export default mongoose.model("Todo", todoSchema);
