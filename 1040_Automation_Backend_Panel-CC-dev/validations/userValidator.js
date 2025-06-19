const Joi = require('joi');

const userCreateSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(), // just a string, not email
    phone_number: Joi.string().optional().allow(''),
    email: Joi.string().email().required(),
    role_id: Joi.number().integer().required(),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match.'
    }),
});

function validateUser(data) {
    return userCreateSchema.validate(data, { abortEarly: false });
}
function validateUserUpdate(data) {
    const userUpdateSchema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(), // just a string, not email
        phone_number: Joi.string().optional().allow(''),
        email: Joi.string().email().required(),
        role_id: Joi.number().integer().required(),
    });

    return userUpdateSchema.validate(data, { abortEarly: false });
}

module.exports = { validateUser, validateUserUpdate };