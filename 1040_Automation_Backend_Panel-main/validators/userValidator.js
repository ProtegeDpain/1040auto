const Joi = require('joi');

const userSchema = Joi.object({
    full_name: Joi.string().required(),
    username: Joi.string().email().required(),
    phone_number: Joi.string().optional().allow(''),
    email: Joi.string().email().required(),
    role_id: Joi.number().integer().required(),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match.'
    }),
});

function validateUser(data) {
    return userSchema.validate(data, { abortEarly: false });
}

module.exports = { validateUser };