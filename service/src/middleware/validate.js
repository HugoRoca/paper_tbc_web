const Joi = require('joi');

/**
 * Middleware de validación usando Joi
 */
const validate = (schema) => {
  return async (ctx, next) => {
    const { body, query, params } = ctx.request;
    
    // Validar según el tipo de schema
    const dataToValidate = {
      body,
      query,
      params
    };

    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        message: 'Error de validación',
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      };
      return;
    }

    // Reemplazar los datos validados
    if (value.body) ctx.request.body = value.body;
    if (value.query) ctx.request.query = value.query;
    if (value.params) ctx.request.params = value.params;

    await next();
  };
};

module.exports = validate;
