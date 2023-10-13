const Joi = require("joi");

const tarifValidator = Joi.object({
  harga: Joi.number().required()
});

// const tarifRangeHargaValidator = Joi.object({
//   min: Joi.number().required(),
//   max: Joi.number().required()
// });

module.exports = tarifValidator;
