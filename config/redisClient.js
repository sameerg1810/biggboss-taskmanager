import { createClient } from "redis";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Check if the REDIS_URL is present
if (!process.env.REDIS_URL) {
  throw new Error("FATAL ERROR: REDIS_URL is not defined in the .env file.");
}

// 1. Create the client using the single URL
// The client library automatically handles TLS for 'rediss://' URLs
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

// 2. Add an error listener for runtime errors
redisClient.on("error", (err) => {
  console.error("Redis Client Runtime Error:", err);
});

// 3. Create an async function to connect and handle initial errors
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Successfully connected to Redis Cloud!");
  } catch (error) {
    console.error("Could not establish a connection with Redis:", error);
  }
};

// Immediately initiate the connection
connectRedis();

// 4. Export the client for use in other parts of your application
export default redisClient;
