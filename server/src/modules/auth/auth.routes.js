const express = require('express');
const router = express.Router();
const validateRequest = require('../../../middlewares/validateRequest');
const { registerSchema, loginSchema } = require('../../../utils/validators');
const { register, login, guestLogin } = require('./auth.controller');

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/guest-login', guestLogin);

module.exports = router;
