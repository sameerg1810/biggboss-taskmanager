import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// In middleware/authMiddleware.js

const protect = async (req, res, next) => {
  let token;

  // Read the JWT from the cookie
  if (req.cookies.token) {
    try {
      token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    // This middleware should run AFTER the `protect` middleware
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Check if the user's role is included in the list of allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: User with role '${req.user.role}' cannot access this route.`,
      });
    }

    // If the role is authorized, proceed
    next();
  };
};

const isVerified = (req, res, next) => {
  // This middleware must run AFTER 'protect'
  if (req.user && req.user.isVerified) {
    // If the user object exists and isVerified is true, proceed
    next();
  } else {
    // Otherwise, block the request with a 403 Forbidden error
    res.status(403).json({
      message:
        "Forbidden: Your account has not been verified by an administrator.",
    });
  }
};
export { protect, authorize, isVerified };
