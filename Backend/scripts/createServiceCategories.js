require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const ServiceCategory = require("../models/serviceCategory");

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

const defaultCategories = [
    {
        name: "Venue Management",
        options: [
            { name: "Banquet Hall", price: 150000, margin: 5000 },
            { name: "Garden Venue", price: 100000, margin: 3000 },
            { name: "Conference Room", price: 80000, margin: 0 },
            { name: "Outdoor Pavilion", price: 120000, margin: 4000 },
        ],
    },
    {
        name: "Catering Services",
        options: [
            { name: "Premium Buffet", price: 1500, margin: 200, perPerson: true },
            { name: "Plated Dinner", price: 2500, margin: 300, perPerson: true },
            { name: "Cocktail Service", price: 1000, margin: 0, perPerson: true },
            { name: "BBQ Package", price: 1200, margin: 150, perPerson: true },
        ],
    },
    {
        name: "Decoration & Theming",
        options: [
            { name: "Elegant Florals", price: 60000, margin: 2000 },
            { name: "LED Lighting", price: 45000, margin: 1500 },
            { name: "Backdrop Design", price: 30000, margin: 0 },
            { name: "Table Centerpieces", price: 25000, margin: 1000 },
        ],
    },
    {
        name: "Audio/Visual Support",
        options: [
            { name: "Sound System", price: 35000, margin: 1500 },
            { name: "LED Screen", price: 60000, margin: 2500 },
            { name: "Microphones", price: 10000, margin: 0 },
            { name: "Live Streaming", price: 45000, margin: 2000 },
        ],
    },
    {
        name: "Entertainment",
        options: [
            { name: "Live Band", price: 80000, margin: 3000 },
            { name: "DJ Service", price: 40000, margin: 1500 },
            { name: "Stand-up Comedy", price: 50000, margin: 2000 },
            { name: "Magic Show", price: 30000, margin: 0 },
        ],
    },
];

const createServiceCategories = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Remove old categories
        await ServiceCategory.deleteMany({});
        console.log("✅ Existing service categories removed.");

        // Insert defaults
        await ServiceCategory.insertMany(defaultCategories);
        console.log("🎉 Default service categories created successfully!");
    } catch (error) {
        console.error("❌ Error creating service categories:", error);
    } finally {
        mongoose.connection.close();
        console.log("MongoDB connection closed.");
    }
};

createServiceCategories();