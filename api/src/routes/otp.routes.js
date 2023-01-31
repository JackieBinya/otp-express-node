import express from 'express';
import { createOtp, validateOtp } from '../controllers/OTP/otp.controller.js';

const router = express.Router();

router.get('/create', createOtp);
router.get('/validate', validateOtp);

export default router;
