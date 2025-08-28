require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Deal = require("../models/Deal");

const MONGO_URI = process.env.MONGO_URI;

const defaultDeals = [
    {
        name: "Basic Package",
        price: 299900,
        services: [
            "Venue for up to 50 guests",
            "Basic catering (buffet)",
            "Simple decoration",
            "Sound system",
            "4-hour event duration",
            "Basic photography (2 hours)"
        ],
        description: "Perfect for small gatherings with essential services."
    },
    {
        name: "Standard Package",
        price: 499900,
        services: [
            "Venue for up to 100 guests",
            "Premium buffet & cocktails",
            "Enhanced decoration & lighting",
            "Professional sound & DJ",
            "6-hour event duration",
            "Photography & videography (4 hours)",
            "Guest management service"
        ],
        description: "Best for medium-sized events with premium features."
    },
    {
        name: "Premium Package",
        price: 799900,
        services: [
            "Venue for up to 200 guests",
            "Gourmet plated dinner",
            "Luxury decoration & florals",
            "Live band & entertainment",
            "8-hour event duration",
            "Full-day photography & videography",
            "Dedicated event coordinator",
            "Transportation service",
            "Security service"
        ],
        description: "Luxury package for large-scale events with all-inclusive services."
    }
];

const createDeals = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Delete all existing deals
        await Deal.deleteMany({});
        console.log("✅ Existing deals removed.");

        // Insert default deals
        await Deal.insertMany(defaultDeals);
        console.log("🎉 Default deals created successfully!");
    } catch (error) {
        console.error("❌ Error creating deals:", error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
    }
};

createDeals();
