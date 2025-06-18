// Constants for client registration forms

export const filingStatusOptions = [
  'Single',
  'Married Filing Jointly',
  'Married Filing Separately',
  'Head of Household',
  'Qualifying Surviving Spouse'
];

export const relationshipOptions = [
  'SON',
  'DAUGHTER',
  'FOSTER CHILD',
  'GRANDCHILD',
  'STEPCHILD',
  'GRANDPARENT',
  'PARENT',
  'BROTHER',
  'HALF BROTHER',
  'STEPBROTHER',
  'SISTER',
  'HALF SISTER',
  'STEPSISTER',
  'AUNT',
  'UNCLE',
  'NEPHEW',
  'NIECE',
  'NONE',
  'OTHER'
];

export const countryOptions = [
  { label: 'Afghanistan', value: 'AF' },
  { label: 'Albania', value: 'AL' },
  { label: 'Algeria', value: 'DZ' }
  // ... add all countries except US ...
];

export const taxYearOptions = [
  '2020',
  '2021',
  '2022',
  '2023',
  '2024',
  '2025',
  '2026'
];

export const initialDependent = {
  firstName: '',
  middleName: '',
  lastName: '',
  dob: '',
  ssn: '',
  months: '',
  relationship: ''
};
