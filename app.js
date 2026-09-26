const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const apiRoutes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Body parser
app.use(express.json());

// Log HTTP requests in development
app.use(morgan('dev'));

// Basic health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI FitTrack API is running successfully',
    version: '1.0.0',
  });
});

// Mount consolidated API routes
app.use('/api', apiRoutes);

// Catch-all route for unhandled requests (404)
app.use((req, res, next) => {
  const error = new Error(`Endpoint Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Centralized error handling middleware
app.use(errorHandler);

module.exports = app;
