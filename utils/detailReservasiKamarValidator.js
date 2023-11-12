const Joi = require('joi');

const detailReservasiKamarValidator = Joi.object({
    reservasiId: Joi.number().required(),
    kamarId: Joi.number().required(),
    jumlah: Joi.number().required(),
    subtotal: Joi.number().required()
  });
  
  module.exports = detailReservasiKamarValidator;