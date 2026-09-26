const express = require('express');
const {
  addWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  searchWorkouts,
} = require('../controllers/workoutController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply protect middleware to all routes in this router
router.use(protect);

router.post('/', addWorkout);
router.get('/', getWorkouts);

// CRITICAL: Mount search route BEFORE /:id route to prevent routing conflicts
router.get('/search', searchWorkouts);

router.get('/:id', getWorkoutById);
router.put('/:id', updateWorkout);
router.delete('/:id', deleteWorkout);

module.exports = router;
