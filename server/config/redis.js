// const { createClient } = require('redis');
// const redisClient = createClient({
    //     url: env_vars.REDIS_URL
    // });

// redisClient.on('error', (err) => {
//     console.error('❌ Redis Client Error', err);
// });

// redisClient.on('connect', () => {   
//     console.log('✅ Redis Client Connected');
// });

// const connectRedis = async () => {
    //     if (!env_vars.REDIS_URL) {
//         console.warn('❌ REDIS_URL is not set. Skipping Redis connection.');
//         return;
//     }
//     try {
    //         await redisClient.connect();
//     } catch (error) {
//         console.error('❌ Failed to connect to Redis:', error);
//     }
// };

// module.exports = { redisClient, connectRedis };


const env_vars = require("../config/env.js")


const {Redis} = require("ioredis")
const redis = new Redis(env_vars.REDIS_URL, {
    maxRetriesPerRequest: null, 
    keepAlive: 10000, // Prevent Upstash from closing idle sockets
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000)
        return delay 
    }   
})


redis.on("connect", async () => {
    console.log("✅ Redis Client Connected.....")
    await redis.set("test_connection", "Hello, This is testing connection of redis.....", "EX", 300)
    console.log(`✅ Test key writtenn on Redis...`)
})

redis.on("error", (err) => {
    // Silently handle ECONNRESET since ioredis auto-reconnects
    if (err.code === 'ECONNRESET') {
        return; 
    }
    console.warn("❌ Redis Client Error", err)
})

module.exports = redis