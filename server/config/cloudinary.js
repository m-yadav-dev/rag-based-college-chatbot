const cloudinary = require('cloudinary').v2;
const env_vars = require("../config/env.js")

cloudinary.config({
    cloud_name: env_vars.CLOUDINARY_CLOUD_NAME,
    api_key: env_vars.CLOUDINARY_API_KEY,
    api_secret: env_vars.CLOUDINARY_API_SECRET
});

module.exports = cloudinary;