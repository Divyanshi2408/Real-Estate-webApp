const authenticateToken = require("./authMiddleware");

const authorizeAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  });
};

module.exports = authorizeAdmin;