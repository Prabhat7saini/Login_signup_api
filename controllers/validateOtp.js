
const OTP = require('../models/otp.model');
const { generateTokenAndRespond } = require('../uitls/genrateToken');
const { sendErrorResponse } = require('../uitls/responeFunciton'); // Adjust the path according to your project structure

exports.validateOtp = async (req, res) => {
    try {
        

        const { email, otp } = req.body;

        // Fetch the most recent OTP entry for the given email
        console.log(email,otp)
        console.log(OTP)
        if(!email || !otp ){
            sendErrorResponse(res,500,"All field required")
        }
        const recentOtp = await OTP.findOne({
            where: { email },
            order: [['createdAt', 'DESC']],
        });

        // Validate OTP
        if (!recentOtp) {
            // OTP not found
            return sendErrorResponse(res, 404, "OTP not found");
        } else if (recentOtp.otp !== otp) {
            // Invalid OTP
            return sendErrorResponse(res, 404, "Invalid OTP");
        }
        const payload = {
            email
        }
        // OTP is valid
        return generateTokenAndRespond(payload, null,"OTP Validated successfully", res);


    } catch (error) {
        console.error("Error validating OTP:", error);
        return sendErrorResponse(res, 500, "Server error");
    }
};


