const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Property = require("../models/Property");
const User = require("../models/User");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// ✅ Debugging Logs - To Check Authentication & Request Data
const logRequestData = (req) => {
    console.log("🔹 Incoming Request:", req.method, req.url);
    console.log("🔹 User Data:", req.user);
    console.log("🔹 Body:", req.body);
    console.log("🔹 Files:", req.files);
};

// 🏡 Add Property (POST)
router.post("/", authenticateToken, upload.array("photos", 5), async (req, res) => {
    logRequestData(req); // Debugging

    const { title, description, city, locality, type, size, price, amenities } = req.body;
    const photos = req.files.map(file => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);


    try {
        const newProperty = new Property({
            ownerId: req.user.id,
            title,
            description,
            city,
            locality,
            type,
            size,
            price,
            photos,
            amenities,
        });

        await newProperty.save();
        res.status(201).json({ message: "Property added successfully", newProperty });
    } catch (error) {
        console.error("🔴 Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// 📌 Get All Properties (GET - Public)
router.get("/", async (req, res) => {
    try {
        const properties = await Property.find({ approvalStatus: "approved" }).populate("ownerId", "name email");
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// 📌 Get Property by ID (GET - Public)
router.get("/:id", async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate("ownerId", "name email");
        if (!property) return res.status(404).json({ message: "Property not found" });

        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 🛠 Update Property (PUT - Protected)
router.put("/:id", authenticateToken, upload.array("photos", 5), async (req, res) => {
    logRequestData(req); // Debugging

    const { title, description, city, locality, type, size, price, amenities } = req.body;
    const photos = req.files.map(file => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);


    try {
        const property = await Property.findById(req.params.id);

        if (!property) return res.status(404).json({ message: "Property not found" });
        if (property.ownerId.toString() !== req.user.id)
            return res.status(403).json({ message: "You are not authorized to update this property" });

        // Update property fields
        property.title = title || property.title;
        property.description = description || property.description;
        property.city = city || property.city;
        property.locality = locality || property.locality;
        property.type = type || property.type;
        property.size = size || property.size;
        property.price = price || property.price;
        property.photos = photos.length > 0 ? photos : property.photos;
        property.amenities = amenities || property.amenities;

        await property.save();
        res.status(200).json({ message: "Property updated successfully", property });
    } catch (error) {
        console.error("🔴 Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// 🗑 Delete Property (DELETE - Protected)
router.delete("/:id", authenticateToken, async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) return res.status(404).json({ message: "Property not found" });
        if (property.ownerId.toString() !== req.user.id)
            return res.status(403).json({ message: "You are not authorized to delete this property" });

        await property.deleteOne();
        res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
        console.error("🔴 Error:", error);
        res.status(500).json({ message: error.message });
    }
});
router.post("/like/:id", authenticateToken, async (req, res) => {
    const propertyId = req.params.id;
    const userId = req.user.id;

    try {
        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: "Property not found" });

        const user = await User.findById(userId);
        const index = user.likedProperties.indexOf(propertyId);

        if (index !== -1) {
            user.likedProperties.splice(index, 1);
            property.likes -= 1;
            await user.save();
            await property.save();
            return res.status(200).json({ message: "Property unliked successfully", likes: property.likes });
        }

        user.likedProperties.push(propertyId);
        property.likes += 1;
        await user.save();
        await property.save();

        res.status(200).json({ message: "Property liked successfully", likes: property.likes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Save Property (POST)
router.post("/save/:id", authenticateToken, async (req, res) => {
    const propertyId = req.params.id;
    const userId = req.user.id;

    try {
        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ message: "Property not found" });

        const user = await User.findById(userId);
        const index = user.savedProperties.indexOf(propertyId);

        if (index !== -1) {
            user.savedProperties.splice(index, 1);
            await user.save();
            return res.status(200).json({ message: "Property unsaved successfully" });
        }

        user.savedProperties.push(propertyId);
        await user.save();

        res.status(200).json({ message: "Property saved successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Get Liked Properties (GET)
router.get("/liked", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("likedProperties");
        res.status(200).json(user.likedProperties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Get Saved Properties (GET)
router.get("/saved", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("savedProperties");
        res.status(200).json(user.savedProperties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get("/userDashboard/liked", authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate("likedProperties");
      res.status(200).json(user.likedProperties);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Get all saved properties for the user
router.get("/userDashboard/saved", authenticateToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate("savedProperties");
      res.status(200).json(user.savedProperties);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  router.get("/owner/dashboard", authenticateToken, async (req, res) => {
    try {
        const ownerId = req.user.id; // Get the logged-in user's ID
        const properties = await Property.find({ ownerId }).populate("ownerId", "name email");

        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
