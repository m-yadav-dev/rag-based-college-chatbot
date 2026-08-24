const { createClient } = require('redis');
const env_vars = require("../config/env.js")
const redisClient = createClient({
    url: env_vars.REDIS_URL
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
    console.log('Redis Client Connected');
});

const connectRedis = async () => {
    if (!env_vars.REDIS_URL) {
        console.warn('REDIS_URL is not set. Skipping Redis connection.');
        return;
    }
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Failed to connect to Redis:', error);
    }
};

module.exports = { redisClient, connectRedis };
