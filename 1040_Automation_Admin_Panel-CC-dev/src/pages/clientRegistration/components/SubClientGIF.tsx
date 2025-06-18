import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { usStates } from '@/lib/us-states';
import { formatSSN } from '@/lib/ssn-inputs';
import {
  filingStatusOptions,
  relationshipOptions,
  countryOptions,
  taxYearOptions,
  initialDependent
} from '@/lib/client-registration-constants';
import { Stepper } from '@/components/shared/Stepper';
import { createSubClientService } from '@/services/subClientService';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { FormikErrors } from 'formik';
import { stepSchemas } from '../validations/subClientSchema';

const initialForm: {
  clientId?: number;
  filingStatusId: string;
  taxYear: string;
  residentialState: string;
  ssn: string;
  firstName: string;
  middleInitial: string;
  lastName: string;
  suffix: string;
  dob: string;
  occupation: string;
  email: string;
  cell: string;
  spouseSSN: string;
  spouseFirstName: string;
  spouseMiddleInitial: string;
  spouseLastName: string;
  spouseSuffix: string;
  spouseDOB: string;
  spouseOccupation: string;
  spousePhone: string;
  spouseEmail: string;
  dependents: Dependent[];
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  county: string;
  isForeign: boolean;
  province: string;
  country: string;
  postalCode: string;
} = {
  clientId: undefined,
  filingStatusId: '',
  taxYear: '2025', // default value
  residentialState: '',
  ssn: '',
  firstName: '',
  middleInitial: '',
  lastName: '',
  suffix: '',
  dob: '',
  occupation: '',
  email: '',
  cell: '',
  spouseSSN: '',
  spouseFirstName: '',
  spouseMiddleInitial: '',
  spouseLastName: '',
  spouseSuffix: '',
  spouseDOB: '',
  spouseOccupation: '',
  spousePhone: '',
  spouseEmail: '',
  dependents: [] as Dependent[],
  street: '',
  apt: '',
  city: '',
  state: '',
  zip: '',
  county: '',
  isForeign: false,
  province: '',
  country: '',
  postalCode: ''
};


interface Dependent {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  ssn: string;
  months: string;
  relationship: string;
}

// Accept clients as ClientData[] and map to expected Client shape

interface SubClientFormValues {
  clientId?: number;
  clientName?: string;
  software_type_id?: string;
  network_access_type_id?: string;
  taxYear?: string;
  residentialState?: string;
  filingStatus?: string;
  firstName: string;
  lastName: string;
  middleInitial?: string;
  suffix?: string;
  dob?: string;
  occupation?: string;
  email?: string;
  cell?: string;
  ssn?: string;
  spouseSSN?: string;
  spouseFirstName?: string;
  spouseMiddleInitial?: string;
  spouseLastName?: string;
  spouseSuffix?: string;
  spouseDOB?: string;
  spouseOccupation?: string;
  spousePhone?: string;
  spouseEmail?: string;
  street?: string;
  apt?: string;
  city?: string;
  state?: string;
  zip?: string;
  county?: string;
  isForeign?: boolean;
  province?: string;
  country?: string;
  postalCode?: string;
  dependents?: Dependent[];
}

interface SubClientGIFProps {
  clients?: Array<{
    id: string;
    clientName: string;
    companyName: string;
  }>;
  onSubmit?: (response: any) => void;
}

