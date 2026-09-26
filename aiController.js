const geminiService = require('../services/geminiService');

// @desc    Get AI workout recommendation
// @route   POST /api/ai/workout-recommendation
// @access  Private
const getWorkoutRecommendation = async (req, res, next) => {
  try {
    const { age, fitnessGoal, experience } = req.body;

    // Validate inputs
    if (age === undefined || !fitnessGoal || !experience) {
      return res.status(400).json({
        success: false,
        error: 'Please provide age, fitnessGoal, and experience',
      });
    }

    // Call service to get recommendation from Gemini AI
    const recommendation = await geminiService.generateWorkoutRecommendation(
      age,
      fitnessGoal,
      experience
    );

    res.status(200).json({
      recommendation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI fitness insights
// @route   POST /api/ai/fitness-insights
// @access  Private
const getFitnessInsights = async (req, res, next) => {
  try {
    const { totalWorkouts, averageDuration, totalCaloriesBurned } = req.body;

    // Validate inputs
    if (
      totalWorkouts === undefined ||
      averageDuration === undefined ||
      totalCaloriesBurned === undefined
    ) {
      return res.status(400).json({
        success: false,
        error: 'Please provide totalWorkouts, averageDuration, and totalCaloriesBurned',
      });
    }

    // Call service to get insights from Gemini AI
    const insight = await geminiService.generateFitnessInsights(
      totalWorkouts,
      averageDuration,
      totalCaloriesBurned
    );

    res.status(200).json({
      insight,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWorkoutRecommendation,
  getFitnessInsights,
};
