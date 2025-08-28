require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const Service = require("../models/Service");

const MONGO_URI = process.env.MONGO_URI;

const defaultServices = [
    {
        icon: "Building",
        title: "Venue Management",
        description: "Premium venues for every occasion",
        features: ["Indoor & Outdoor", "Capacity Planning", "Setup Design"]
    },
    {
        icon: "Utensils",
        title: "Catering Services",
        description: "Exquisite culinary experiences",
        features: ["Multi-Cuisine", "Dietary Options", "Professional Service"]
    },
    {
        icon: "Palette",
        title: "Decoration & Theming",
        description: "Transform spaces into magical settings",
        features: ["Custom Themes", "Floral Arrangements", "Lighting Design"]
    },
    {
        icon: "Volume2",
        title: "Audio/Visual Support",
        description: "Crystal clear sound and stunning visuals",
        features: ["Sound Systems", "LED Screens", "Live Streaming"]
    },
    {
        icon: "Music",
        title: "Entertainment",
        description: "Memorable performances and activities",
        features: ["Live Music", "DJ Services", "Special Acts"]
    },
    {
        icon: "Users",
        title: "Guest Management",
        description: "Seamless guest experience management",
        features: ["Registration", "Coordination", "VIP Services"]
    },
    {
        icon: "Truck",
        title: "Transportation",
        description: "Convenient travel arrangements",
        features: ["Shuttle Service", "Luxury Cars", "Group Transport"]
    },
    {
        icon: "Camera",
        title: "Photography/Videography",
        description: "Capture every precious moment",
        features: ["Professional Photos", "Video Coverage", "Live Streaming"]
    },
    {
        icon: "Shield",
        title: "Security Services",
        description: "Safe and secure event environment",
        features: ["Crowd Control", "VIP Protection", "Emergency Response"]
    },
    {
        icon: "Megaphone",
        title: "Event Marketing",
        description: "Promote your event effectively",
        features: ["Digital Marketing", "Social Media", "Print Materials"]
    }
];

const createServices = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Delete all existing services
        await Service.deleteMany({});
        console.log("✅ Existing services removed.");

        // Insert default services
        await Service.insertMany(defaultServices);
        console.log("🎉 Default services created successfully!");
    } catch (error) {
        console.error("❌ Error creating services:", error);
    } finally {
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
    }
};

createServices();
