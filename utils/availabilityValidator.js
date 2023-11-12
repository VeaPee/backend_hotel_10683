const Joi = require("joi");

const availabilityValidator = Joi.object({
  tanggalAwal: Joi.date().required().messages({
    "string.base": "Tanggal Awal Harus Ada",
  }),
  tanggalAkhir: Joi.date().min(Joi.ref("tanggalAwal")).required().messages({
    "string.pattern.base": "Tanggal Akhir harus lebih dari atau sama dengan Tanggal Awal",
    "string.min": "Tanggal Akhir harus lebih dari atau sama dengan Tanggal Awal",
  }),
});

module.exports = availabilityValidator;
