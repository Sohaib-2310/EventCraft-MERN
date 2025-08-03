const express = require('express');
const router = express.Router();
const Contact = require('../models/contactUs');

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

// router.post('/', async (req, res) => {
//     try {
//         const { name, email, phone, subject, message } = req.body;
//         console.log("📩 New form submission:", req.body);

//         const newContact = new Contact({ name, email, phone, subject, message });
//         await newContact.save();
//         console.log("✅ Contact saved to DB");

//         res.status(200).json({ success: true, message: 'Form submitted and saved!' });
//     } catch (error) {
//         console.error('❌ Error saving contact:', error);
//         res.status(500).json({ success: false, message: 'Server error' });
//     }
// });

module.exports = router;
