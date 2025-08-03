const mongoose = require("mongoose");

const serviceCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    options: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            perPerson: { type: Boolean, default: false },
            margin: { type: Number, default: 0 }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("serviceCategory", serviceCategorySchema);