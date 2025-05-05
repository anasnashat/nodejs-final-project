const express = require('express');
const { SignUp, Login, verifiyEmail, forgetPassword, resetPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', SignUp);
router.post('/login', Login);
router.get('/verify', verifiyEmail)
router.post('/forget-password', forgetPassword)
router.post('/reset-password',resetPassword)

module.exports = router;