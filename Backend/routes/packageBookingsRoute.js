const express = require('express');
const router = express.Router();
const PackageBooking = require('../models/packageBookings');
const auth = require('../middleware/auth');

// GET /api/package-bookings - Get all package bookings (admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    const bookings = await PackageBooking.find().sort({ submittedAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
});

// GET /api/package-bookings/user - Get user's package bookings
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await PackageBooking.find({ userId: req.user.userId }).sort({ submittedAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Fetch user bookings error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user bookings' });
  }
});

// POST /api/package-bookings
router.post('/', auth, async (req, res) => {
  try {
    const bookingData = { ...req.body, userId: req.user.userId };
    const booking = new PackageBooking(bookingData);
    await booking.save();
    res.status(201).json({ success: true, message: 'Package booking saved successfully' });
  } catch (err) {
    console.error('Save error:', err);
    res.status(500).json({ success: false, message: 'Failed to save booking' });
  }
});

// PUT /api/package-bookings/:id - Update booking status
router.put('/:id', async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const booking = await PackageBooking.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );
    res.status(200).json(booking);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update booking' });
  }
});

// DELETE /api/package-bookings/:id - Delete booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await PackageBooking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete booking' });
  }
});

module.exports = router;