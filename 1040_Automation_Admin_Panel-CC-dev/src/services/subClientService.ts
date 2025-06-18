import axiosInstance from '@/providers/axiosInstance';
export const createSubClientService = async (formData: any) => {
  // Prepare payload according to backend validators
  const payload: any = {
    // Client reference: send client_id if available, otherwise send client object
    client_id: formData.clientId ? Number(formData.clientId) : undefined,
    client: !formData.clientId
      ? {
          name: formData.clientName,
          software_type_id: Number(formData.software_type_id), // adjust if needed
          network_access_type_id: Number(formData.network_access_type_id), // adjust if needed
        }
      : undefined,

    // Personal Information
    firstName: formData.firstName,
    lastName: formData.lastName,
    middleInitial: formData.middleInitial || '',
    suffix: formData.suffix || '',
    dob: formData.dob || null,
    occupation: formData.occupation || '',
    email: formData.email || '',
    cell: formData.cell || '',
    ssn: formData.ssn || '',

    // Spouse Information
    spouse_ssn: formData.spouseSSN || '',
    spouseFirstName: formData.spouseFirstName || '',
    spouseMiddleInitial: formData.spouseMiddleInitial || '',
    spouseLastName: formData.spouseLastName || '',
    spouseSuffix: formData.spouseSuffix || '',
    spouseDOB: formData.spouseDOB || null,
    spouseOccupation: formData.spouseOccupation || '',
    spousePhone: formData.spousePhone || '',
    spouseEmail: formData.spouseEmail || '',

    // Address Information
    street: formData.street || '',
    apt: formData.apt || '',
    city: formData.city || '',
    state: formData.state || '',
    zip: formData.zip || '',
    county: formData.county || '',
    isForeign: !!formData.isForeign,
    province: formData.province || '',
    country: formData.country || '',
    postalCode: formData.postalCode || '',

    // Tax Information
    filing_status_id: formData.filing_status_id ? Number(formData.filing_status_id) : undefined,
    taxYear: formData.taxYear ? Number(formData.taxYear) : 2025,
    residentialState: formData.residentialState || '',

    // Dependents
    dependents: Array.isArray(formData.dependents)
      ? formData.dependents.map((dep: any) => ({
          name: [dep.firstName, dep.middleName, dep.lastName].filter(Boolean).join(' '),
          ssn: dep.ssn || '',
        }))
      : [],
  };

  // Remove undefined fields (so Joi .optional() works as expected)
  Object.keys(payload).forEach(
    (key) => payload[key] === undefined && delete payload[key]
  );

  try {
    const response = await axiosInstance.post('/api/clients/subclients/add', payload);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Failed to create subclient'
    );
  }
};

interface SubClientResponse {
  id: number;
  sub_client_name: string;
  client_name: string;
  client_id: number;
  company_name: string;
  tax_software_type: string;
  sub_client_ssn?: string;
}

export const getSubClientById = async (): Promise<SubClientResponse[]> => {
  try {
    const response = await axiosInstance.get('/api/clients/subclients/get');
    if (response.status !== 200) {
      throw new Error('Failed to fetch sub-clients');
    }
    
    // Ensure we have the required fields in the response
    const subclients = response.data.map((subclient: any) => ({
      id: subclient.id,
      sub_client_name: subclient.name,
      client_name: subclient.client_name,
      client_id: subclient.client_id,
      company_name: subclient.company_name,
      tax_software_type: subclient.tax_software_type,
      sub_client_ssn: subclient.ssn, // Optional field
    }));

    return subclients;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Failed to fetch sub-clients'
    );
  }
};

export const getSubClientByUserId = async () => {

  const response = await axiosInstance.get(`/api/clients/subclients/get`);
  return response.data;
};