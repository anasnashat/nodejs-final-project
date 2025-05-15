const express = require('express');
const { SignUp, Login, verifiyEmail, forgetPassword, resetPassword, approveUser } = require('../controllers/authController');
const upload = require('../utils/upload');
const {  signupVaildation, loginVaildation, forgetPasswordVaildation } = require('../middlewares/vaildation');
const router = express.Router();

router.post('/signup',upload.single('profileImage'),signupVaildation, SignUp);
router.post('/login', loginVaildation,Login);
router.get('/verify-email', verifiyEmail);
router.post('/forget-password', forgetPasswordVaildation,forgetPassword)
router.post('/reset-password', resetPassword)
router.patch('/:id/approve',approveUser)

module.exports = router;