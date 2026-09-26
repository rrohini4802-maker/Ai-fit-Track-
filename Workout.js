const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    workoutName: {
      type: String,
      required: [true, 'Please add a workout name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a workout category'],
      enum: {
        values: [
          'Cardio',
          'Strength Training',
          'Yoga',
          'Running',
          'Cycling',
          'Walking',
        ],
        message: '{VALUE} is not a supported workout category',
      },
    },
    duration: {
      type: Number,
      required: [true, 'Please add the workout duration in minutes'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    caloriesBurned: {
      type: Number,
      required: [true, 'Please specify calories burned'],
      min: [0, 'Calories burned cannot be negative'],
    },
    workoutDate: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Workout', workoutSchema);
