const Joi = require('joi');

const kamarValidator = Joi.object({
    jenisKamar: Joi.string().required(),
    jenisBed: Joi.string().required(),
    kapasitas: Joi.number().required(),
    luas: Joi.number().required(),
    fasilitas: Joi.string().required(),
    jumlah_bed: Joi.number().required()
  });
  
  module.exports = kamarValidator;