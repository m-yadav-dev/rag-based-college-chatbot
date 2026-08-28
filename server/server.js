const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const documentRoutes = require('./src/modules/documents/documentRoutes');
const chatRoutes = require('./src/modules/chat/chat.routes');
const authRoutes = require('./src/modules/auth/auth.routes');
const env_vars = require("./config/env.js")
dotenv.config();

const app = express();
const PORT = env_vars.PORT || 5000;

// Middleware
app.use(cors({
    origin: env_vars.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);

// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running normally.' });
});

// Initialize Connections and Start Server
const startServer = async () => {
    // Connect to MongoDB
    await connectDB();

    // Connect to Redis

    app.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`);
    });
};

startServer();
