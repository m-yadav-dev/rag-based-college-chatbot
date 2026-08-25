const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const documentRoutes = require('./src/modules/documents/documentRoutes');
const env_vars = require("./config/env.js")
dotenv.config();

const app = express();
const PORT = env_vars.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/documents', documentRoutes);

// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running normally.' });
});

// Initialize Connections and Start Server
const startServer = async () => {
    // Connect to MongoDB
    await connectDB();

    // Connect to Redis
    await connectRedis();

    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });
};

startServer();
