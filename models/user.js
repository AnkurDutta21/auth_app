const mongoose = require("mongoose");

const sexEnum = ["male", "female", "others"];

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
  },
  age: {
    type: String,
  },
  sex: {
    type: String,
    enum: sexEnum,
  },
  profileUrl: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
