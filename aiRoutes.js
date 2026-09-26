const express = require('express');
const { getWorkoutRecommendation, getFitnessInsights } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply JWT authentication protection to all AI routes to secure LLM API usage
router.use(protect);

router.post('/workout-recommendation', getWorkoutRecommendation);
router.post('/fitness-insights', getFitnessInsights);

module.exports = router;
