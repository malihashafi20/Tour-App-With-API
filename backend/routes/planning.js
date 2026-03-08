import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Save budget
router.post('/budget', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { budget: req.body } },
      { new: true, projection: { passwordHash: 0 } }
    );
    res.json({ success: true, budget: user.budget });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to save budget' });
  }
});

// Save route
router.post('/route', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { route: req.body } },
      { new: true, projection: { passwordHash: 0 } }
    );
    res.json({ success: true, route: user.route });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to save route' });
  }
});

// Add booking (trip/service)
router.post('/bookings', auth, async (req, res) => {
  try {
    const { type, refId, title } = req.body;
    if (!type || !refId) {
      return res.status(400).json({ success: false, message: 'Missing type or refId' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $push: { bookings: { type, refId, title, ts: new Date() } } },
      { new: true, projection: { passwordHash: 0 } }
    );
    res.json({ success: true, bookings: user.bookings });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to add booking' });
  }
});

// Update last known location (from GPSStatus)
router.post('/location', auth, async (req, res) => {
  try {
    const { lat, lng, accuracy } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { lastKnownLocation: { lat, lng, accuracy } } },
      { new: true, projection: { passwordHash: 0 } }
    );
    res.json({ success: true, lastKnownLocation: user.lastKnownLocation });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update location' });
  }
});

// Enhanced dashboard
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId, { passwordHash: 0 });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      data: {
        name: user.name,
        email: user.email,
        joined: user.createdAt,
        budget: user.budget || null,
        route: user.route || null,
        bookings: user.bookings || [],
        lastKnownLocation: user.lastKnownLocation || null,
      },
    });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
