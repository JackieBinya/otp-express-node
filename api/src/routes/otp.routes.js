import express from 'express';
import rateLimit from 'express-rate-limit';
import { createOtp, validateOtp } from '../controllers/OTP/otp.controller.js';

const router = express.Router();

const otpLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: process.env.OTP_LIMIT,
	message:
		'Too many OTPs requested from this IP, please try again after an hour',
	standardHeaders: true,
	legacyHeaders: false,
});

router.post('/create', createOtp);
router.get('/validate', validateOtp);

export default router;
