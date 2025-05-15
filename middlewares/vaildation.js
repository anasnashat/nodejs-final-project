const Joi = require("joi");
const AppError = require("../utils/AppError");


const signupSchema = Joi.object({
  name: Joi.string().min(5).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  repassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Password confirmation does not match password",
  }),
  role: Joi.string().valid("user", "admin").default("user"),
 
}).with("password", "repassword");

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const signupVaildation = async (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    const messages = error.details.map((err) => err.message);
    return next(new AppError(error.details[0].message, 400, messages));
  }
  next();
};

const loginVaildation = async (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    const messages = error.details.map((err) => err.message);
    return next(new AppError(error.details[0].message, 400, messages));
  }
  next();
};

const forgetPasswordVaildation = async (req, res, next) => {
  const { error } = forgetPasswordSchema.validate(req.body);
  if (error) {
    const messages = error.details.map((err) => err.message);
    return next(new AppError(error.details[0].message, 400, messages));
  }
  next();
};
module.exports = { signupVaildation, loginVaildation,forgetPasswordVaildation };
