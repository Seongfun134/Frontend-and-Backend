const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register new user
const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({ email: normalizedEmail, password });
    await user.save();

    console.log("[register] saved user:", normalizedEmail);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    console.log("[login] attempting:", normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      console.log("[login] no user found for:", normalizedEmail);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("[login] user found, checking password...");
    const isValidPassword = await user.comparePassword(password);
    console.log("[login] password valid:", isValidPassword);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" },
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset password directly (no email link)
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log("[resetPassword] looking up:", normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail });
    console.log("[resetPassword] user found:", !!user);

    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, resetPassword };
