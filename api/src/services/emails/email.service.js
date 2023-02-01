import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
	port: process.env.MAIL_PORT,
	host: process.env.MAIL_HOST,
	auth: {
		user: process.env.MAIL_USERNAME,
		pass: process.env.MAIL_PASSWORD,
	},
	tls: {
		ciphers: 'SSLv3',
	},
	secure: false,
});

const sendMail = ({ to, cc, subject: _subject, body, attachments = [] }) => {
	const subject = _subject || 'No Subject';
	console.log(
		`Sending Email ${JSON.stringify(to)}`,
		`${subject}
  ${body}
  `
	);
	const mailData = {
		from: process.env.MAIL_FROM || process.env.MAIL_USERNAME,
		to: Array.isArray(to) ? to : [to],
		subject: `${subject}`,
		text: body,
		cc: Array.isArray(cc) ? cc : [cc],
		attachments: attachments,
	};
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailData, function (err, info) {
			if (err) {
				console.log(`FAILED SEND! Email ${JSON.stringify(to)}`, err);
				reject(err);
			} else {
				console.log(`SENT! Email ${JSON.stringify(to)}`, subject);
				resolve(info);
			}
		});
	});
};

export { sendMail };
