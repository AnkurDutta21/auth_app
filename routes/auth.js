const express = require('express')
const auth = require('../controller/auth')
const router = express.Router()

router.post('/create',auth.createUser)
router.post('/login',auth.loginUser)

module.exports = router