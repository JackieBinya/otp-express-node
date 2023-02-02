const verifyOtpForm = document.querySelector("#verifyOtpForm");

const verifyOtpFormSuccessMessage = verifyOtpForm.querySelectorAll("span.success-message")[0];
const verifyOtpFormErrorMessage = verifyOtpForm.querySelectorAll("span.error-message")[0];

verifyOtpForm.addEventListener("submit", async(e) => {
    try {
      e.preventDefault();

    const formData = new FormData(verifyOtpForm);

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