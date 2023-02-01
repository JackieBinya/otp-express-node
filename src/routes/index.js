import express from 'express';
import otpRoutes from './otp.routes.js';

const router = express.Router();

router.use('/otp', otpRoutes);

export default router;
