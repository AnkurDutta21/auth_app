const OTP = require("../models/otp");
const User = require("../models/user");
const { sendOtp, validateOtp, deleteOtp } = require("../services/otp");
const message = require("../utility/message");
const createOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const createdOtp = await sendOtp(email);
    res.status(200).json({ message: message.OTP_SENT });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ Errormessage: message.OTP_NOT_VERIFIED, error: error });
  }
};
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const validOtp = await validateOtp(email, otp);
    res.status(200).json({
      message: message.OTP_VERIFIED,
      verified: true,
    });
    await User.updateOne({ email }, { verified: true });
    await deleteOtp(email);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ errrorMessage: message.OTP_NOT_VERIFIED, error: error });
  }
};

const resetPasswordOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        errorMessage: message.BAD_REQUEST,
      });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        errorMessage: message.USER_NOT_EXIST,
      });
    }
    if (!existingUser.verified) {
      return res.status(400).json({
        errorMessage: message.USER_NOT_VERIFIED,
      });
    }
    
    const createdOtp = await sendOtp(email);
    res.status(200).json({
      message: message.OTP_SENT,
    });
  } catch (error) {
    res.status(400).json({
      errorMessage: message.BAD_REQUEST,
    });
  }
};

module.exports = { createOtp, verifyOtp,resetPasswordOtp };
