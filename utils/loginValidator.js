const Joi = require('joi');

const loginValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = loginValidator;