import express from 'express';
const router = express.Router();

router.get('/info', (req, res) => {
  res.status(200).json({
    message: "API is working perfectly",
    developer: "Maliha",
    framework: "Express.js",
    timestamp: new Date()
  });
});

export default router;