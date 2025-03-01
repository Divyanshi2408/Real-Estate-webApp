const express = require("express");
const User = require("../models/User");
const Property = require("../models/Property");
const authorizeAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/all", authorizeAdmin, async (req, res) => {
  try {
      const properties = await Property.find().populate("ownerId", "name email");
      res.status(200).json(properties);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// 🏡 Approve or Reject Property Listing
router.put("/properties/:id/approve", authorizeAdmin, async (req, res) => {
    try {
      const { status } = req.body; // "approved" or "rejected"
      const property = await Property.findById(req.params.id);
  
      if (!property) return res.status(404).json({ message: "Property not found" });
  
      property.approvalStatus = status;
      await property.save();
  
      res.status(200).json({ message: `Property ${status} successfully` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  router.put("/properties/:id", authorizeAdmin, async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
      if (!property) return res.status(404).json({ message: "Property not found" });
  
      Object.assign(property, req.body); // Update property details
      await property.save();
  
      res.status(200).json({ message: "Property updated successfully", property });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  router.delete("/properties/:id", authorizeAdmin, async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
      if (!property) return res.status(404).json({ message: "Property not found" });
  
      await property.deleteOne();
      res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  router.put("/properties/:id/feature", authorizeAdmin, async (req, res) => {
    try {
      const property = await Property.findById(req.params.id);
      if (!property) return res.status(404).json({ message: "Property not found" });
  
      property.featured = !property.featured;
      await property.save();
  
      res.status(200).json({ message: `Property ${property.featured ? "featured" : "unfeatured"} successfully` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
      

// 👥 View All Users
router.get("/users", authorizeAdmin, async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
router.put("/users/:id/approve", authorizeAdmin, async (req, res) => {
    try {
      const { status } = req.body; // "approved" or "rejected"
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.status = status;
      await user.save();
  
      res.status(200).json({ message: `User ${status} successfully` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  


router.put("/users/:id/ban", authorizeAdmin, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.status = "suspended";
      await user.save();
  
      res.status(200).json({ message: "User banned successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  router.put("/users/:id/unban", authorizeAdmin, async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      user.status = "approved";
      await user.save();
  
      res.status(200).json({ message: "User Unbanned successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get Dashboard Metrics
router.get("/dashboard/metrics", authorizeAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalActiveProperties = await Property.countDocuments({ approvalStatus: "approved" });
    const totalBlockedUsers = await User.countDocuments({ status: "suspended" });

    res.status(200).json({
      totalUsers,
      totalActiveProperties,
      totalBlockedUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

  

module.exports = router;
