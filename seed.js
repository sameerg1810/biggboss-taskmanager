import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/userModel.js"; // Adjust the path if your models are elsewhere

// Load environment variables from .env file
dotenv.config();

const seedAdmin = async () => {
  // Check if the MongoDB URI is configured
  if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in your .env file.");
    process.exit(1); // Exit with a failure code
  }

  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding.");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "adminpassword";

    // Check if an admin user already exists
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log("Admin user already exists. No action taken.");
    } else {
      // If admin doesn't exist, create a new one
      const adminUser = new User({
        name: "Default Admin",
        email: adminEmail,
        password: adminPassword, // The 'pre-save' hook in your userModel will hash this
        role: "admin",
        isVerified: true, // Admins should always be pre-verified
      });

      // Save the new admin user to the database
      await adminUser.save();
      console.log("Admin user created successfully!");
    }
  } catch (error) {
    console.error("Error during admin seeding:", error.message);
    process.exit(1); // Exit with a failure code
  } finally {
    // Disconnect from the database, whether successful or not
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
};

// Execute the seed function
seedAdmin();
