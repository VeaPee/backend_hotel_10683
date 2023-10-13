const Joi = require("joi");

const tarifValidator = Joi.object({
  seasonId: Joi.number().required(),
  kamarId: Joi.number().required(),
  harga: Joi.number().required()
});

// const tarifRangeHargaValidator = Joi.object({
//   min: Joi.number().required(),
//   max: Joi.number().required()
// });

module.exports = tarifValidator;
