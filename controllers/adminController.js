import User from "../models/userModel.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.param.id);
    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete an admin user" });
    }

    await user.deleteOne();
    res.status(200).json({ message: "user removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  const { role } = req.body;
  const validRoles = ["user", "editor", "admin"];
  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ message: "invalid role specified" });
  }
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.role = role;
      await user.save();
      res.status(200).json({ message: `User role updated to${role}` });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * @desc    Mark a user as verified
 * @route   PUT /api/users/:id/verify
 * @access  Private/Admin
 */
const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set isVerified to true and save the document
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: `User ${user.name} has been verified.` });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export { getAllUsers, deleteUser, updateUserRole, verifyUser };
