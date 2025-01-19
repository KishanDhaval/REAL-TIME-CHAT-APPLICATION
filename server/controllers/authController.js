const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

const registerController = async (req, res) => {
  const { name, email, password } = req.body;
  const picPath = req.file ? req.file.path : null;

  try {
    // Create a new user
    const user = await User.register(name, email, password, picPath);

    // Generate a token for the new user
    const token = createToken(user._id);

    // Select the user excluding the password field and populate necessary fields
    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    // Send response with user info and token
    res.status(200).json({
      success: true,
      message: "Welcome",
      user: {
        ...userWithoutPassword.toObject(), // Convert Mongoose document to plain object
        token, // Append the token to the user object
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    // Select the user excluding the password field and add the token
    const userWithoutPassword = await User.findById(user._id).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Welcome back!!!",
      user: {
        ...userWithoutPassword.toObject(),
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  const { name, userName, about } = req.body;
  const userId = req.user._id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, userName, about },
      { new: true }
    )
      .select("-password")
      .populate("challengeSubmissions")
      .populate("componentSubmissions")
      .populate("winning"); // Exclude password from response

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const token = createToken(updatedUser._id);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        ...updatedUser.toObject(),
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

const updatePhoto = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded or invalid file type.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.photo = req.file.filename;
    await user.save();

    // Fetch user without password
    const userWithoutPassword = await User.findById(userId)
      .select("-password")
      .populate("challengeSubmissions")
      .populate("componentSubmissions")
      .populate("winning");
    const token = createToken(userWithoutPassword._id);

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user: {
        ...userWithoutPassword.toObject(),
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile picture",
      error: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword)
      .find({ _id: { $ne: req.user._id } })
      .select("-password");

    if (!users) {
      return res.status(404).json({
        success: false,
        message: "User not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Success",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve saved submissions",
      error: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  updateProfile,
  updatePhoto,
  getUsers,
};
