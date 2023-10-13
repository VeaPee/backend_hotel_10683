const Joi = require('joi');

const today = new Date()
const duaBulan = new Date().setMonth(today.getMonth() + 2)

const seasonValidator = Joi.object({
    harga: Joi.number().required(),
    tanggal_awal: Joi.date().min(duaBulan).required().messages({ 
      "string.pattern.base": "Tanggal Awal paling lambat 2 bulan sebelum berlaku" 
    }),
    tanggal_akhir: Joi.date().min(Joi.ref('tanggal_awal')).required().messages({ 
      "string.pattern.base": "Tanggal Akhir harus lebih dari sama dengan Tanggal Awal" 
    }),
    perubahan_harga: Joi.number().required()
  });
  
  module.exports = seasonValidator;