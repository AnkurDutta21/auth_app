require("dotenv").config();
const OTP = require("../models/otp");
const mail = require("../utility/mail");
const { sendEmail } = require("../utility/mail");
const utils = require("../utility/utility");
const { EMAIL } = process.env;
const bcrypt = require("bcrypt");


const sendOtp = async (email) => {
  try {
    if (!email) {
      throw Error("Email not provided");
    }
    await OTP.deleteOne({ email });
    const generatedOtp = await utils.generateOtp();
    console.log(generatedOtp);
    const mailOptions = {
      from: EMAIL,
      to: email,
      subject: "new otp verification for node app",
      html: `<p>verify your email</p><p style="color:red">${generatedOtp}</p><p>expires in 1 hour</p>`,
    };
    await sendEmail(mailOptions);
    const hashedOTP =await utils.hashData(generatedOtp, 10);
    const newOTP = new OTP({
      email,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000 * +1,
    });
    const OTPRecord = await newOTP.save();
    return OTPRecord;
  } catch (error) {
    console.log(error);
  }
};

const validateOtp = async (email, otp) => {
  try {
    if (!email && !otp) {
      throw Error("empty email or otp");
    }
    const savedOtp = await OTP.findOne({ email });

    if (!savedOtp) {
      throw Error("user not found");
    }
    const { expiresAt } = savedOtp;
    if (expiresAt < Date.now()) {
      await OTP.deleteOne({ email });
      throw Error("code has expired");
    }
    const hashedOTP = savedOtp.otp;
    console.log(otp,hashedOTP)
    const validate = await utils.comparehashedData(otp, hashedOTP);
    return validate
  } catch (error) {
    throw error;
  }
};

const deleteOtp = async(email)=>{
  try {
    await OTP.deleteOne({email})
  } catch (error) {
    throw error
  }
}

module.exports = { sendOtp,validateOtp,deleteOtp };
