// backend/routes/deleteUser.js
import express from 'express';
import mongoose from 'mongoose';
import auth from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Delete a single user by id
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    const existing = await User.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'No user found for this ID' });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    return res.json({
      success: true,
      deletedData: { _id: deletedUser._id, name: deletedUser.name, email: deletedUser.email },
    });
  } catch {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Optional: Delete multiple users by email
router.delete('/by-email/:email', auth, async (req, res) => {
  try {
    const { email } = req.params;
    const users = await User.find({ email });
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'No users found for this email' });
    }
    const ids = users.map((u) => u._id);
    await User.deleteMany({ _id: { $in: ids } });
    return res.json({
      success: true,
      message: `Deleted ${ids.length} user(s) with email: ${email}`,
      deletedIds: ids,
    });
  } catch {
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
