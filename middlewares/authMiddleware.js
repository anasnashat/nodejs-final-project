const User = require("../models/User");
const AppError = require("../utils/AppError");
const Jwt = require("jsonwebtoken");
const verifiyUser = async (req, res, next) => {
  try {
      const token = req.headers.authorization?.split(" ")[1];
    console.log(token)
    if (!token) {
      return next(new AppError("Invaild Credientals", 400));
    }
    const secret = process.env.JWT_TOKEN;
    if (!secret) {
      return next(new AppError("JWt not Found", 404));
    }
    const payload = Jwt.verify(token, secret);
    console.log(payload)
    if (!payload) {
      return next(new AppError("Unathorized Uer", 403));
    }
      const user = await User.findOne({ email: payload.email });
      console.log(user)
    if (!user) {
      return next(new AppError("User Not Found", 404));
    }
    req.user = user;
    next();
  } catch (err) {
    next(new AppError(err.message, 505));
  }
};

const authorizeAdmin = async (req, res, next) => {
  const userRole = req.user.role;
  if (userRole !== "admin") {
    return res.status(403).json({ error: "Access Denied" });
  }
  next();
};

module.exports = { verifiyUser, authorizeAdmin };
