const express = require('express');
const authRoutes = require('./authRoutes');
const workoutRoutes = require('./workoutRoutes');
const aiRoutes = require('./aiRoutes');

const router = express.Router();

// Mount individual domain route groups
router.use('/auth', authRoutes);
router.use('/workouts', workoutRoutes);
router.use('/ai', aiRoutes);

module.exports = router;
