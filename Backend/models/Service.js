const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    icon: { type: String, required: true }, // Example: "Building"
    title: { type: String, required: true },
    description: { type: String, required: true },
    features: [{ type: String, required: true }]
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
