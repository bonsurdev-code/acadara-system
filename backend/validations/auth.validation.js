import Joi from "joi";

export const registerSchema = Joi.object({
  usr_name: Joi.string().min(3).max(100).required(),
  usr_email: Joi.string().email().required(),
  usr_password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
  usr_email: Joi.string().email().required(),
  usr_password: Joi.string().required(),
});