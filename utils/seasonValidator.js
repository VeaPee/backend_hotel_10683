const Joi = require("joi");

const today = new Date();
const duaBulan = new Date().setMonth(today.getMonth() + 2);

const seasonValidator = Joi.object({
  tanggal_awal: Joi.date().min(duaBulan).required().messages({
    "string.pattern.base": "Tanggal Awal paling lambat 2 bulan sebelum berlaku",
    "string.min": "Tanggal Awal paling lambat 2 bulan sebelum berlaku",
  }),
  tanggal_akhir: Joi.date().min(Joi.ref("tanggal_awal")).required().messages({
    "string.pattern.base": "Tanggal Akhir harus lebih dari atau sama dengan Tanggal Awal",
    "string.min": "Tanggal Akhir harus lebih dari atau sama dengan Tanggal Awal",
  }),
  perubahan_harga: Joi.number().required(),
  jenis_season: Joi.string().required().messages({
    "string.pattern.base": "Jenis Season tidak boleh kosong",
  }),
});

module.exports = seasonValidator;
