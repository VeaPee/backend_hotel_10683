const Joi = require('joi');

const customerValidator = Joi.object({
    akunId: Joi.number().required(),
    jenis_customer: Joi.string().required(),
    nama_customer: Joi.string().required(),
    nama_institusi: Joi.string().required(),
    nomor_identitas: Joi.string().required(),
    nomor_telepon: Joi.string().required(),
    email: Joi.string().email().required(),
    alamat: Joi.string().required(),
  });
  
  

  module.exports = customerValidator;