
const dotenv = require("dotenv"); 


dotenv.config()





const ENV_VARS = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    REDIS_URL: process.env.REDIS_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLIENT_URL: process.env.CLIENT_URL,
}



module.exports = ENV_VARS;