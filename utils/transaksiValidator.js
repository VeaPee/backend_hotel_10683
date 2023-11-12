const Joi = require('joi');

const transaksiValidator = Joi.object({
    pegawaiId: Joi.number().required(),
    customerId: Joi.number().required(),
    tanggal_reservasi: Joi.date().required(),
    check_in: Joi.date().required(),
    check_out: Joi.date().required(),
    jumlahDewasa: Joi.number().required(),
    jumlahAnakAnak: Joi.number().required(),
    status: Joi.string().required(),
    prefix_reservasi: Joi.string().required(),
  });
  
  

  module.exports = transaksiValidator;