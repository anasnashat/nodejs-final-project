const express = require('express');
const { SignUp, Login, verifiyEmail, forgetPassword, resetPassword } = require('../controllers/authController');
const upload = require('../utils/upload');
const { vaildateUser } = require('../middlewares/vaildation');
const router = express.Router();

router.post('/signup',upload.single('profileImage'),vaildateUser, SignUp);
router.post('/login', Login);
router.get('/verify', verifiyEmail)
router.post('/forget-password', forgetPassword)
router.post('/reset-password',resetPassword)

module.exports = router;