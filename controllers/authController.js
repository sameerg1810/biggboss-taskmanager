import User from "../models/userModel.js";
import redisClient from "../config/redisClient.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified, // <-- ADD THIS LINE
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// In controllers/authController.js

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      // --- NEW: Set HttpOnly Cookie ---
      res.cookie("token", token, {
        httpOnly: true, // Makes the cookie inaccessible to JavaScript
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
        sameSite: "strict", // Helps prevent CSRF attacks
        maxAge: 60 * 60 * 1000, // 1 hour expiration
      });

      // Send user data WITHOUT the token
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  const cacheKey = `user:${req.user.id}`;

  try {
    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {
      console.log("Serving user profile from cache");
      return res.status(200).json(JSON.parse(cachedUser));
    }

    console.log("Serving user profile from DB");
    const user = req.user;

    await redisClient.set(cacheKey, JSON.stringify(user), { EX: 600 });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
// In controllers/authController.js

const logoutUser = (req, res) => {
  // To log out, we clear the cookie that contains the token
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // Set the cookie to expire in the past
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const getMe = async (req, res) => {
  res.status(200).json(req.user);
};
export { registerUser, loginUser, getUserProfile, getMe, logoutUser };
