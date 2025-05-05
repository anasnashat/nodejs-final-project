const User = require("../models/User");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");
const sendEmail = require("../utils/EmailService");
const crypto = require("crypto");
require("dotenv").config();

const SignUp = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return next(new AppError("Please Provide All Requirements", 505));
    }

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return next(new AppError("Please Login this email already Exist", 400));
    }
    const verifiedCode = crypto.randomBytes(3).toString("hex");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
      verifiedCode: verifiedCode,
      verifiedCodeVaildation: Number(Date.now() + 30 * 60 * 60 * 1000),
    });
   
    const verificationLink = `http://localhost:${process.env.PORT}/api/auth/users/verify?email=${email}&code=${verifiedCode}`;

    await sendEmail(
      email,
      "Verifiy Email",
      `Click to this to verifiy your Account :${verificationLink}`
    );

    const userResponse = user.toObject();

    res.status(201).json({
      message: "User register successfully , please check your email account",
      data: userResponse,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError("can't find this user", 404));
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return next(new AppError("Password is not correct", 404));
    }
    const secret = process.env.JWT_TOKEN;
    if (!secret) {
      return next(new AppError("Jwt Not Found", 404));
    }
    //SEND TOKEN USING JWT
    const token = Jwt.sign({ email: user.email }, secret);
    res.send({
      status: "success",
      token,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

const verifiyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.query;
    const user = await User.findOne({ email }).select(
      "+verifiedCode +verifiedCodeVaildation"
    );
    if (!user) {
      return next(new AppError("User Not Found", 404));
    }
    console.log(Date.now(), user.verifiedCodeVaildation);
    if (
      user.verifiedCode != code ||
      Date.now() > Number(user.verifiedCodeVaildation)
    ) {
      return next(new AppError("Invaild or expired verifiation code", 400));
    }
    user.verified = true;
    user.verifiedCode = null;
    user.verifiedCodeVaildation = null;
    await user.save();
    res.status(200).json({
      message: "Account Verified Successfully",
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select(
      "+forgetpasswordCode +forgetPasswordVaildation"
    );
    if (!user) {
      return next(new AppError("User Not Found", 404));
    }
    const resetCode = crypto.randomBytes(3).toString("hex");
    user.forgetpasswordCode = resetCode;
    user.forgetPasswordVaildation = Date.now() + 30 * 60 * 60 * 1000;
    user.save();
    await sendEmail(
      email,
      "Password Reset",
      `Use this code to reset Your Password ${resetCode}`
    );
    res.status(200).json({
      message: "Password reset Successfully",
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email }).select(
      "+forgetpasswordCode +forgetPasswordVaildation"
    );
    if (!user) {
      return next(new AppError("User Not Found", 404));
    }
    console.log(Date.now(), user.forgetPasswordVaildation);
    if (
      user.forgetpasswordCode != code ||
      Date.now() > user.forgetPasswordVaildation
    ) {
      return next(new AppError("Invaild or Expired code", 404));
    }
    const newHasedPassword = await bcrypt.hash(newPassword, 10);
    user.password = newHasedPassword;
    user.forgetpasswordCode = null;
    user.forgetPasswordVaildation = null;
    await user.save();
    res.status(200).json({
      message: "Password Reset Successfully",
      data: user,
    });
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

module.exports = { SignUp, Login, verifiyEmail, forgetPassword, resetPassword };
