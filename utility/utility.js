const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
module.exports = {
  isEmail: (value) => {
    let re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
  },

  isPhone: (value) => {
    let intRegex = /[0-9 -()+]+$/;
    return intRegex.test(value);
  },
  hashData: async (data) => {
    try {
      const hashedPassword = await bcrypt.hash(data, 10);
      return hashedPassword;
    } catch (error) {
      throw error;
    }
  },
  comparehashedData: async (HashedData, data) => {
    try {
      return await bcrypt.compare(HashedData, data);
    } catch (error) {
      console.log(error);
    }
  },
  jwtsign: async (id, secretKey) => {
    try {
      const token = jwt.sign({ id: id }, secretKey);
      return token;
    } catch (error) {
      console.log(error);
    }
  },
  generateOtp: async () => {
    try {
      return (otp = `${Math.floor(1000 + Math.random() * 9000)}`);
    } catch (error) {
      throw error;
    }
  },

};
