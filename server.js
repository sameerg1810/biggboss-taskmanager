import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import todoRoutes from "./routes/todoRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/todos", todoRoutes);
app.use("/api/user", userRoutes);
const filePath = path.join(import.meta.dirname, "public");
// Serve login page
app.get("/login", (req, res) => {
  res.sendFile(path.join(filePath, "login.html"));
});
app.use(express.static(filePath));

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`the server connected tpo database${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection err", err.message);
    process.exit(1);
  }
};

connectDB();
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
