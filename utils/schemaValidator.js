const Joi = require("joi");
//auth schemas
const authRSchema = Joi.object({
  name: Joi.string().alphanum().min(5).max(30).required(),

  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  email: Joi.string().email().lowercase().required(),
});
const authLSchema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  email: Joi.string().email().lowercase().required(),
});
const forgotSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});
const resetPasswordSchema = Joi.object({
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  confirmPassword: Joi.ref("password"),
});

//product schema
const productValidationSchema = Joi.object({
  name: Joi.string().alphanum().min(5).max(120).required(),
  price: Joi.number().integer().required(),
  stock: JoiJoi.number().integer().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  brand: Joi.string().required(),
});

module.exports = {
  authLSchema,
  authRSchema,
  resetPasswordSchema,
  forgotSchema,
  productValidationSchema,
};
