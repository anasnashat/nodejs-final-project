const express = require('express');
const { SignUp, Login, verifiyEmail, forgetPassword, resetPassword } = require('../controllers/authController');
const upload = require('../utils/upload');
const router = express.Router();

router.post('/signup',upload.single('profileImage'), SignUp);
router.post('/login', Login);
router.get('/verify', verifiyEmail)
router.post('/forget-password', forgetPassword)
router.post('/reset-password',resetPassword)

module.exports = router;