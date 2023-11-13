const Joi = require('joi');

const statusPembayaranValidator = Joi.object({
    status: Joi.string().required(),

  });
  
  module.exports = statusPembayaranValidator;