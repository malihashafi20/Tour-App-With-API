// backend/routes/updateUser.js
import express from 'express';
import mongoose from 'mongoose';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Update user fields: name, email, phone
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters' });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: { name: name.trim(), email: email?.trim(), phone } },
      { new: true, projection: { passwordHash: 0 }, runValidators: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: updated });
  } catch (e) {
    console.error('Update error:', e);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
