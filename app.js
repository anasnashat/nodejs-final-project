const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

// Load environment variables
dotenv.config();



// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));




// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the E-commerce API' });
});





module.exports = app;