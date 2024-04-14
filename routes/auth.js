const express = require("express");
const auth = require("../controller/auth");
const verifyToken = require("../middleware/authHandler");
const router = express.Router();

// LogIn and SignUp
router.post("/create", auth.createUser);
router.post("/login", auth.loginUser);

// Reset & Update Password

router.post("/resetPassword",auth.resetPassword)


router.get("/protected", verifyToken, (req, res, next) => {
  res.status(200).json({
    message: "ur in a private route",
    user: req.userId,
  });
});

module.exports = router;
