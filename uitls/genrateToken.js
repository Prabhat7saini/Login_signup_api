// Import necessary modules
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateTokenAndRespond = (payload, user = null, message, res) => {
    // Generate JWT token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '3h',
    });

    if (user) {
        // Attach token to user and remove password
        user.token = token;
        user.password = undefined;
    }

    // Set options for cookie
    const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Cookie expiry set to 3 days
        httpOnly: true,
    };

    // Create response object
    const responseObject = {
        success: true,
        token,
        message,
    };

    // Add user to response if present
    if (user) {
        responseObject.user = user;
    }

    // Send response with token and user data
    return res.cookie('token', token, options)
        .status(200)
        .json(responseObject);
};

module.exports = { generateTokenAndRespond };
