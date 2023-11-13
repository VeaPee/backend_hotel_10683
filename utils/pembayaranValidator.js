const Joi = require('joi');

const jaminanValidator = Joi.object({
  reservasiId: Joi.number().required(),
  no_invoice: Joi.string().required(),
  tax: Joi.number().required(),
  subtotal: Joi.number().required(),
  jaminan: Joi.number().required(),
  deposit: Joi.number().required(),
  cash: Joi.number().required(),
});


module.exports = jaminanValidator;