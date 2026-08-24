const mongoose = require('mongoose');
const env_vars = require("../config/env.js")
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env_vars.MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
