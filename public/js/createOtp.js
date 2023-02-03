const createOtpForm = document.querySelector('#createOtpForm');
const resendOtpContainer = document.querySelector('.resend-otp-container');
const resendOtpBtn = document.querySelector('#resend-otp-btn');
let resetOtpData = '';

const createOtpFormSuccessMessage = createOtpForm.querySelectorAll(
	'span.success-message'
)[0];
const createOtpFormErrorMessage =
	createOtpForm.querySelectorAll('span.error-message')[0];

createOtpForm.addEventListener('submit', async (e) => {
	try {
		e.preventDefault();

		const formData = new FormData(createOtpForm);

		const data = Object.fromEntries(formData);

		const response = await fetch('/otp/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});

		const res = await response.json();

		if (!res.success) {
			createOtpFormErrorMessage.textContent = res.error;
		}

		if (res.success) {
			createOtpForm.reset();
			createOtpFormSuccessMessage.textContent =
				'OTP has been successfully sent to your email.';

			resetOtpData = {
				...res.data
			};

			resendOtpContainer.style.display = 'block';
		}
	} catch (error) {
		console.log({ error });
		createOtpFormSuccessMessage.textContent = '';
		createOtpFormErrorMessage.textContent =
			'Something happened, please try again later!';
	}
});

resendOtpBtn.addEventListener('click', async e =>{
	try {
		createOtpFormSuccessMessage.textContent = '';
		createOtpFormErrorMessage.textContent = '';
			
		const response = await fetch('/otp/resend', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(resetOtpData),
		});

		const res = await response.json();

			if (!res.success) {
				createOtpFormSuccessMessage.textContent = '';
				createOtpFormErrorMessage.textContent = res.error;
			}

			if (res.success) {
				createOtpFormErrorMessage.textContent = '';
				createOtpFormSuccessMessage.textContent =
					'Your OTP has been successfully reset and sent to your email';
			}
		
	} catch (error) {
		console.log({ error });
		createOtpFormSuccessMessage.textContent = '';
		createOtpFormErrorMessage.textContent =
			'Something happened, please try again later!';	
	}
});

document.addEventListener('keydown', (e) => {
	createOtpFormErrorMessage.textContent = '';
	createOtpFormSuccessMessage.textContent = '';
	resendOtpContainer.style.display = 'none';
	resetOtpData={};

	console.log('🟣🟣🟣🟣', resetOtpData)
});