export default function SubClientGIF({
  clients = [],
  onSubmit
}: SubClientGIFProps) {
  // Map ClientData[] to expected Client[]
  const mappedClients = clients.map((c) => ({
    id: c.id,
    name: c.clientName, // ClientData uses clientName
    companyName: c.companyName
  }));
  const [step, setStep] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  // const [editSubClient, setEditSubClient] = useState(null);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [formValues, setFormValues] = useState<SubClientFormValues>(initialForm);
  // const [dependentValues, setDependentValues] = useState<Dependent[]>([]);
  const [] = useState<Record<string, string>>({});
  const steps = [
    'Taxpayer Info',
    'Spouse Info',
    'Dependent Info',
    'Mailing Address',
    'Review & Submit'
  ];

  function prevStep(event) {
    event.preventDefault();
    setStep((s) => (s > 0 ? s - 1 : s));
  }
function nextStep(
  event: React.MouseEvent<HTMLButtonElement>,
  values: SubClientFormValues,
  setErrors: (errors: FormikErrors<SubClientFormValues>) => void,
  step: number,
  setStep: React.Dispatch<React.SetStateAction<number>>
) {
  event.preventDefault();

  stepSchemas[step]
    .validate(values, { abortEarly: false })
    .then(() => {
      setStep((prev) => prev + 1);
    })
    .catch((validationError: Yup.ValidationError) => {
      const errors: FormikErrors<SubClientFormValues> = {};

      validationError.inner.forEach((err) => {
        if (err.path) {
          errors[err.path as keyof SubClientFormValues] = err.message;

          toast.error(err.message, {
            toastId: `step-${step}-${err.path}`, // prevents duplicates
          });
        }
      });

      setErrors(errors);
    });
}


  // Keep form in sync with editSubClient prop (if you add edit functionality for subclients)
  // useEffect(() => {
  //   if (editSubClient) {
  //     // set form values for editing subclient
  //   }
  // }, [editSubClient]);

  // --- Two-way sync for Company Name and Client Name dropdowns ---
  // When either is selected, auto-select the corresponding value in the other
  useEffect(() => {
    // If selectedCompany changes, update selectedClient accordingly
    if (selectedCompany) {
      const match = mappedClients.find(
        (c) => c.companyName === selectedCompany
      );
      if (match && match.name !== selectedClient) {
        setSelectedClient(match.name);
      }
    } else if (selectedClient) {
      // If company is cleared, also clear client
      setSelectedClient('');
    }
  }, [selectedCompany]);

  useEffect(() => {
    // If selectedClient changes, update selectedCompany accordingly
    if (selectedClient) {
      const match = mappedClients.find((c) => c.name === selectedClient);
      if (match && match.companyName !== selectedCompany) {
        setSelectedCompany(match.companyName);
      }
    } else if (selectedCompany) {
      // If client is cleared, also clear company
      setSelectedCompany('');
    }
  }, [selectedClient]);





  // --- Two-way sync for Company Name and Client Name dropdowns ---
  // When either is selected, auto-select the corresponding value in the other
  useEffect(() => {
    // If selectedCompany changes, update selectedClient accordingly
    if (selectedCompany) {
      const match = mappedClients.find(
        (c) => c.companyName === selectedCompany
      );
      if (match && match.name !== selectedClient) {
        setSelectedClient(match.name);
      }
    } else if (selectedClient) {
      // If company is cleared, also clear client
      setSelectedClient('');
    }
  }, [selectedCompany]);

  useEffect(() => {
    // If selectedClient changes, update selectedCompany accordingly
    if (selectedClient) {
      const match = mappedClients.find((c) => c.name === selectedClient);
      if (match && match.companyName !== selectedCompany) {
        setSelectedCompany(match.companyName);
      }
    } else if (selectedCompany) {
      // If client is cleared, also clear company
      setSelectedCompany('');
    }
  }, [selectedClient]);

  // ... existing dependent handling functions ...


  // Example dummy data for testing

  // Add a function to fill form with dummy data (for testing)

  return (
    <Formik<SubClientFormValues>
      initialValues={initialForm}
      
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          setSubmitting(true);
          const response = await createSubClientService(values);
          
          // Call the parent component's onSubmit if provided
          if (onSubmit) {
            onSubmit(response);
          }
          
          toast.success;
          
          resetForm();
        } catch (error: any) {
          console.error('Failed to create subclient:', error);
          toast.error(error.message)
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ values, errors, touched, setFieldValue, isSubmitting, setErrors }) => {
        return (
          <div className="mx-auto mt-8 flex h-full max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white p-0 shadow">
            <div className="border-b p-6">
              <Stepper steps={steps} step={step} />
              <h2 className="mb-4 text-xl font-bold">{steps[step]}</h2>
            </div>
            <Form className="flex-1 overflow-y-auto p-6">
              {step === 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Company Name Select */}
                  <div>
                    <Label>
                      Company Name <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={selectedCompany}
                      onValueChange={(value) => {
                        setSelectedCompany(value);
                        const matchingClient = mappedClients.find(
                          (c) => c.companyName === value
                        );
                        if (matchingClient) {
                          setFieldValue('clientId', matchingClient.id);
                          setSelectedClient(matchingClient.name);
                        } else {
                          setFieldValue('clientId', '');
                          setSelectedClient('');
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {mappedClients.map((c) => (
                          <SelectItem key={c.companyName} value={c.companyName}>
                            {c.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Client Name Select */}
                  <div>
                    <Label>
                      Client Name <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={selectedClient}
                      onValueChange={(value) => {
                        setSelectedClient(value);
                        const matchingClient = mappedClients.find(
                          (c) => c.name === value
                        );
                        if (matchingClient) {
                          setFieldValue('clientId', matchingClient.id);
                          setSelectedCompany(matchingClient.companyName);
                        } else {
                          setFieldValue('clientId', '');
                          setSelectedCompany('');
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        {mappedClients.map((c) => (
                          <SelectItem key={c.id} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>
                      Tax Year <span className="text-red-500"> *</span>
                    </Label>
                    <Select
                      value={values.taxYear}
                      onValueChange={(v) => setFieldValue('taxYear', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Tax Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {taxYearOptions.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="taxYear"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div>
                    <Label>
                      Residential State <span className="text-red-500"> *</span>
                    </Label>
                    <Select
                      value={values.residentialState}
                      onValueChange={(v) =>
                        setFieldValue('residentialState', v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        {usStates.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="residentialState"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>
                      Filing Status <span className="text-red-500"> *</span>
                    </Label>
                    <Select
                      value={values.filingStatus}
                      onValueChange={(v) => setFieldValue('filingStatus', v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Filing Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {filingStatusOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorMessage
                      name="filingStatus"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div>
                    <Label>
                      First Name <span className="text-red-500"> *</span>
                    </Label>
                    <Field as={Input} name="firstName" />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div>
                    <Label>Middle Initial</Label>
                    <Field name="middleInitial">
                      {({ field }) => (
                        <Input
                          {...field}
                          maxLength={1}
                          onChange={(e) => {
                            const val = e.target.value
                              .toUpperCase()
                              .slice(0, 1);
                            setFieldValue('middleInitial', val);
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="middleInitial"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div>
                    <Label>
                      Last Name <span className="text-red-500"> *</span>
                    </Label>
                    <Field as={Input} name="lastName" />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div>
                    <Label>Suffix</Label>
                    <Field as={Input} name="suffix" />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Field as={Input} name="dob" type="date" />
                  </div>
                  <div>
                    <Label>
                      SSN or ITIN <span className="text-red-500"> *</span>
                    </Label>
                    <Field name="ssn">
                      {({ field }) => (
                        <Input
                          {...field}
                          maxLength={11}
                          onChange={(e) => {
                            const formatted = formatSSN(e.target.value);
                            setFieldValue('ssn', formatted);
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="ssn"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div>
                    <Label>Occupation</Label>
                    <Field as={Input} name="occupation" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Field as={Input} name="email" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Field as={Input} name="cell" />
                    <ErrorMessage
                      name="cell"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                </div>
              )}
              {step === 1 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label>
                      Spouse SSN
                      {values.filingStatus === 'Married Filing Jointly' && (
                        <span className="text-red-500"> *</span>
                      )}
                    </Label>
                    <Field name="spouseSSN">
                      {({ field }) => (
                        <Input
                          {...field}
                          maxLength={11}
                          onChange={(e) => {
                            const formatted = formatSSN(e.target.value);
                            setFieldValue('spouseSSN', formatted);
                          }}
                        />
                      )}
                    </Field>
                    <ErrorMessage
                      name="spouseSSN"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div>
                    <Label>
                      First Name
                      {values.filingStatus === 'Married Filing Jointly' && (
                        <span className="text-red-500"> *</span>
                      )}
                    </Label>
                    <Field as={Input} name="spouseFirstName" />
                    <ErrorMessage
                      name="spouseFirstName"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div>
                    <Label>
                      Last Name
                      {values.filingStatus === 'Married Filing Jointly' && (
                        <span className="text-red-500"> *</span>
                      )}
                    </Label>
                    <Field as={Input} name="spouseLastName" />
                    <ErrorMessage
                      name="spouseLastName"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Field as={Input} name="spouseDOB" type="date" />
                  </div>
                  <div>
                    <Label>Occupation</Label>
                    <Field as={Input} name="spouseOccupation" />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Field as={Input} name="spousePhone" />
                    <ErrorMessage
                      name="spousePhone"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div>
                    <Label>Email Address</Label>
                    <Field as={Input} name="spouseEmail" />
                    <ErrorMessage
                      name="spouseEmail"
                      component="div"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                </div>
              )}
              {step === 2 && (
                <FieldArray name="dependents">
                  {({ push, remove, form }) => (
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <Label>Dependents</Label>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => push({ ...initialDependent })}
                        >
                          Add Dependent
                        </Button>
                      </div>
                      {form.values.dependents.length === 0 && (
                        <div className="mb-2 text-sm text-gray-500">
                          No dependents added.
                        </div>
                      )}
                      {form.values.dependents.map((dep, idx) => (
                        <div
                          key={idx}
                          className="relative mb-4 rounded border p-4"
                        >
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="absolute right-2 top-2"
                            onClick={() => remove(idx)}
                            title="Remove Dependent"
                          >
                            ×
                          </Button>
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                              <Label>First Name</Label>
                              <Field
                                as={Input}
                                name={`dependents[${idx}].firstName`}
                              />
                              <ErrorMessage
                                name={`dependents[${idx}].firstName`}
                                component="div"
                                className="mt-1 text-xs text-red-500"
                              />
                            </div>
                            <div>
                              <Label>Middle Name</Label>
                              <Field name={`dependents[${idx}].middleName`}>
                                {({ field }) => (
                                  <Input
                                    {...field}
                                    maxLength={1}
                                    onChange={(e) => {
                                      const val = e.target.value
                                        .toUpperCase()
                                        .slice(0, 1);
                                      form.setFieldValue(
                                        `dependents[${idx}].middleName`,
                                        val
                                      );
                                    }}
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name={`dependents[${idx}].middleName`}
                                component="div"
                                className="mt-1 text-xs text-red-500"
                              />
                            </div>
                            <div>
                              <Label>Last Name</Label>
                              <Field
                                as={Input}
                                name={`dependents[${idx}].lastName`}
                              />
                              <ErrorMessage
                                name={`dependents[${idx}].lastName`}
                                component="div"
                                className="mt-1 text-xs text-red-500"
                              />
                            </div>
                            <div>
                              <Label>Date of Birth</Label>
                              <Field
                                as={Input}
                                name={`dependents[${idx}].dob`}
                                type="date"
                              />
                              <ErrorMessage
                                name={`dependents[${idx}].dob`}
                                component="div"
                                className="mt-1 text-xs text-red-500"
                              />
                            </div>
                            <div>
                              <Label>SSN or ITIN</Label>
                              <Field name={`dependents[${idx}].ssn`}>
                                {({ field }) => (
                                  <Input
                                    {...field}
                                    maxLength={11}
                                    onChange={(e) => {
                                      const formatted = formatSSN(
                                        e.target.value
                                      );
                                      form.setFieldValue(
                                        `dependents[${idx}].ssn`,
                                        formatted
                                      );
                                    }}
                                  />
                                )}
                              </Field>
                              <ErrorMessage
                                name={`dependents[${idx}].ssn`}
                                component="div"
                                className="mt-1 text-xs text-red-500"
                              />
                            </div>
                            <div>
                              <Label>Months</Label>
                              <Field
                                as={Input}
                                name={`dependents[${idx}].months`}
                              />
                              <ErrorMessage
                                name={`dependents[${idx}].months`}
                                component="div"
                                className="mt-1 text-xs text-red-500"
                              />
                            </div>
                            <div>
                              <Label>Relationship</Label>
                              <Select
                                value={dep.relationship}
                                onValueChange={(v) =>
                                  form.setFieldValue(
                                    `dependents[${idx}].relationship`,
                                    v
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                  {relationshipOptions.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                      {opt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <ErrorMessage
                                name={`dependents[${idx}].relationship`}
                                component="div"
                                className="mt-1 text-xs text-red-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </FieldArray>
              )}
              {step === 3 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="col-span-2 flex items-center gap-4">
                    <Label>Is this a foreign address?</Label>
                    <Field
                      type="checkbox"
                      name="isForeign"
                      checked={values.isForeign}
                      onChange={(e) =>
                        setFieldValue('isForeign', e.target.checked)
                      }
                    />
                  </div>
                  {!values.isForeign && (
                    <>
                      <div className="col-span-2">
                        <Label>
                          Street <span className="text-red-500"> *</span>
                        </Label>
                        <Field as={Input} name="street" />
                        <ErrorMessage
                          name="street"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>
                      <div>
                        <Label>Apt #</Label>
                        <Field as={Input} name="apt" />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Field as={Input} name="city" />
                      </div>
                      <div>
                        <Label>
                          State <span className="text-red-500"> *</span>
                        </Label>
                        <Select
                          value={values.state}
                          onValueChange={(v) => setFieldValue('state', v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent>
                            {usStates.map((s) => (
                              <SelectItem key={s.value} value={s.value}>
                                {s.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>
                      <div>
                        <Label>
                          ZIP Code <span className="text-red-500"> *</span>
                        </Label>
                        <Field as={Input} name="zip" />
                        <ErrorMessage
                          name="zip"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>
                      <div>
                        <Label>
                          County <span className="text-red-500"> *</span>{' '}
                        </Label>
                        <Field as={Input} name="county" />
                        <ErrorMessage
                          name="county"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>
                    </>
                  )}
                  {values.isForeign && (
                    <>
                      <div className="col-span-2">
                        <Label>
                          Street <span className="text-red-500"> *</span>
                        </Label>
                        <Field as={Input} name="street" />
                        <ErrorMessage
                          name="street"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>
                      <div>
                        <Label>Apt #</Label>
                        <Field as={Input} name="apt" />
                      </div>
                      <div>
                        <Label>
                          Province/State{' '}
                          <span className="text-red-500"> *</span>
                        </Label>
                        <Field as={Input} name="province" />
                        <ErrorMessage
                          name="province"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>
                      <div>
                        <Label>
                          Country <span className="text-red-500"> *</span>
                        </Label>
                        <Select
                          value={values.country}
                          onValueChange={(v) => setFieldValue('country', v)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countryOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ErrorMessage
                          name="country"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>
                      <div>
                        <Label>
                          Postal Code <span className="text-red-500"> *</span>
                        </Label>
                        <Field as={Input} name="postalCode" />
                        <ErrorMessage
                          name="postalCode"
                          component="div"
                          className="mt-1 text-xs text-red-500"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
              {step === 4 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Review & Submit</h3>
                  <div className="space-y-2 overflow-x-auto rounded bg-gray-100 p-4 text-xs">
                    <div>
                      <span className="font-semibold">Tax Year:</span>{' '}
                      {values.taxYear}
                    </div>
                    <div>
                      <span className="font-semibold">Filing Status:</span>{' '}
                      {values.filingStatus}
                    </div>
                    <div>
                      <span className="font-semibold">Taxpayer:</span>{' '}
                      {values.firstName} {values.middleInitial}{' '}
                      {values.lastName} {values.suffix}
                    </div>
                    <div>
                      <span className="font-semibold">SSN/ITIN:</span>{' '}
                      {values.ssn}
                    </div>
                    <div>
                      <span className="font-semibold">DOB:</span> {values.dob}
                    </div>
                    <div>
                      <span className="font-semibold">Occupation:</span>{' '}
                      {values.occupation}
                    </div>
                    <div>
                      <span className="font-semibold">Email:</span>{' '}
                      {values.email}
                    </div>
                    <div>
                      <span className="font-semibold">Cell:</span> {values.cell}
                    </div>
                    {values.filingStatus === 'Married Filing Jointly' && (
                      <div>
                        <span className="font-semibold">Spouse:</span>{' '}
                        {values.spouseFirstName} {values.spouseMiddleInitial}{' '}
                        {values.spouseLastName} {values.spouseSuffix}
                        <br />
                        <span className="font-semibold">
                          Spouse SSN/ITIN:
                        </span>{' '}
                        {values.spouseSSN}
                        <br />
                        <span className="font-semibold">Spouse DOB:</span>{' '}
                        {values.spouseDOB}
                        <br />
                        <span className="font-semibold">
                          Spouse Occupation:
                        </span>{' '}
                        {values.spouseOccupation}
                        <br />
                        <span className="font-semibold">
                          Spouse Email:
                        </span>{' '}
                        {values.spouseEmail}
                        <br />
                        <span className="font-semibold">
                          Spouse Phone:
                        </span>{' '}
                        {values.spousePhone}
                      </div>
                    )}
                    {values.dependents && values.dependents.length > 0 && (
                      <div>
                        <span className="font-semibold">Dependents:</span>
                        <ul className="ml-6 list-disc">
                          {values.dependents.map((dep, idx) => (
                            <li key={idx}>
                              {dep.firstName} {dep.middleName} {dep.lastName} |
                              DOB: {dep.dob} | SSN/ITIN: {dep.ssn} | Months:{' '}
                              {dep.months} | Relationship: {dep.relationship}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">Address:</span>{' '}
                      {values.street} {values.apt}, {values.city} {values.state}{' '}
                      {values.zip} {values.county}
                    </div>
                    {values.isForeign && (
                      <div>
                        <span className="font-semibold">Foreign Address:</span>{' '}
                        {values.street} {values.apt}, {values.province},{' '}
                        {values.country} {values.postalCode}
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              )}
              <div className="mt-8 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 0}
                >
                  Back
                </Button>
                {step < steps.length - 1 && (
                  <Button
  type="button"
  onClick={(e) => nextStep(e, values, setErrors, step, setStep)}
>
  Next
</Button>

                )}
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}
