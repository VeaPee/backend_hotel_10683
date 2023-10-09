const Joi = require('joi');
const Akun = require('@prisma/client').Akun;

const akunValidator = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(5).max(20).required().messages({
      "string.min": "Password harus 5-20 digit",
      "string.max": "Password harus 5-20 digit"
    }),
  });
  
  module.exports = akunValidator;