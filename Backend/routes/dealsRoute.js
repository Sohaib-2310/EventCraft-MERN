const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');

// GET all deals
router.get('/', async (req, res) => {
    try {
        const deals = await Deal.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(deals);
    } catch (error) {
        console.error('Error fetching deals:', error);
        res.status(500).json({ message: 'Failed to fetch deals' });
    }
});

// GET single deal by ID
router.get('/:id', async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);
        if (!deal) {
            return res.status(404).json({ message: 'Deal not found' });
        }
        res.json(deal);
    } catch (error) {
        console.error('Error fetching deal:', error);
        res.status(500).json({ message: 'Failed to fetch deal' });
    }
});

// POST create new deal
router.post('/', async (req, res) => {
    try {
        const { name, price, services, description } = req.body;
        
        if (!name || !price || !services || !Array.isArray(services)) {
            return res.status(400).json({ message: 'Name, price, and services array are required' });
        }

        const newDeal = new Deal({
            name,
            price,
            services,
            description
        });

        const savedDeal = await newDeal.save();
        res.status(201).json(savedDeal);
    } catch (error) {
        console.error('Error creating deal:', error);
        res.status(500).json({ message: 'Failed to create deal' });
    }
});

// PUT update deal
router.put('/:id', async (req, res) => {
    try {
        const { name, price, services, description, isActive } = req.body;
        
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (price !== undefined) updateData.price = price;
        if (services !== undefined) updateData.services = services;
        if (description !== undefined) updateData.description = description;
        if (isActive !== undefined) updateData.isActive = isActive;

        const updatedDeal = await Deal.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedDeal) {
            return res.status(404).json({ message: 'Deal not found' });
        }

        res.json(updatedDeal);
    } catch (error) {
        console.error('Error updating deal:', error);
        res.status(500).json({ message: 'Failed to update deal' });
    }
});

// DELETE deal (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const deletedDeal = await Deal.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!deletedDeal) {
            return res.status(404).json({ message: 'Deal not found' });
        }

        res.json({ message: 'Deal deleted successfully' });
    } catch (error) {
        console.error('Error deleting deal:', error);
        res.status(500).json({ message: 'Failed to delete deal' });
    }
});

// PATCH update deal services
router.patch('/:id/services', async (req, res) => {
    try {
        const { services } = req.body;
        
        if (!services || !Array.isArray(services)) {
            return res.status(400).json({ message: 'Services array is required' });
        }

        const updatedDeal = await Deal.findByIdAndUpdate(
            req.params.id,
            { services },
            { new: true, runValidators: true }
        );

        if (!updatedDeal) {
            return res.status(404).json({ message: 'Deal not found' });
        }

        res.json(updatedDeal);
    } catch (error) {
        console.error('Error updating deal services:', error);
        res.status(500).json({ message: 'Failed to update deal services' });
    }
});

module.exports = router; 