const express=require("express");
const router=express.Router();
const {signUPSchema,LoginSchema,validateSchema,otpSchema}=require('../uitls/ValidationSchema/userSchema')
const {signup, sendOtp, login}=require('../controllers/auth');
const { validateOtp } = require("../controllers/validateOtp");
const { tokenVerification } = require("../middlewares/tokenVerification");


router.post('/otp',validateSchema(otpSchema),sendOtp)

router.post('/verify-otp',validateOtp)
router.post('/signup',tokenVerification,validateSchema(signUPSchema),signup);

router.post('/login',validateSchema(LoginSchema),login)

module.exports = router;