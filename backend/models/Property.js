const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    city: { type: String, required: true },
    locality: { type: String, required: true },
    type: { type: String, enum: ["land", "home", "villa", "apartment"], required: true },
    size: { type: Number, required: true },
    price: { type: Number, required: true },
    // contact: { type: Number, required: true },
    photos: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    amenities: { type: [String], default: [] },
    approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    featured: { type: Boolean, default: false },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);
