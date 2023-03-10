import otpGenerator from 'otp-generator';
import { sub, add, isBefore } from 'date-fns';
import { Op } from 'sequelize';
import Otp from '../../models/Otp.js';
import { sendMail } from '../../services/emails/email.service.js';
import { templates } from '../../services/emails/templates/index.js';
import ResetOtp from '../../models/ResetOtp.js';

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

		// Check if last OTP is still valid - an otp has a lifespan of 5mins
		if (oldOtpRecords.length > 0) {
			// Filter otps
			otps = oldOtpRecords.map((el) => el.otp);
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
			body: templates.otpIssuedEmailTemplate({ otp: newOtp }),
		});
		// Write otp record in the db
		await Otp.create({
			email: req.body.email,
			otp: newOtp,
			created_at: new Date(),
		});

		return res.status(201).json({
			success: true,
			data: {
				email,
				otp: newOtp,
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

const verifyOtp = async (req, res) => {
	try {
		const { otp, email } = req.body;

		if (!email) {
			return res.status(400).json({
				success: false,
				error: 'The email field is required',
			});
		}

		if (!otp) {
			return res.status(400).json({
				success: false,
				error: 'The otp field is required',
			});
		}

		// Check if otp is expired
		const otpItem = await Otp.findOne({
			where: {
				email,
				otp,
			},
		});

		if (!otpItem) {
			return res.status(404).json({
				success: false,
				error: `The OTP ${otp} which belongs to ${email} was not found in the system`,
			});
		}

		// Check if otp has been used previously
		if (otpItem.is_used) {
			return res.status(403).json({
				success: false,
				error: `The OTP ${otp} which belongs to ${email} has has been used previously, please request a new OTP`,
			});
		}

		const expirationTimeForOtpItem = add(otpItem.created_at, {
			seconds: process.env.OTP_EXPIRATION_TIME_IN_SECONDS,
		});

		if (!isBefore(new Date(), expirationTimeForOtpItem)) {
			return res.status(403).json({
				success: false,
				error: `The submitted OTP has expired`,
			});
		}
		// Check if user submitted the latest OTP
		const otpsIssuedToUser = await Otp.findAll({
			where: {
				email,
			},
			order: [['created_at', 'DESC']],
		});

		if (otp !== otpsIssuedToUser[0].otp) {
			return res.status(403).json({
				success: false,
				error: `Please submit the most recent OTP you were issued with by the system`,
			});
		}

		// Flag otp as used
		await Otp.update(
			{ is_used: true },
			{
				where: {
					id: otpItem.id,
				},
			}
		);

		return res.status(200).json({
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: 'Something went wrong, please try again later.',
		});
	}
};

const resendOtp = async (req, res) => {
	try {
		const { otp, email } = req.body;

		if (!email) {
			return res.status(400).json({
				success: false,
				error: 'The email field is required',
			});
		}

		if (!otp) {
			return res.status(400).json({
				success: false,
				error: 'The otp field is required',
			});
		}

		// Check if otp is expired
		const otpItem = await Otp.findOne({
			where: {
				email,
				otp,
			},
		});

		if (!otpItem) {
			return res.status(404).json({
				success: false,
				error: `The OTP ${otp} which belongs to ${email} was not found in the system`,
			});
		}

		// Check reset window hast been lapsed
		const oldOtpIssueDate = otpItem['created_at'];

		const expirationOfOldOtp = add(oldOtpIssueDate, {
			minutes: process.env.OTP_RESET_WINDOW_IN_MINUTES,
		});

		if (!isBefore(new Date(), expirationOfOldOtp)) {
			return res.status(400).json({
				success: false,
				error: 'Cannot perform operation, please request a new OTP',
			});
		}

		// Check if the otp is unused
		if (otpItem.is_used) {
			return res.status(400).json({
				success: false,
				error: 'The submitted OTP has been used, please request a new OTP',
			});
		}

		// Check number of times the user has asked the same OTP to be reset
		const resetOtpsCount = await ResetOtp.findAll({
			where: {
				email,
				otp,
			},
		});

		if (resetOtpsCount.length > process.env.OTP_MAX_NUMBER_OF_RESET) {
			return res.status(400).json({
				success: false,
				error: 'Maximum number of attempts exceeded for OTP resets,please request a new OTP ',
			});
		}

		// Send the reset OTP to the user via email
		await sendMail({
			to: email,
			subject: 'Reset One Time Password - OTP',
			body: templates.otpIssuedEmailTemplate({ otp }),
		});

		//Update OTP created_at time
		await Otp.update(
			{ created_at: new Date() },
			{
				where: {
					id: otpItem.id,
				},
			}
		);

		// Write ResetOtp record in db
		await ResetOtp.create({
			email,
			otp,
			created_at: new Date(),
		});

		return res.status(200).json({
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			error: 'Something went wrong, please try again later.',
		});
	}
};

export { createOtp, verifyOtp, resendOtp };
