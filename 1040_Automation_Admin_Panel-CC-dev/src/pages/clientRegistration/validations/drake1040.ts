import * as Yup from 'yup';

const nameRegex = /^[A-Za-z .'-]+$/;
const phoneRegex = /^\d{10,15}$/;
const middleInitialRegex = /^[A-Za-z]?$/;

const dependentSchema = Yup.object().shape({
  firstName: Yup.string()
    .matches(
      nameRegex,
      'First Name must contain only letters, spaces, hyphens, apostrophes, or periods'
    )
    .required('Dependent First Name is required'),
  middleName: Yup.string()
    .matches(
      nameRegex,
      'Middle Name must contain only letters, spaces, hyphens, apostrophes, or periods'
    )
    .nullable(),
  lastName: Yup.string()
    .matches(
      nameRegex,
      'Last Name must contain only letters, spaces, hyphens, apostrophes, or periods'
    )
    .required('Dependent Last Name is required'),
  dob: Yup.string().required('Dependent Date of Birth is required'),
  ssn: Yup.string().required('Dependent SSN/ITIN is required'),
  months: Yup.string().required('Months is required'),
  relationship: Yup.string().required('Relationship is required')
});

export const drake1040Schema = Yup.object().shape({
  // Taxpayer Info
  taxYear: Yup.string()
    .required('Tax Year is required')
    .matches(/^\d{4}$/, 'Tax Year must be a 4-digit year')
    .test('valid-year', 'Tax Year must be between 1900 and 2100', (value) => {
      if (!value) return false;
      const year = Number(value);
      return year >= 1900 && year <= 2100;
    }),
  residentialState: Yup.string().required('Residential State is required'),
  filingStatus: Yup.string().required('Filing Status is required'),
  firstName: Yup.string()
    .matches(
      nameRegex,
      'First Name must contain only letters, spaces, hyphens, apostrophes, or periods'
    )
    .required('First Name is required'),
  middleInitial: Yup.string()
    .matches(middleInitialRegex, 'Middle Initial must be a single letter')
    .nullable(),
  lastName: Yup.string()
    .matches(
      nameRegex,
      'Last Name must contain only letters, spaces, hyphens, apostrophes, or periods'
    )
    .required('Last Name is required'),
  suffix: Yup.string().nullable(),
  dob: Yup.string().nullable(),
  ssn: Yup.string().required('Taxpayer SSN/ITIN is required'),
  occupation: Yup.string().nullable(),
  email: Yup.string().email('Invalid email address').nullable(),
  cell: Yup.string()
    .matches(phoneRegex, 'Phone number must be 10-15 digits')
    .nullable(),

  // Spouse Info
  spouseFirstName: Yup.string().when('filingStatus', (filingStatus, schema) => {
    const status = Array.isArray(filingStatus) ? filingStatus[0] : filingStatus;
    return status === 'Married Filing Jointly'
      ? schema
          .matches(
            nameRegex,
            'First Name must contain only letters, spaces, hyphens, apostrophes, or periods'
          )
          .required('Spouse First Name is required')
      : schema.nullable();
  }),
  spouseMiddleInitial: Yup.string()
    .matches(middleInitialRegex, 'Middle Initial must be a single letter')
    .nullable(),
  spouseLastName: Yup.string().when('filingStatus', (filingStatus, schema) => {
    const status = Array.isArray(filingStatus) ? filingStatus[0] : filingStatus;
    return status === 'Married Filing Jointly'
      ? schema
          .matches(
            nameRegex,
            'Last Name must contain only letters, spaces, hyphens, apostrophes, or periods'
          )
          .required('Spouse Last Name is required')
      : schema.nullable();
  }),
  spouseSuffix: Yup.string().nullable(),
  spouseDOB: Yup.string().nullable(),
  spouseSSN: Yup.string().when('filingStatus', (filingStatus, schema) => {
    const status = Array.isArray(filingStatus) ? filingStatus[0] : filingStatus;
    return status === 'Married Filing Jointly'
      ? schema.required('Spouse SSN/ITIN is required')
      : schema.nullable();
  }),
  spouseOccupation: Yup.string().nullable(),
  spouseEmail: Yup.string().email('Invalid email address').nullable(),
  spousePhone: Yup.string()
    .matches(phoneRegex, 'Phone number must be 10-15 digits')
    .nullable(),

  // Dependents
  dependents: Yup.array().of(dependentSchema),

  // Address Info
  isForeign: Yup.boolean(),
  street: Yup.string().required('Street Address is required'),
  apt: Yup.string().nullable(),
  city: Yup.string().nullable(),
  state: Yup.string().when('isForeign', (isForeign, schema) =>
    isForeign ? schema.nullable() : schema.required('State is required')
  ),
  zip: Yup.string().when('isForeign', (isForeign, schema) =>
    isForeign ? schema.nullable() : schema.required('ZIP Code is required')
  ),
  county: Yup.string().when('isForeign', (isForeign, schema) =>
    isForeign ? schema.nullable() : schema.required('County is required')
  ),
  province: Yup.string().when('isForeign', (isForeign, schema) =>
    isForeign
      ? schema.required('Province/State is required')
      : schema.nullable()
  ),
  country: Yup.string().when('isForeign', (isForeign, schema) =>
    isForeign ? schema.required('Country is required') : schema.nullable()
  ),
  postalCode: Yup.string().when('isForeign', (isForeign, schema) =>
    isForeign ? schema.required('Postal Code is required') : schema.nullable()
  ),

  // Company/Client Info
  companyName: Yup.string().required('Company Name is required'),
  clientName: Yup.string().required('Client Name is required')
});
