const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/api_security_db';

// Global flag to indicate MongoDB connectivity
global.isMongoConnected = false;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware (FSWD / CN CO4)
app.use((req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url} - Client: ${req.ip}`);
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Intelligent API Security and Request Validation Platform',
    mongoConnected: global.isMongoConnected,
    timestamp: new Date(),
  });
});

// MongoDB Connection with Mongoose
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 2500, // Quick timeout fallback if Mongo isn't running locally
  })
  .then(() => {
    global.isMongoConnected = true;
    console.log(`[DATABASE] MongoDB successfully connected to ${MONGO_URI}`);
  })
  .catch((err) => {
    global.isMongoConnected = false;
    console.warn(`[DATABASE WARNING] MongoDB connection failed (${err.message}).`);
    console.warn(`[DATABASE] Server is running seamlessly using IN-MEMORY datastore mode.`);
  });

// Start Server
app.listen(PORT, () => {
  console.log(`================================================================`);
  console.log(` Intelligent API Security & Validation Server running on port ${PORT}`);
  console.log(` Base URL: http://localhost:${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/health`);
  console.log(`================================================================`);
});
