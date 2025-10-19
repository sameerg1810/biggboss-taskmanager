import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleCompleteTask,
} from "../controllers/todoController.js";

// Import the necessary middleware functions
import { protect, isVerified } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply the middleware chain to all routes in this file.
// A request must pass 'protect' first, and then it must pass 'isVerified'.
router.use(protect, isVerified);

// --- All routes below this line are now protected by BOTH authentication and verification ---

router.route("/").get(getTasks).post(createTask);

router.route("/:id").put(updateTask).delete(deleteTask);
router.patch("/:id/complete", protect, toggleCompleteTask); // new route

export default router;
