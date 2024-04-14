require("dotenv").config();
const nodemailer = require("nodemailer");
console.log(process.env.EMAIL,process.env.PASSWORD)
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("success", success);
  }
});

 const sendEmail = async (mailOptions) => {
    console.log("mailOptions: ", mailOptions);
    try {
      await transporter.sendMail(mailOptions);
      return;
    } catch (error) {
      throw Error;
    }
  }
  
  module.exports = {sendEmail};
