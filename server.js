const app = require('./app');  // Import app from the app.js file
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
// const express = require('express'); // Remove this line, as app is already imported
dotenv.config();

// Define port
const PORT = process.env.PORT || 50000;

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  // Close server & exit process
  server.close(() => process.exit(1));
});

//  the 'uploads' directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Uploads directory created');
}