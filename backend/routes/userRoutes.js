const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Register User
router.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        if (!name) {
            return res.status(400).json({ message: "Name is required." });
        }

        if (role === "admin") {
            return res.status(403).json({ message: "Cannot register as admin." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user" // Default role is "user" if not provided
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Prevent banned users from logging in
      if (user.status === "suspended") {
        return res.status(403).json({ message: "Your account has been banned." });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
  
      // Generate JWT token with role
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
  
      res.status(200).json({
        token,
        role: user.role,  
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  




module.exports = router;
