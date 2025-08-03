const mongoose = require('mongoose');

const packageBookingsSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  eventType: String,
  eventDate: String,
  guestCount: Number,
  specialRequests: String,
  packageName: String,
  packagePrice: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNotes: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PackageBookings', packageBookingsSchema);
