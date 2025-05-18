const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const corsOptions = require('./config/cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const path = require('path');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './config/.env' });

// Check required environment variables
const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'JWT_COOKIE_EXPIRE'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars);
    console.error('Please check your .env file or environment configuration');
    process.exit(1);
}

// Connect to database
// connectDB();

const app = express();

// Logger
app.use(morgan('dev'));

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://speak-fresh-frontend.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/products', require('./routes/products'));
app.use('/api/v1/categories', require('./routes/categories'));
app.use('/api/v1/orders', require('./routes/orders'));
app.use('/api/v1/shipping', require('./routes/shipping'));
app.use('/api/v1/reviews', require('./routes/reviews'));
app.use('/api/v1/delivery', require('./routes/delivery'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        error: err.message || 'Something went wrong!'
    });
});

module.exports = app; 