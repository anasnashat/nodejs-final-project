const Joi = require("joi");
const AppError = require("../utils/AppError");

const signupSchema = Joi.object({
  name: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  repassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Password confirmation does not match password"
  }),
  role: Joi.string().valid("user", "admin").default("user"),
}).with("password", "repassword");

const vaildateUser = async (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    const messages = error.details.map((err) => err.message);
    return next(new AppError(error.details[0].message, 400, messages));
  }
  next();
};
module.exports = { vaildateUser };
