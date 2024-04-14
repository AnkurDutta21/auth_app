const User = require("../models/user");
const { validateOtp, deleteOtp } = require("../services/otp");
const message = require("../utility/message");
const utils = require("../utility/utility");

const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        errorMessage: message.BAD_REQUEST,
      });
    }
    const isUserExist = await User.findOne({ email: email });
    if (isUserExist) {
      return res.status(409).json({
        errorMessage: message.USER_EXIST,
      });
    }
    // if(!utils.isEmail(email)){
    //   return res.status(400).json({
    //     errorMessage:message.BAD_REQUEST
    //   })
    // }
    const userCredentials = new User({
      email,
      password: await utils.hashData(password),
    });

    userCredentials
      .save()
      .then(() => {
        res.json({
          message: message.USER_CREATED,
        });
      })
      .catch((error) => {
        console.error("Error saving user:", error);
        res.status(500).json({
          errorMessage: message.INTERNAL_SERVER_ERROR,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        errorMessage: message.BAD_REQUEST,
      });
    }
    const userCredentials = await User.findOne({ email });
    if (!userCredentials) {
      return res.status(401).json({
        errorMessage: message.USER_NOT_EXIST,
      });
    }
    const emailVerified = userCredentials.verified;
    if (!emailVerified) {
      return res.status(401).json({
        errorMessage: message.USER_NOT_VERIFIED,
      });
    }
    const verifyUser = await utils.comparehashedData(
      password,
      userCredentials.password
    );
    if (!verifyUser) {
      return res.status(401).json({
        errorMessage: message.INVALID_CREDENTIALS,
      });
    }
    const token = await utils.jwtsign(
      userCredentials._id,
      process.env.SECRET_KEY
    );
    res.json({
      message: message.USER_LOGEDIN,
      user: email,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    if (!email && !otp && !password) {
      return res.status(400).json({
        errorMessage: message.BAD_REQUEST,
      });
    }
    const isOTPVerified = await validateOtp(email, otp)
   
    if (!isOTPVerified) {
      return res.status(400).json({
        errorMessage: message.OTP_NOT_VERIFIED,
      });
    }
    console.log(password,'lllll')
    const hashedPassword = await utils.hashData(password);
    await User.updateOne({ email }, { password: hashedPassword });
    await deleteOtp(email);
    res.status(200).json({
      message: message.PASSWORD_CHANGED,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

module.exports = { createUser, loginUser, resetPassword };
