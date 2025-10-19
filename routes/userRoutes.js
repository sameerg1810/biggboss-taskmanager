import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  getMe,
  logoutUser,
} from "../controllers/authController.js";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  verifyUser,
} from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/", protect, authorize("admin"), getAllUsers);
router.delete("/:id", protect, authorize("admin"), deleteUser);
router.put("/:id/role", protect, authorize("admin"), updateUserRole);
router.put("/:id/verify", protect, authorize("admin"), verifyUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);

export default router;
