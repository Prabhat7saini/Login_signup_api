const mailSender = require("./mailSender");

const sendMailForOtp = async (email, otp) => {
    const mainResponse = await mailSender(
        email,
        "Verification Email",
        otp
    );
};

module.exports = sendMailForOtp;
