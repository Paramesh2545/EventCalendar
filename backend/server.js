const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');
const eventRoutes = require('./routes/eventRoutes');

// Load env vars
dotenv.config();

// Connect to database
connectDB().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});

const app = express();

// CORS configuration - more permissive for development
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Add CORS headers manually for preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/events', eventRoutes);

// Test route
app.get('/test', (req, res) => {
    console.log("Hit /test route!");
    res.status(200).json({ message: "Test route works!" });
});
  
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query
    });
    
    res.status(500).json({
        success: false,
        error: 'Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error('Unhandled Rejection:', {
        error: err.message,
        stack: err.stack
    });
    // Close server & exit process
    server.close(() => process.exit(1));
}); 