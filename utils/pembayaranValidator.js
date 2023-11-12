const Joi = require('joi');

const jaminanValidator = Joi.object({
  jaminan: Joi.number().required()
});

const statusValidator = Joi.object({
    status: Joi.string().required()
})

module.exports = jaminanValidator, statusValidator;