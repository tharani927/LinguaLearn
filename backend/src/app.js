const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config/env');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { error } = require('./utils/response');

const app = express();

// Security Headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: true, // Allow frontend dev server and production origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Request body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging in non-test mode
if (config.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api', routes);

// Root greeting & status
app.get('/', (req, res) => {
  res.json({
    name: 'LinguaLearn API',
    description: 'Intelligent Language Learning Platform Backend',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// 404 handler
app.use((req, res) => {
  error(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
});

// Global error handler
app.use(errorHandler);

module.exports = app;
