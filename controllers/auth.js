// controllers/auth.js
const bcrypt = require('bcrypt');
const User = require('../models/user.models'); // Adjust the path as needed
const OTP = require('../models/otp.model');
const mailSender = require('../uitls/mailSender');
const Otp_genrator = require("otp-generator");
const { Op } = require('sequelize');
const sendMailForOtp = require('../uitls/sendVerificationMail');
const jwt = require('jsonwebtoken')


exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, age, password, otp } = req.body;


        if (!firstName || !lastName || !email || !password) {
            console.log(firstName, lastName, age, email, password);
            return res.status(403).send({
                success: false,
                message: "All fields are required"
            });
        }

        //  Check User Exit or not
        const CheckUserPresent = await User.findOne({ where: { email } });

        if (CheckUserPresent) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        //  find latest otp and validate-------------------------

        const checkotpsize = await OTP.findAll({ where: { email: email } });
        console.log(checkotpsize.length, "leng\n");
        const recentotp = await OTP.findOne({
            where: { email: email },
            order: [['createdAt', 'DESC']],
        });

        console.log(`recentotp-> ${recentotp.otp}`);

        // Validate OTP
        if (!recentotp) {
            // OTP not found
            return res.status(404).json({
                success: false,
                message: "OTP not found",
            });
        } else if (recentotp.otp !== otp) {
            return res.status(404).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        // Hash Password
        const Hashedpassword = await bcrypt.hash(password, 10);

        // Create new User
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: Hashedpassword,
            age
        });

        return res.status(206).json({
            success: true,
            user,
            message: "User created successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be created"
        });
    }
}



exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(403).send({
                success: false,
                message: "All fields are required"
            });
        }
        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const payload = {
                email: user.email,
                id: user.id,
            };

            // Generate JWT token
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '3h',
            });
            user.token = token;
            user.password = undefined;
            // Set token in cookie
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            // Return response with token and user data
            return res.cookie('token', token, options).status(200).json({
                success: true,
                token,
                user,
                message: 'User Login Success',
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid password',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }


}



const requestTracker = {};
const RATE_LIMIT = 5;
const TIME_WINDOW = 1 * 60 * 1000;
const BLOCK_TIME = 5 * 60 * 1000;
exports.sendOtp = async (req, res) => {



    const { email } = req.body;
    if (!email) {
        return res.status(403).send({
            success: false,
            message: "All fields are required"
        });
    }

    // Rate limiting logic
    const currentTime = Date.now();
    const userRequests = requestTracker[email] || [];

    // Filter out requests older than the time window
    const recentRequests = userRequests.filter(timestamp => currentTime - timestamp < TIME_WINDOW);

    if (recentRequests.length >= RATE_LIMIT) {
        // Check if the user is currently blocked
        const lastRequestTime = Math.max(...recentRequests);
        if (currentTime - lastRequestTime < BLOCK_TIME) {
            return res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later."
            });
        }
    }

    // Update the request tracker
    requestTracker[email] = [...recentRequests, currentTime];

    try {
        const CheckUserPresent = await User.findOne({ where: { email } });

        if (CheckUserPresent) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        let otp = Otp_genrator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Check unique OTP
        let result = await OTP.findOne({ where: { otp } });
        while (result) {
            otp = Otp_genrator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ where: { otp } });
        }

        const otp_payload = { email, otp };

        // Create an entity in the database
        const otpbody = await OTP.create(otp_payload);
        await sendMailForOtp(email, otp);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully..."
        });
    } catch (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while sending the OTP"
        });
    }
};
