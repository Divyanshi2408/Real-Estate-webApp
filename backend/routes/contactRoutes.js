// NEW FILE — save as: utils/routes/contactRoutes.js
const express = require("express");
const ContactMessage = require("../models/ContactMessage");
const authorizeAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

// Public: submit the contact form (no login required — anonymous visitors use this)
router.post("/", async (req, res) => {
  const { name, email, phone, contactMethod, interest, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: "Name, email, phone, and message are required." });
  }

  try {
    const contactMessage = new ContactMessage({
      name,
      email,
      phone,
      contactMethod,
      interest,
      message,
    });

    await contactMessage.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: list all submissions (newest first) — hook this up to Dashboard.jsx later
router.get("/", authorizeAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: mark a submission as read / resolved
router.put("/:id", authorizeAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    const contactMessage = await ContactMessage.findById(req.params.id);
    if (!contactMessage) return res.status(404).json({ message: "Message not found" });

    contactMessage.status = status;
    await contactMessage.save();

    res.status(200).json({ message: `Message marked as ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;