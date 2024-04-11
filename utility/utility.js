const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
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
  hashed_password: async (password) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return hashedPassword;
    } catch (error) {
      throw error;
    }
  },
  comparePassword: async (data, password) => {
    try {
      return await bcrypt.compare(data, password);
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
};
