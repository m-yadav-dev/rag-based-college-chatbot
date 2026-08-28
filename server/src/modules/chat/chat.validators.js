const { z } = require('zod');

const chatQuerySchema = z.object({
    query: z.string()
        .min(1, "Question cannot be empty")
        .max(1000, "Question must be under 1000 characters")
});

module.exports = { chatQuerySchema };
