const createOtpForm = document.querySelector("#createOtpForm");
const verifyOtpForm = document.querySelector("#verifyOtpForm");

const createOtpFormSuccessMessage = createOtpForm.querySelectorAll("span.success-message")[0];
const createOtpFormErrorMessage = createOtpForm.querySelectorAll("span.error-message")[0];

const verifyOtpSuccessMessage = createOtpForm.querySelectorAll("span.success-message")[0];
const verifyOtpFormErrorMessage = createOtpForm.querySelectorAll("span.error-message")[0];

createOtpForm.addEventListener("submit", async(e) => {
    try {
      e.preventDefault();

    const formData = new FormData(createOtpForm);

    const data = Object.fromEntries(formData);

    const response = await fetch('/otp/create',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const res = await response.json();

    if(!res.success){
      createOtpFormErrorMessage.textContent = res.error;
    }

    if(res.success){
      createOtpForm.reset();
      createOtpFormSuccessMessage.textContent ='OTP has been successfully sent to your email.';
    }
   
    } catch (error) {
      console.log({error});
      createOtpFormErrorMessage.textContent ='Something happened, please try again later!';
    }
  });

  verifyOtpForm.addEventListener("submit", async(e) => {
    try {
      e.preventDefault();

    const formData = new FormData(createOtpForm);

    const data = Object.fromEntries(formData);

    const response = await fetch('/otp/verify',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const res = await response.json();

    if(!res.success){
      verifyOtpFormErrorMessage.textContent = res.error;
    }

    if(res.success){
      verifyOtpForm.reset();
      verifyOtpFormSuccessMessage.textContent ='Your OTP has been successfully verified🎊.';
    }
   
    } catch (error) {
      console.log({error});
      verifyOtpFormErrorMessage.textContent ='Something happened, please try again later!';
    }
  });