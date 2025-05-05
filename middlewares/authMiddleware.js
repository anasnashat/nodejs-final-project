const User = require("../models/User");
const AppError = require("../utils/AppError")
const Jwt = require('jsonwebtoken');
const verifiyUser = async(req, res, next) =>{
    try {
        const token = req.headers.authorization;
        if (!token) {
            return next(new AppError("Invaild Credientals", 400));
        }
        const secret = process.env.JWT_TOKEN;
        if (!secret) {
            return next(new AppError("JWt not Found",404))
        }
        const payload = Jwt.verify(token, secret);
        if (!payload) {
            return next(new AppError('Unathorized Uer', 403));
        }
        const user = await User.findOne({ email: payload.email });
        if (!user) {
            return next(new AppError("User Not Found", 404));
        }
        req.user = user;
        next();
    } catch (err) {
        next(new AppError(err.message,505))
    }
}

module.exports={verifiyUser}