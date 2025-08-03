const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const passwordRegex = /^(?=.*[A-Za-z]).{6,}$/; // At least 6 chars, 1 letter

// Register
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters long and include at least one letter.',
    });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);

    // Default role: user
    const user = new User({ name, email, password: hashed, role: 'user' });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Basic password validation (optional for login)
    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password format.',
      });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User does not exist' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password' });
    }

    // 4. Generate JWT token with role
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, token, role: user.role });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
