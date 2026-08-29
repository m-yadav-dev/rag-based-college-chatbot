/**
 * Centralized Error Handling Middleware
 * Must be registered AFTER all routes in server.js
 * Signature: (err, req, res, next) — Express identifies this as an error handler by the 4 params.
 */
const errorHandler = (err, req, res, next) => {
    // Log the error stack for debugging (server-side only)
    console.error(`❌ [${req.method}] ${req.originalUrl} →`, err.stack || err.message);

    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // --- Mongoose: Invalid ObjectId ---
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 400;
        message = `Invalid ID format: ${err.value}`;
    }

    // --- Mongoose: Validation Error (missing/invalid fields) ---
    if (err.name === 'ValidationError') {
        statusCode = 400;
        const fields = Object.values(err.errors).map(e => e.message);
        message = `Validation failed: ${fields.join(', ')}`;
    }

    // --- Mongoose: Duplicate Key (e.g., unique email) ---
    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue).join(', ');
        message = `Duplicate value for: ${field}. This already exists.`;
    }

    // --- JWT: Malformed or invalid token ---
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid authentication token.';
    }

    // --- JWT: Expired token ---
    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Authentication token has expired. Please log in again.';
    }

    // --- Prevent leaking stack traces in production ---
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};

module.exports = errorHandler;
