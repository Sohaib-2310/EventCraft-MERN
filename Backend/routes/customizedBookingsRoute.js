const express = require('express');
const router = express.Router();
const Booking = require('../models/customizedBookings');
const auth = require('../middleware/auth');

// GET /api/customized-bookings - Get all customized bookings (admin only)
router.get('/', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        
        const bookings = await Booking.find().sort({ submittedAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
    }
});

// GET /api/customized-bookings/user - Get user's customized bookings
router.get('/user', auth, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.userId }).sort({ submittedAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Fetch user bookings error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user bookings' });
    }
});

// POST /api/customized-bookings
router.post('/', auth, async (req, res) => {
    try {
        const bookingData = { ...req.body, userId: req.user.userId };
        const newBooking = new Booking(bookingData);
        await newBooking.save();
        res.status(201).json({ success: true, message: "Booking saved successfully" });
    } catch (error) {
        console.error("Booking save error:", error);
        res.status(500).json({ success: false, message: "Failed to save booking" });
    }
});

// PUT /api/customized-bookings/:id - Update booking status
router.put('/:id', async (req, res) => {
    try {
        const { status, adminNotes } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status, adminNotes },
            { new: true }
        );
        res.status(200).json(booking);
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ success: false, message: 'Failed to update booking' });
    }
});

// DELETE /api/customized-bookings/:id - Delete booking
router.delete('/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.status(200).json({ success: true, message: 'Booking deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete booking' });
    }
});

// router.post('/', async (req, res) => {
//   try {
//     const { name, email, phone, eventType, date, message } = req.body;
//     console.log("📅 New booking request:", req.body);

//     const newBooking = new Booking({ name, email, phone, eventType, date, message });
//     await newBooking.save();
//     console.log("✅ Booking saved to DB");

//     res.status(200).json({ success: true, message: 'Booking request submitted!' });
//   } catch (error) {
//     console.error('❌ Error saving booking:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });

module.exports = router;
