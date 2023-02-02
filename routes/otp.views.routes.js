import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
	res.render('home', {
		title: 'Entrostat - Generate OTP',
		script: '/js/createOtp.js',
	});
});
router.get('/verify-otp', (req, res) => {
	res.render('verifyOtp', {
		title: 'Entrostat - Verify Otp',
		script: '/js/verifyOtp.js',
	});
});

export default router;
