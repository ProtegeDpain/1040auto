import axiosInstance from '@/providers/axiosInstance';

export const createClientService = async (formData) => {
  try {
    const { name, software_type_id, network_access_type_id } = formData;
    // Basic validation (optional, since backend also validates)
    if (!name || !software_type_id || !network_access_type_id) {
      throw new Error('name, software_type_id, and network_access_type_id are required.');
    }
    const response = await axiosInstance.post('/api/clients/add', {
      name,
      company_name: formData.company_name, // Optional, if you have it
      software_type_id,
      network_access_type_id,
    });
    return response.data;
  } catch (error) {
    // Handle error from backend or network
    const errorMessage =
      (error as any)?.response?.data?.error ||
      (error as any)?.response?.data?.message ||
      (typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : '') ||
      'Client creation failed';
    throw new Error(errorMessage);
  }
};

export const getClientsByUser = async () => {
  try {
    const response = await axiosInstance.get('/api/clients'); // Adjust endpoint if needed
    return response.data;
  } catch (error) {
    const errorMessage =
      (error as any)?.response?.data?.error ||
      (error as any)?.response?.data?.message ||
      (typeof error === 'object' && error !== null && 'message' in error ? (error as { message: string }).message : '') ||
      'Failed to fetch clients';
    throw new Error(errorMessage);
  }
};