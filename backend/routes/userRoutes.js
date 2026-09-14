const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// No insecure fallback here — if JWT_SECRET isn't set, the app should fail loudly,
// not silently sign tokens with a public, guessable string.
const JWT_SECRET = process.env.JWT_SECRET;

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
};

// Register User
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("email").isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
  ],
  validate,
  async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
      if (role === "admin") {
        return res.status(403).json({ message: "Cannot register as admin." });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: role === "owner" ? "owner" : "user", // Only allow user/owner self-registration
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      console.error("Register error:", error.message);
      res.status(500).json({ message: "Server error." });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  validate,
  async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.status === "suspended") {
        return res.status(403).json({ message: "Your account has been banned." });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

      res.status(200).json({
        token,
        role: user.role,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
