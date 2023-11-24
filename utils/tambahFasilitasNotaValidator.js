const Joi = require('joi');

const tambahFasilitasNotaValidator = Joi.object({
    reservasiId: Joi.number().required(),
    subtotal: Joi.number().required(),
    cash: Joi.number().required(),
    tax: Joi.number().required(),
  });
  
  module.exports = tambahFasilitasNotaValidator;