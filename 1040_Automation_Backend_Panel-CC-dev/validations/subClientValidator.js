const Joi = require('joi');

// Helper schema for client object if provided instead of client_id
const clientSchema = Joi.object({
    name: Joi.string().required(),
    software_type_id: Joi.number().integer().positive().allow(null),
    network_access_type_id: Joi.number().integer().positive().allow(null)
});

// Helper schema for dependents array
const dependentSchema = Joi.object({
    name: Joi.string().required(),
    ssn: Joi.string().pattern(/^\d{3}-?\d{2}-?\d{4}$/).allow(null, '')
});

// Main subclient schema
const createSubClientSchema = Joi.object({
    // Client Reference (either client_id or client object required)
    client_id: Joi.number().integer().positive(),
    client: Joi.when('client_id', {
        is: Joi.exist(),
        then: Joi.forbidden(),
        otherwise: clientSchema.required()
    }),

    // Personal Information (Required)
    firstName: Joi.string().required().trim(),
    lastName: Joi.string().required().trim(),
    middleInitial: Joi.string().max(1).allow(null, ''),
    suffix: Joi.string().allow(null, ''),
    dob: Joi.date().less('now').allow(null)
        .messages({
            'date.base': 'Date of birth must be a valid date',
            'date.less': 'Date of birth must be in the past'
        }),
    occupation: Joi.string().allow(null, ''),
    email: Joi.string().email().allow(null, ''),
    cell: Joi.string().allow(null, ''),
    ssn: Joi.string().pattern(/^\d{3}-?\d{2}-?\d{4}$/).allow(null, ''),

    // Spouse Information (Optional)
    spouse_ssn: Joi.string().pattern(/^\d{3}-?\d{2}-?\d{4}$/).allow(null, ''),
    spouseFirstName: Joi.string().allow(null, ''),
    spouseMiddleInitial: Joi.string().max(1).allow(null, ''),
    spouseLastName: Joi.string().allow(null, ''),
    spouseSuffix: Joi.string().allow(null, ''),
    spouseDOB: Joi.date().less('now').allow(null)
        .messages({
            'date.base': 'Spouse date of birth must be a valid date',
            'date.less': 'Spouse date of birth must be in the past'
        }),
    spouseOccupation: Joi.string().allow(null, ''),
    spousePhone: Joi.string().allow(null, ''),
    spouseEmail: Joi.string().email().allow(null, ''),

    // Address Information
    street: Joi.string().allow(null, ''),
    apt: Joi.string().allow(null, ''),
    city: Joi.string().allow(null, ''),
    state: Joi.string().uppercase().allow(null, ''),
    zip: Joi.string().pattern(/^\d{5}(-\d{4})?$/).allow(null, ''),
    county: Joi.string().allow(null, ''),
    isForeign: Joi.boolean().default(false),
    province: Joi.string().allow(null, ''),
    country: Joi.string().allow(null, ''),
    postalCode: Joi.string().allow(null, ''),

    // Tax Information
    filing_status_id: Joi.number().integer().positive().allow(null),
    taxYear: Joi.number().integer().min(2000).max(2100).default(2025),
    residentialState: Joi.string().uppercase().allow(null, ''),

    // Dependents
    dependents: Joi.array().items(dependentSchema).default([])
});

// Schema for updating a subclient
const updateSubClientSchema = createSubClientSchema.fork(
    ['firstName', 'lastName', 'client_id'],
    (schema) => schema.optional()
);

module.exports = {
    createSubClientSchema,
    updateSubClientSchema
};
