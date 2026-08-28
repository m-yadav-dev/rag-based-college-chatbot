const express = require('express');
const router = express.Router();
const validateRequest = require('../../../middlewares/validateRequest');
const requireAuth = require('../../../middlewares/requireAuth');
const { chatQuerySchema } = require('./chat.validators');
const { handleChatQuery, getChatHistory } = require('./chat.controller');

// Map POST / to our validation middleware and controller logic
router.post('/chat', requireAuth, validateRequest(chatQuerySchema), handleChatQuery);
router.get('/history', requireAuth, getChatHistory);

module.exports = router;
