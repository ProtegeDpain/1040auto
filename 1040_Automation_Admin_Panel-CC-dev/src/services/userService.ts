import axiosInstance from '@/providers/axiosInstance';

export const createUser = async (formData) => {
  try {
    const payload = {
      first_name: formData.firstName,
      phone_number: formData.phoneNumber,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      role_id: formData.roleId,
    };
    const response = await axiosInstance.post('/api/users/add', payload);
    return response.data;
  } catch (error) {
    console.error('Error during user creation:', error);
    const errorMessage = (error as any)?.response?.data?.message || 'User creation failed';
    throw new Error(errorMessage);
  }
};
export const getUsers = async () => {
  try {
    const response = await axiosInstance.get('/api/users');
    // Always return an array, and map to expected frontend fields
    const users = Array.isArray(response.data.users) ? response.data.users : [];
    // Map API fields to table fields (add username, role, etc.)
    return users.map((user) => ({
      ...user,
      last_name: user.last_name, // Default username to email
      role: user.role_id === 1 ? 'Admin' : 'User',
      first_name: user.first_name, // If you want to split, adjust here
       // Not available in API, so leave blank or parse if needed
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    const errorMessage = (error as any)?.response?.data?.message || 'Failed to fetch users';
    throw new Error(errorMessage);
  }
};
export const archiveUser = async (userId: string) => {
  try {
    const response = await axiosInstance.patch(`/api/users/${userId}/archive`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    const errorMessage = (error as any)?.response?.data?.message || 'User deletion failed';
    throw new Error(errorMessage);
  }
}
export const updateUser = async (userId: string, formData) => {
  try {
    const payload = {
      first_name: formData.firstName,
      phone_number: formData.phoneNumber,
      last_name: formData.lastName,
      email: formData.email,
      role_id: formData.roleId,
    };
    const response = await axiosInstance.put(`/api/users/${userId}`, payload);
    return response.data.user;
  } catch (error) {
    console.error('Error updating user:', error);
    const errorMessage = (error as any)?.response?.data?.message || 'User update failed';
    throw new Error(errorMessage);
  }
}