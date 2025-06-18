const express = require('express');
const jwt = require('jsonwebtoken');
const users = require('../models/users');
const transporter = require('../middleware/mailer');
const { generateOTP } = require('../utils/otp');
const { sendMail } = require('../utils/sendMail');
const { loginController, forgotPasswordController } = require('../controllers/authController');
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

// Store OTPs in-memory for demo (use DB/Redis in production)
const otps = {};

// Login route with JWT
router.post('/login', loginController);

// Forgot Password API with SMTP OTP
router.post('/forgot-password', forgotPasswordController);

module.exports = router;
