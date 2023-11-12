const Joi = require('joi');

const jaminanValidator = Joi.object({
  tax: Joi.number().required(),
  subtotal: Joi.number().required(),
  jaminan: Joi.number().required(),
  deposit: Joi.number().required(),
});

const statusValidator = Joi.object({
    status: Joi.string().required()
})

module.exports = jaminanValidator, statusValidator;