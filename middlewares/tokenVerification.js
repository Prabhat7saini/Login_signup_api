const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user.models");
const { sendErrorResponse } = require("../uitls/responeFunciton");


exports.tokenVerification = async (req, res, next) => {
    try {


        const token = req.cookies.token || (req.header("Authorization") && req.header("Authorization").replace("Bearer ", ""));
     
        // If JWT is missing, return 401 Unauthorized response
        if (!token) {
            // console.log("JWT missing", token);
            return res.status(401).json({ success: false, message: `Token Missing` });
        }

        try {
            // Verifying the JWT using the secret key stored in environment variables
            const decode =  jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            // Storing the decoded JWT payload in the request object for further use
            req.user = decode;
        } catch (error) {
            // If JWT verification fails, return 401 Unauthorized response
            return res
                .status(401)
                .json({ success: false, message: "token is invalid" });
        }

        // If JWT is valid, move on to the next middleware or request handler
        next();
    } catch (error) {
        // If there is an error during the authentication process, return 401 Unauthorized response
        sendErrorResponse(res,401,error.message)
       
    }
};