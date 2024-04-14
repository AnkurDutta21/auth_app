const express = require("express");
const router = express.Router();
const {createOtp,verifyOtp, resetPasswordOtp } = require("../controller/otp");

router.post("/", createOtp);
router.post("/verify",verifyOtp)
router.post("/reset-otp",resetPasswordOtp)

module.exports = router;
