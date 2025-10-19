import mongoose from "mongoose";
const { Schema } = mongoose;

const todoSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, "User Id is required"],
      index: true,
    },
    task: {
      type: String,
      required: [true, "Task title cannot be empty"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Please specify a category"],
      enum: [
        "grocery",
        "daily activity",
        "event",
        "exercise",
        "holiday bucketlist",
        "luggage packing",
      ],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isCompleted: {
      type: Boolean,
      default: false, // default = not completed
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  },
);

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
