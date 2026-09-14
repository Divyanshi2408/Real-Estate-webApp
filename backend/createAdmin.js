require("dotenv").config();

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");

    const existingAdmin = await User.findOne({
      email: "admin@gmail.com",
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists.");
      await mongoose.connection.close();
      return;
    }

    const hashedPassword = await bcrypt.hash("admin", 10);

    const adminUser = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error creating admin:", error);

    await mongoose.connection.close();
    process.exit(1);
  }
}

createAdmin();