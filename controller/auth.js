const User = require("../models/user");
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
      password: await utils.hashed_password(password),
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
  }
};

const loginUser = async (req, res, next) => {
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
  const verifyUser = utils.comparePassword(password, userCredentials.password);
  if (!verifyUser) {
    return res.status(401).json({
      errorMessage: message.INVALID_CREDENTIALS,
    });
  }
  const token = await utils.jwtsign(userCredentials._id, process.env.SECRET_KEY);
  console.log(token,'///////////')
  res.json({
    message: message.USER_LOGEDIN,
    user: email,
    token: token,
  });
};

module.exports = { createUser, loginUser };
