import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

// ✅ import validation utilities
import sanitizeInput from '../utils/sanitizeInput.js';
import regEmailTest from '../utils/regEmailTest.js';
import isAlphabetOnly from '../utils/isAlphabetOnly.js';
import charLength from '../utils/charLength.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    let { name, email, password, phone } = req.body;

    // sanitize inputs
    name = sanitizeInput(name);
    email = sanitizeInput(email);
    phone = sanitizeInput(phone);

    // validate
    if (!isAlphabetOnly(name)) return res.status(400).json({ message: 'Invalid name' });
    if (!regEmailTest(email)) return res.status(400).json({ message: 'Invalid email' });
    if (!charLength(password, 6, 100)) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ name, email, passwordHash, phone });

    return res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    console.error('Registration failed:', err);
    return res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    email = sanitizeInput(email);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Incorrect email or password' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: 'Incorrect email or password' });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    const dashboardData = {
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      joined: user.createdAt,
      bookings: user.bookings || [],
      budget: user.budget || null,
      route: user.route || null,
    };

    return res.status(200).json({ token, data: dashboardData });
  } catch (err) {
    console.error('Login failed:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const dashboardData = {
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      joined: user.createdAt,
      bookings: user.bookings || [],
      budget: user.budget || null,
      route: user.route || null,
    };

    res.json({ data: dashboardData });
  } catch (err) {
    console.error('Dashboard fetch failed:', err);
    res.status(500).json({ message: 'Server error while loading dashboard' });
  }
});

export default router;
