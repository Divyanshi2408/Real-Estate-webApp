const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "owner", "user"], default: "user" },
    status: { type: String, enum: ["pending", "approved", "rejected", "suspended","delete"], default: "approved" },
    activityLogs: [{ action: String, timestamp: Date }],
    likedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }], 
    savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }] 
});

module.exports = mongoose.model("User", userSchema);
