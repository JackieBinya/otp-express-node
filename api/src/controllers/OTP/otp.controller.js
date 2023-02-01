import otpGenerator from 'otp-generator';
import { sub, add, isBefore } from 'date-fns';
import { Op } from 'sequelize';
import Otp from '../../models/Otp.js';
import { sendMail } from '../../services/emails/email.service.js';
import { templates } from '../../services/emails/templates/index.js';

const createOtp = async (req, res) => {
	try {
		const { email } = req.body;
		// Check if email field is provided
		if (!email) {
			return res.status(400).json({
				success: false,
				error: 'The email field is required',
			});
		}

		// Email validation using REGEX
		const emailRegexp =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		if (!emailRegexp.test(email)) {
			return res.status(400).json({
				success: false,
				error: 'Invalid email',
			});
		}

		// Get all otps issued to the user in the last 24hrs in descending order
		const currentTime = new Date();
		const twentyFourHoursAgo = sub(currentTime, {
			hours: 24,
		});
		const oldOtpRecords = await Otp.findAll({
			where: {
				email,
				created_at: {
					[Op.between]: [twentyFourHoursAgo, currentTime],
				},
			},
			order: [['created_at', 'DESC']],
		});

		let otps = [];

		console.log('🔴🔴🔴🔴', oldOtpRecords);
		// Check if last OTP is still valid - an otp has a lifespan of 5mins
		if (oldOtpRecords.length > 0) {
			// Filter otps
			otps = oldOtpRecords.map((el) => el.otp);

			console.log('🔫🔫🔫🔫🔫', otps);

			console.log('🌕🌕🌕🌕', oldOtpRecords[0]['created_at']);
			const oldOtpIssueDate = oldOtpRecords[0]['created_at'];
			const expirationOfOldOtp = add(oldOtpIssueDate, {
				minutes: process.env.OTP_VALIDITY_TIME_IN_MINUTES,
			});
			console.log('🌕🌕🌕🌕', expirationOfOldOtp);

			const otp = oldOtpRecords[0].otp;

			if (isBefore(currentTime, expirationOfOldOtp)) {
				console.log(`🦄🦄🦄🦄 Sending the old otp to ${email}`);
				await sendMail({
					to: email,
					subject: 'One Time Password - OTP',
					body: templates.otpIssuedEmailTemplate({otp}) ,
				});
				return res.status(200).json({
					success: true,
				});
			}
		}
		// Generate OTP, check that the new otp was not issued to the same user in the last 24hrs - otherwise generate a new otp
		let newOtp = otpGenerator.generate(6, {
			lowerCaseAlphabets: false,
			upperCaseAlphabets: false,
			specialChars: false,
		});

		while (otps.includes(newOtp)) {
			newOtp = otpGenerator.generate(6, {
				lowerCaseAlphabets: false,
				upperCaseAlphabets: false,
				specialChars: false,
			});
		}

		// Email the user the new otp
		await sendMail({
			to: email,
			subject: 'One Time Password - OTP',
			body: templates.otpIssuedEmailTemplate({otp: newOtp}) ,
		});
		// Write otp record in the db
		const record = await Otp.create({
			email: req.body.email,
			otp: newOtp,
			created_at: currentTime,
		});

		console.log('🟢🟢🟢🟢🟢', record);
		return res.status(200).json({
			success: true,
			data: {
				otp: newOtp,
				currentTime,
				twentyFourHoursAgo,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: 'Something went wrong, please try again later.',
		});
	}
};

const validateOtp = (req, res) => res.send('Validate OTP');

export { createOtp, validateOtp };
