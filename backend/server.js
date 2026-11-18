
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Atlas connection
const MONGO_URI =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI;

// MongoDB connection status
global.isMongoConnected = false;

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
    const time = new Date().toISOString();

    console.log(
        `[${time}] ${req.method} ${req.url} - Client: ${req.ip}`
    );

    next();
});

// ===============================
// ROOT ROUTE
// ===============================

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Intelligent API Security and Request Validation Platform Backend is Running!',
        service: 'Intelligent API Security Platform',
        status: 'ONLINE',
        mongoConnected: global.isMongoConnected,
        timestamp: new Date()
    });
});

// ===============================
// HEALTH CHECK
// ===============================

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'ONLINE',
        service: 'Intelligent API Security and Request Validation Platform',
        mongoConnected: global.isMongoConnected,
        databaseStatus: global.isMongoConnected
            ? 'Connected'
            : 'Disconnected',
        databaseName: mongoose.connection.name || null,
        timestamp: new Date()
    });
});

// ===============================
// API ROUTES
// ===============================

app.use('/api', apiRoutes);

// ===============================
// MONGODB CONNECTION EVENTS
// ===============================

mongoose.connection.on('connected', () => {
    global.isMongoConnected = true;

    console.log('[DATABASE] MongoDB connected successfully!');
    console.log('[DATABASE] Database:', mongoose.connection.name);
});

mongoose.connection.on('disconnected', () => {
    global.isMongoConnected = false;

    console.log('[DATABASE] MongoDB disconnected!');
});

mongoose.connection.on('error', (err) => {
    global.isMongoConnected = false;

    console.error('[DATABASE ERROR]', err.message);
});

// ===============================
// CONNECT TO MONGODB
// ===============================

async function connectDatabase() {
    try {
        if (!MONGO_URI) {
            throw new Error(
                'MONGODB_URI is missing. Please configure it in backend/.env'
            );
        }

        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });

        global.isMongoConnected = true;

        console.log('==============================================');
        console.log('[DATABASE] MongoDB connection successful!');
        console.log('[DATABASE] Database:', mongoose.connection.name);
        console.log('==============================================');

    } catch (error) {
        global.isMongoConnected = false;

        console.error(
            '[DATABASE ERROR] MongoDB connection failed:',
            error.message
        );
    }
}

// ===============================
// START SERVER
// ===============================

async function startServer() {
    await connectDatabase();

    app.listen(PORT, '0.0.0.0', () => {
        console.log('==============================================');
        console.log(' Intelligent API Security Platform');
        console.log(' Backend Server Started Successfully!');
        console.log(` Port: ${PORT}`);
        console.log(` Health Check: http://localhost:${PORT}/health`);
        console.log('==============================================');
    });
}

startServer();
