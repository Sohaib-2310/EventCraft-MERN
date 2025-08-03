const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    availableDates: [{
        type: Date,
        required: true
    }],
    bookedDates: [{
        type: Date,
        required: true
    }],
    notes: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
availabilitySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Availability', availabilitySchema); 