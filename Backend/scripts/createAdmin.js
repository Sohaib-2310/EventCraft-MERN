require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const createAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Check if admin already exists
        const adminExists = await User.findOne({ email: ADMIN_EMAIL });
        if (adminExists) {
            console.log("⚠️ Admin already exists!");
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        // Create admin
        await User.create({
            name: "Admin User",
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin",
        });

        console.log("Admin created successfully!");
    } catch (error) {
        console.error("Error creating admin:", error);
    } finally {
        // Close connection
        mongoose.connection.close();
    }
};

createAdmin();