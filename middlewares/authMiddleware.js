const User = require("../models/User");
const AppError = require("../utils/AppError");
const Jwt = require("jsonwebtoken");

const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      return next(new AppError("Invalid Credentials", 400));
    }

    const secret = process.env.JWT_SECRET || process.env.JWT_TOKEN;
    if (!secret) {
      return next(new AppError("JWT Secret Not Found", 404));
    }

    let payload;
    try {
      payload = Jwt.verify(token, secret);
    } catch (err) {
      return next(new AppError("Invalid or Expired Token", 401));
    }

    const user = await User.findById(payload.id); // Lookup user by ID
    console.log("Authenticated User:", user);

    if (!user) {
      return next(new AppError("User Not Found", 404));
    }

    req.user = user;
    next();
  } catch (err) {
    next(new AppError(err.message, 500));
  }
};

const authorizeAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Access Denied" });
  }
  next();
}; 

module.exports = { verifyUser, authorizeAdmin };
