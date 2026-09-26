const Workout = require('../models/Workout');

// @desc    Add a new workout
// @route   POST /api/workouts
// @access  Private
const addWorkout = async (req, res, next) => {
  try {
    const { workoutName, category, duration, caloriesBurned, workoutDate } = req.body;

    // Validate fields
    if (!workoutName || !category || !duration || !caloriesBurned) {
      return res.status(400).json({
        success: false,
        error: 'Please provide workoutName, category, duration, and caloriesBurned',
      });
    }

    // Create workout record scoped to user
    const workout = await Workout.create({
      workoutName,
      category,
      duration,
      caloriesBurned,
      workoutDate: workoutDate || new Date(),
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all workouts for logged-in user
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res, next) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({ workoutDate: -1 });

    res.status(200).json({
      success: true,
      count: workouts.length,
      data: workouts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single workout by ID
// @route   GET /api/workouts/:id
// @access  Private
const getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    // If workout not found or doesn't belong to the logged-in user
    if (!workout || workout.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        error: 'Workout not found',
      });
    }

    res.status(200).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a workout
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = async (req, res, next) => {
  try {
    let workout = await Workout.findById(req.params.id);

    if (!workout || workout.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        error: 'Workout not found',
      });
    }

    // Update workout
    workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = async (req, res, next) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout || workout.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({
        success: false,
        error: 'Workout not found',
      });
    }

    await workout.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Workout removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search workouts by name, category, or date
// @route   GET /api/workouts/search
// @access  Private
const searchWorkouts = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a search term using the query parameter q (e.g. ?q=running)',
      });
    }

    // Build the query object, strictly scoped to current user
    const queryObj = { user: req.user._id };

    const orConditions = [
      { workoutName: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
    ];

    // Try parsing q as date (e.g., YYYY-MM-DD or similar formats)
    const parsedDate = Date.parse(q);
    // Only parse if q has a structure suggesting a date (digits/dashes/slashes) to prevent false positives
    const dateRegex = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$|^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/;
    if (!isNaN(parsedDate) && dateRegex.test(q)) {
      const searchDate = new Date(parsedDate);
      
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

      orConditions.push({
        workoutDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });
    }

    queryObj.$or = orConditions;

    const workouts = await Workout.find(queryObj).sort({ workoutDate: -1 });

    res.status(200).json({
      success: true,
      count: workouts.length,
      data: workouts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addWorkout,
  getWorkouts,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
  searchWorkouts,
};
