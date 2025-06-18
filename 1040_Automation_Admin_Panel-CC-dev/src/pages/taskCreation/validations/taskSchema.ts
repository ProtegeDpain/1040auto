import * as Yup from 'yup';

export const stepSchemas: Yup.ObjectSchema<any>[] = [
  // Step 1: basic details
  Yup.object().shape({
    client_id: Yup.number().required("Client is required"),
    sub_client_id: Yup.number().required("Sub Client is required"),
    tax_year: Yup.number()
      .required("Tax Year is required")
      .min(2000, "Tax Year must be after 2000")
      .max(2100, "Tax Year must be before 2100"),
    resident_state: Yup.string().required("Resident state is required"),
    software_type: Yup.string().required("Software Type is required"),
  }),

  // Step 2: credentials based on software_type
  Yup.object().shape({
    software_username: Yup.string().required("Software username is required"),
    software_password: Yup.string().required("Software password is required"),

    vpn_username: Yup.string().when("software_type", {
      is: "VPN+RDC",
      then: (schema) => schema.required("VPN username is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    vpn_password: Yup.string().when("software_type", {
      is: "VPN+RDC",
      then: (schema) => schema.required("VPN password is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    rdc_username: Yup.string().when("software_type", {
      is: (val: string) => val === "VPN+RDC" || val === "RDC",
      then: (schema) => schema.required("RDC username is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    rdc_password: Yup.string().when("software_type", {
      is: (val: string) => val === "VPN+RDC" || val === "RDC",
      then: (schema) => schema.required("RDC password is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    splashtop_email: Yup.string().when("software_type", {
      is: "Splashtop",
      then: (schema) =>
        schema
          .email("Invalid email")
          .required("Splashtop email is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    splashtop_password: Yup.string().when("software_type", {
      is: "Splashtop",
      then: (schema) => schema.required("Splashtop password is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),

  // Step 3: skip (just files, no validation)
  Yup.object(),
];

