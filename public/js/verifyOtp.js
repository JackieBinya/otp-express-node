const verifyOtpForm = document.querySelector('#verifyOtpForm');
const actionBtn = document.querySelector('#action-btn');
const resendOtpBtn = document.querySelector('#resend-otp-btn');
const verifyOtpBtn = document.querySelector('#verify-otp-btn');

const verifyOtpFormSuccessMessage = verifyOtpForm.querySelectorAll(
	'span.success-message'
)[0];
const verifyOtpFormErrorMessage =
	verifyOtpForm.querySelectorAll('span.error-message')[0];

verifyOtpForm.addEventListener('submit', async (e) => {
	try {
		e.preventDefault();

		const formData = new FormData(verifyOtpForm);

		const data = Object.fromEntries(formData);

		if (actionBtn.dataset.action === 'verify') {
			const response = await fetch('/otp/verify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const res = await response.json();

			if (!res.success) {
				verifyOtpFormErrorMessage.textContent = res.error;
			}

			if (
				!res.success &&
				res.error ===
					'The submitted OTP has expired'
			) {
				actionBtn.dataset.action = 'resend';
				resendOtpBtn.style.display = 'inline';
				verifyOtpBtn.style.display = 'none';
			}

			if (res.success) {
				verifyOtpForm.reset();
				verifyOtpFormSuccessMessage.textContent =
					'Your OTP has been successfully verified🎊.';
			}

			return;
		}

		if (actionBtn.dataset.action === 'resend') {
			const response = await fetch('/otp/resend', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});

			const res = await response.json();

			if (!res.success) {
				verifyOtpFormErrorMessage.textContent = res.error;
			}

			if (res.success) {
				verifyOtpFormErrorMessage.textContent = '';
				verifyOtpFormSuccessMessage.textContent =
					'Your OTP has been successfully reset and sent to your email';
			}

			verifyOtpForm.reset();
			actionBtn.dataset.action = 'verify';
			resendOtpBtn.style.display = 'none';
			verifyOtpBtn.style.display = 'inline';

			return;
		}
	} catch (error) {
		console.log({ error });
		verifyOtpFormErrorMessage.textContent =
			'Something happened, please try again later!';
	}
});

document.addEventListener('keydown', (e) => {
	verifyOtpFormErrorMessage.textContent = '';
	verifyOtpFormSuccessMessage.textContent = '';
});
