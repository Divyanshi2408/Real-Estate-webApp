const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Make sure it's optional
    message: { type: String, required: true },
    isReply: { type: Boolean, default: false },
    parentMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
