import Todo from "../models/todoModel.js";

const getTasks = async (req, res) => {
  try {
    // Corrected to use req.user.id
    const todos = await Todo.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(todos);
  } catch (error) {
    // Use 500 for server-side errors
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

const createTask = async (req, res) => {
  const { task, description, category } = req.body;

  if (!task || !category) {
    return res.status(400).json({ message: "Task and category are required" });
  }

  try {
    const newTodo = new Todo({
      userId: req.user.id, // Corrected: Use req.user.id from auth middleware
      task,
      description,
      category,
    });

    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      // Use 404 for "Not Found"
      return res.status(404).json({ message: "Task not found" });
    }

    // Corrected to use req.user.id for the ownership check
    if (todo.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // This ensures the updated document is returned
    });
    res.status(200).json(updatedTodo);
  } catch (error) {
    // Use 500 for server-side errors
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      // Use 404 for "Not Found"
      return res.status(404).json({ message: "Task not found" });
    }

    // Corrected to use req.user.id for the ownership check
    if (todo.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await todo.deleteOne();
    // Return the ID of the deleted task for easier state management on the frontend
    res.status(200).json({ id: req.params.id, message: "Task removed" });
  } catch (error) {
    // Use 500 for server-side errors
    res
      .status(500)
      .json({ message: "Error deleting the task", error: error.message });
  }
};
const toggleCompleteTask = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).json({ message: "Task not found" });
    if (todo.userId.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    // Toggle isCompleted
    todo.isCompleted = !todo.isCompleted;
    await todo.save();

    res.status(200).json({
      message: `Task marked as ${
        todo.isCompleted ? "completed" : "incomplete"
      }`,
      todo,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating completion status",
      error: error.message,
    });
  }
};

export { getTasks, createTask, updateTask, deleteTask, toggleCompleteTask };
