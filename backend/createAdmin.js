const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");  


async function createAdmin() {
  try {
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("Admin already exists.");
      return;
    }


    const hashedPassword = await bcrypt.hash("admin@24", 10);

 
    const adminUser = new User({
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",  
    });

   
    await adminUser.save();
    console.log("Admin user created successfully!");

   
    mongoose.connection.close();
  } catch (error) {
    console.error("Error creating admin:", error);
    mongoose.connection.close();
  }
}

createAdmin();
