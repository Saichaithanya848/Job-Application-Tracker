const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Body parser middleware for parsing JSON request bodies
app.use(express.json());

// API health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Job Application Tracker API is healthy and running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

// Fallback 404 handler for unknown routes
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
