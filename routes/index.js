import express from 'express';
import otpRoutes from './otp.routes.js';
import otpViewsRoutes from './otp.views.routes.js';

const router = express.Router();

router.use('/', otpViewsRoutes);
router.use('/otp', otpRoutes);

export default router;
