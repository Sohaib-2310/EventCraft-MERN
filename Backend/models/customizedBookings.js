const mongoose = require('mongoose');

const customizedBookingsSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    eventType: String,
    specialRequests: String,
    eventDate: String,
    guestCount: Number,
    budget: String,
    hasNegotiated: Boolean,
    selectedServices: mongoose.Schema.Types.Mixed,
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    adminNotes: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('customizedBookings', customizedBookingsSchema);