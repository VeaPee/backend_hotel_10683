const Joi = require('joi');

const fasilitasValidator = Joi.object({
    nama_fasilitas: Joi.string().required(),
    satuan: Joi.number().required(),
    harga: Joi.number().required()
  });
  
  module.exports = fasilitasValidator;