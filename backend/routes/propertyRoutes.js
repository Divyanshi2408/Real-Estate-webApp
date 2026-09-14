const express = require("express");
const Property = require("../models/Property");
const User = require("../models/User");
const authenticateToken = require("../middleware/authMiddleware");
const upload = require("../config/upload");
const cloudinary = require("../config/cloudinary");
const { uploadFilesToCloudinary } = require("../config/uploadToCloudinary");
const geocodeAddress = require("../utils/geocode");

const router = express.Router();

// Best-effort cleanup of Cloudinary assets — never let a cleanup failure block the main request
const deleteCloudinaryPhotos = async (publicIds = []) => {
  await Promise.allSettled(
    publicIds.filter(Boolean).map((id) => cloudinary.uploader.destroy(id))
  );
};

// Add Property (POST)
router.post("/", authenticateToken, upload.array("photos", 5), async (req, res) => {
  const { title, description, city, locality, type, size, price, amenities } = req.body;

  try {
    const files = req.files || [];
    const uploaded = await uploadFilesToCloudinary(files);
    const photos = uploaded.map((result) => result.secure_url);
    const photoPublicIds = uploaded.map((result) => result.public_id);

    // Best-effort: pin the property on the map from its city/locality.
    // If this fails or nothing matches, the property still saves fine — it just won't have a map marker.
    const coords = await geocodeAddress(locality, city);

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
      photoPublicIds,
      amenities,
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
    });

    await newProperty.save();
    res.status(201).json({ message: "Property added successfully", newProperty });
  } catch (error) {
    console.error("Error adding property:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get All Properties (GET - Public), with optional search/filter query params
router.get("/", async (req, res) => {
  try {
    const { city, type, minPrice, maxPrice, q } = req.query;
    const filter = { approvalStatus: "approved" };

    if (city) filter.city = new RegExp(`^${city}$`, "i");
    if (type) filter.type = new RegExp(`^${type}$`, "i");
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (q) {
      filter.$or = [
        { title: new RegExp(q, "i") },
        { city: new RegExp(q, "i") },
        { locality: new RegExp(q, "i") },
      ];
    }

    const properties = await Property.find(filter).sort({ createdAt: -1 }).populate("ownerId", "name email");
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Property by ID (GET - Public)
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("ownerId", "name email");
    if (!property) return res.status(404).json({ message: "Property not found" });

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Property (PUT - Protected)
router.put("/:id", authenticateToken, upload.array("photos", 5), async (req, res) => {
  const { title, description, city, locality, type, size, price, amenities } = req.body;

  try {
    const property = await Property.findById(req.params.id);

    if (!property) return res.status(404).json({ message: "Property not found" });
    if (property.ownerId.toString() !== req.user.id)
      return res.status(403).json({ message: "You are not authorized to update this property" });

    const files = req.files || [];
    let oldPublicIdsToDelete = [];

    if (files.length > 0) {
      // New photos were uploaded — swap them in and queue the old Cloudinary assets for deletion
      const uploaded = await uploadFilesToCloudinary(files);
      oldPublicIdsToDelete = property.photoPublicIds;
      property.photos = uploaded.map((result) => result.secure_url);
      property.photoPublicIds = uploaded.map((result) => result.public_id);
    }

    property.title = title || property.title;
    property.description = description || property.description;

    const locationChanged =
      (city && city !== property.city) || (locality && locality !== property.locality);

    property.city = city || property.city;
    property.locality = locality || property.locality;
    property.type = type || property.type;
    property.size = size || property.size;
    property.price = price || property.price;
    property.amenities = amenities || property.amenities;

    if (locationChanged) {
      const coords = await geocodeAddress(property.locality, property.city);
      property.latitude = coords?.latitude ?? property.latitude;
      property.longitude = coords?.longitude ?? property.longitude;
    }

    await property.save();

    if (oldPublicIdsToDelete.length > 0) {
      deleteCloudinaryPhotos(oldPublicIdsToDelete);
    }

    res.status(200).json({ message: "Property updated successfully", property });
  } catch (error) {
    console.error("Error updating property:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Delete Property (DELETE - Protected)
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) return res.status(404).json({ message: "Property not found" });
    if (property.ownerId.toString() !== req.user.id)
      return res.status(403).json({ message: "You are not authorized to delete this property" });

    await property.deleteOne();
    deleteCloudinaryPhotos(property.photoPublicIds);

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error.message);
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

// Save Property (POST)
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

// Get Liked Properties (GET)
router.get("/liked", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("likedProperties");
    res.status(200).json(user.likedProperties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Saved Properties (GET)
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
    const ownerId = req.user.id;
    const properties = await Property.find({ ownerId }).populate("ownerId", "name email");

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;