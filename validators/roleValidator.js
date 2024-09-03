const Joi = require('joi');

exports.createRoleValidator = Joi.object({
  roleName: Joi.string().required(),
  accessModules: Joi.array().optional(),
  active: Joi.boolean().default(true),
});

exports.updateRoleValidator = Joi.object({
  roleName: Joi.string(),
  accessModules: Joi.array().optional(),
  active: Joi.boolean(),
});
