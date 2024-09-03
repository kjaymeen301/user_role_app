const Joi = require('joi');

exports.signupValidator = Joi.object({
  username: Joi.string().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().optional()
}); 

exports.loginValidator = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required()
});

exports.updateUserValidator = Joi.object({
  filter: Joi.object().required(),
  update: Joi.object().required()
});

exports.updateManyUsersDifferentValidator = Joi.object({
  updates: Joi.array().items(
    Joi.object({
      filter: Joi.object().required(),
      updateData: Joi.object().required()
    })
  ).required()
});
