const { rateLimit } = require('express-rate-limit');

/**
 * Rate limiter for the Gemini chat endpoint.
 * Allows 10 requests per 1-minute window per IP address.
 * Returns a 429 status with a JSON message when the limit is exceeded.
 */
const chatRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10,             // 10 requests per windowMs per IP
    standardHeaders: true,  // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false,   // Disable `X-RateLimit-*` headers
    handler: (req, res, next, options) => {
        const err = new Error('RATE_LIMIT_EXCEEDED');
        err.statusCode = 429;
        err.code = 'RATE_LIMIT_EXCEEDED';
        next(err);
    }
});

module.exports = { chatRateLimiter };
