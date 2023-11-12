const Joi = require('joi');

const detailReservasiFasilitasValidator = Joi.object({
    reservasiId: Joi.number().required(),
    fasilitasId: Joi.number().required(),
    jumlah: Joi.number().required(),
    subtotal: Joi.number().required()
  });
  
  module.exports = detailReservasiFasilitasValidator;