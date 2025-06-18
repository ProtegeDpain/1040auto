const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { generateOTP } = require('../utils/otp');
const { sendMail } = require('../utils/sendMail');

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY;
// Store OTPs in-memory for demo (use DB/Redis in production)
const otps = {};



// After DB creation the Email should be fetched from the DB.
const forgotPasswordController = async (req, res) => {
    const { username, email } = req.body;
    if (!username || !email) {
        return res.status(400).json({ success: false, message: 'Username and email are required.' });
    }
    const userData = await prisma.users.findUnique({
        where: { email: username }
    });
    if (user) {
        const otp = generateOTP();
        otps[username] = otp;
        try {
            await sendMail({
                to: email,
                subject: 'Your OTP for Password Reset',
                text: `Your OTP for password reset is: ${otp}`
            });
            res.json({ success: true, message: 'OTP sent to your email.' });
        } catch (err) {
            res.status(500).json({ success: false, message: 'Failed to send email', error: err.message });
        }
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
};

module.exports = {
    loginController,
    forgotPasswordController,
    otps
};
