const jwt = require("jsonwebtoken");
const message = require("../utility/message");

const secretKey = process.env.SECRET_KEY;

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];
  console.log(token)
  if (!token) {
    return res.status(403).json({
      message: message.TOKEN_REQUIRED,
    });
  }

  try {
    const decodedToken = await jwt.verify(token, secretKey);
    req.userId = decodedToken;
    console.log(req.userId)
  } catch (error) {
    return res.status(401).json({
      errorMessage: message.INVALID_TOKEN,
    });
  }
  return next()
};

module.exports = verifyToken
