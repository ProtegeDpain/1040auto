export interface Client {
  id: string;
  name: string;
  companyName: string;
}

export interface Dependent {
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  ssn: string;
  months: string;
  relationship: string;
}

export const initialForm = {
  filingStatus: '',
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
