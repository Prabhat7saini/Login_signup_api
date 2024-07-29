const express=require("express");
const router=express.Router();
const {signUPSchema,LoginSchema,validateSchema,otpSchema}=require('../uitls/ValidationSchema/userSchema')
const {signup, sendOtp, login}=require('../controllers/auth');


router.post('/otp',validateSchema(otpSchema),sendOtp)

router.post('/signup',validateSchema(signUPSchema),signup);

router.post('/login',validateSchema(LoginSchema),login)

module.exports = router;