const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');

// GET availability (returns the first/only availability record)
router.get('/', async (req, res) => {
    try {
        let availability = await Availability.findOne();
        
        if (!availability) {
            // Create default availability if none exists
            availability = new Availability({
                availableDates: [],
                bookedDates: []
            });
            await availability.save();
        }
        
        res.json(availability);
    } catch (error) {
        console.error('Error fetching availability:', error);
        res.status(500).json({ message: 'Failed to fetch availability' });
    }
});

// POST create/update availability
router.post('/', async (req, res) => {
    try {
        const { availableDates, bookedDates, notes } = req.body;
        
        let availability = await Availability.findOne();
        
        if (availability) {
            // Update existing availability
            availability.availableDates = availableDates || availability.availableDates;
            availability.bookedDates = bookedDates || availability.bookedDates;
            if (notes !== undefined) availability.notes = notes;
        } else {
            // Create new availability
            availability = new Availability({
                availableDates: availableDates || [],
                bookedDates: bookedDates || [],
                notes
            });
        }
        
        const savedAvailability = await availability.save();
        res.status(201).json(savedAvailability);
    } catch (error) {
        console.error('Error creating/updating availability:', error);
        res.status(500).json({ message: 'Failed to create/update availability' });
    }
});

// PUT update availability
router.put('/', async (req, res) => {
    try {
        const { availableDates, bookedDates, notes } = req.body;
        
        let availability = await Availability.findOne();
        
        if (!availability) {
            return res.status(404).json({ message: 'Availability not found' });
        }
        
        if (availableDates !== undefined) availability.availableDates = availableDates;
        if (bookedDates !== undefined) availability.bookedDates = bookedDates;
        if (notes !== undefined) availability.notes = notes;
        
        const updatedAvailability = await availability.save();
        res.json(updatedAvailability);
    } catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({ message: 'Failed to update availability' });
    }
});

// POST add available date
router.post('/available', async (req, res) => {
    try {
        const { date } = req.body;
        
        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }
        
        let availability = await Availability.findOne();
        
        if (!availability) {
            availability = new Availability({
                availableDates: [],
                bookedDates: []
            });
        }
        
        const dateObj = new Date(date);
        
        // Check if date is already in available dates
        if (availability.availableDates.some(d => d.getTime() === dateObj.getTime())) {
            return res.status(400).json({ message: 'Date is already in available dates' });
        }
        
        // Check if date is in booked dates
        if (availability.bookedDates.some(d => d.getTime() === dateObj.getTime())) {
            return res.status(400).json({ message: 'Date is already booked' });
        }
        
        availability.availableDates.push(dateObj);
        const savedAvailability = await availability.save();
        
        res.status(201).json(savedAvailability);
    } catch (error) {
        console.error('Error adding available date:', error);
        res.status(500).json({ message: 'Failed to add available date' });
    }
});

// POST add booked date
router.post('/booked', async (req, res) => {
    try {
        const { date } = req.body;
        
        if (!date) {
            return res.status(400).json({ message: 'Date is required' });
        }
        
        let availability = await Availability.findOne();
        
        if (!availability) {
            availability = new Availability({
                availableDates: [],
                bookedDates: []
            });
        }
        
        const dateObj = new Date(date);
        
        // Check if date is already in booked dates
        if (availability.bookedDates.some(d => d.getTime() === dateObj.getTime())) {
            return res.status(400).json({ message: 'Date is already in booked dates' });
        }
        
        // Check if date is in available dates
        if (availability.availableDates.some(d => d.getTime() === dateObj.getTime())) {
            return res.status(400).json({ message: 'Date is already available' });
        }
        
        availability.bookedDates.push(dateObj);
        const savedAvailability = await availability.save();
        
        res.status(201).json(savedAvailability);
    } catch (error) {
        console.error('Error adding booked date:', error);
        res.status(500).json({ message: 'Failed to add booked date' });
    }
});

// DELETE remove available date
router.delete('/available/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const dateObj = new Date(date);
        
        let availability = await Availability.findOne();
        
        if (!availability) {
            return res.status(404).json({ message: 'Availability not found' });
        }
        
        availability.availableDates = availability.availableDates.filter(
            d => d.getTime() !== dateObj.getTime()
        );
        
        const savedAvailability = await availability.save();
        res.json(savedAvailability);
    } catch (error) {
        console.error('Error removing available date:', error);
        res.status(500).json({ message: 'Failed to remove available date' });
    }
});

// DELETE remove booked date
router.delete('/booked/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const dateObj = new Date(date);
        
        let availability = await Availability.findOne();
        
        if (!availability) {
            return res.status(404).json({ message: 'Availability not found' });
        }
        
        availability.bookedDates = availability.bookedDates.filter(
            d => d.getTime() !== dateObj.getTime()
        );
        
        const savedAvailability = await availability.save();
        res.json(savedAvailability);
    } catch (error) {
        console.error('Error removing booked date:', error);
        res.status(500).json({ message: 'Failed to remove booked date' });
    }
});

// GET check if date is available
router.get('/check/:date', async (req, res) => {
    try {
        const { date } = req.params;
        const dateObj = new Date(date);
        
        let availability = await Availability.findOne();
        
        if (!availability) {
            return res.json({ available: true, message: 'No availability data found' });
        }
        
        const isBooked = availability.bookedDates.some(d => d.getTime() === dateObj.getTime());
        const isAvailable = availability.availableDates.some(d => d.getTime() === dateObj.getTime());
        
        res.json({
            available: !isBooked,
            isBooked,
            isAvailable,
            date: dateObj.toISOString().split('T')[0]
        });
    } catch (error) {
        console.error('Error checking date availability:', error);
        res.status(500).json({ message: 'Failed to check date availability' });
    }
});

module.exports = router; 