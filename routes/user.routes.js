const express=require("express");
const router=express.Router();

const {signup, sendOtp, login}=require('../controllers/auth');
router.post('/signup',signup);
router.post('/otp',sendOtp)
router.post('/login',login)

module.exports = router;