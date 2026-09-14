// NEW FILE — save as: utils/models/ContactMessage.js
const mongoose = require("mongoose");

const ContactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    contactMethod: { type: String, enum: ["email", "phone"], default: "email" },
    interest: { type: String, enum: ["buying", "selling", "renting"], default: "buying" },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "resolved"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactMessage", ContactMessageSchema);