const otpIssuedEmailTemplate = ({ otp }) => `
Hello👋,

Welcome to Estrostat, use your One Time Password ${otp}, to access the application on the link below:

https://jacqueline-8080.entrostat.dev/verify-otp

Regards,
Entrostat Team.
`;

export default otpIssuedEmailTemplate;
