const Joi = require('joi');

const detailKamarValidator = Joi.object({
    kamarId: Joi.number().required(),
    nomor_kamar: Joi.number().required(),
  });
  
  module.exports = detailKamarValidator;