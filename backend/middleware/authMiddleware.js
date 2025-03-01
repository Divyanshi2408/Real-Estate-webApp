const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateToken = async (req, res, next) => {  // Make function async
  const token = req.header("Authorization")?.split(" ")[1]; // Extract the token after "Bearer"

  if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    req.user = decoded;

    const user = await User.findById(req.user.id); // Await the database query
    if (!user || user.status === "suspended") {
      return res.status(403).json({ message: "Access denied. Your account is banned." });
    }

    next(); // Move to the next middleware
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authenticateToken;
