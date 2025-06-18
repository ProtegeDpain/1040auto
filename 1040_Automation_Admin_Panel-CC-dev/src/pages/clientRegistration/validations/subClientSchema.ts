import * as Yup from 'yup';

export const stepSchemas = [
  Yup.object().shape({
    clientId: Yup.number().required("Client is required"),
    taxYear: Yup.number().required("Tax Year is required"),
    residentialState: Yup.string().required("Residential State is required"),
    filingStatus: Yup.string().required("Filing Status is required"),
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    ssn: Yup.string()
        .required("SSN is required")
        .matches(/^(?!000|666|9\d{2})\d{3}-(?!00)\d{2}-(?!0000)\d{4}$/, "Invalid SSN format"),
  }),
  Yup.object().shape({
    spouseFirstName: Yup.string().when('filingStatus', {
      is: 'Married Filing Jointly',
      then: (schema) => schema.required("Spouse first name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    spouseLastName: Yup.string().when('filingStatus', {
      is: 'Married Filing Jointly',
      then: (schema) => schema.required("Spouse last name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
  Yup.object(), // Dependents - optional or custom
  Yup.object().shape({
    street: Yup.string().required("Street is required"),
    state: Yup.string().when("isForeign", {
      is: false,
      then: (schema) => schema.required("State is required"),
    }),
    country: Yup.string().when("isForeign", {
      is: true,
      then: (schema) => schema.required("Country is required"),
    }),
    zip: Yup.string()
  .required("ZIP Code is required")
  .matches(/^\d{5}(-\d{4})?$/, "Invalid ZIP Code format"),

  }),
  Yup.object(), // Final review step
];
