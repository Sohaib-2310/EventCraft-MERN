const express = require('express');
const router = express.Router();
const Contact = require('../models/contactUs');
const auth = require('../middleware/auth');

// POST /api/contact
router.post('/', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();
        res.status(201).json({ success: true, message: "Contact saved successfully" });
    } catch (error) {
        console.error("Contact save error:", error);
        res.status(500).json({ success: false, message: "Failed to save contact" });
    }
});

// GET /api/contact - Get all contact form submissions (Admin only)
router.get('/', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access denied. Admin only." });
        }

        const contacts = await Contact.find().sort({ submittedAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({ success: false, message: "Failed to fetch contacts" });
    }
});

// DELETE /api/contact/:id - Delete a contact form submission (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Access denied. Admin only." });
        }

        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: "Contact not found" });
        }

        res.status(200).json({ success: true, message: "Contact deleted successfully" });
    } catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({ success: false, message: "Failed to delete contact" });
    }
});

module.exports = router;
