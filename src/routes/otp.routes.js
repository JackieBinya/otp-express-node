import express from 'express';

import rateLimit from 'express-rate-limit';
import { createOtp, verifyOtp } from '../controllers/OTP/otp.controller.js';

const router = express.Router();

const otpRateLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: process.env.OTP_LIMIT_PER_HOUR,
	message:
		'Too many OTPs requested from this IP, please try again after an hour',
	standardHeaders: true,
	legacyHeaders: false,
});

router.post('/create', otpRateLimiter, createOtp);
router.post('/verify', verifyOtp);

export default router;
