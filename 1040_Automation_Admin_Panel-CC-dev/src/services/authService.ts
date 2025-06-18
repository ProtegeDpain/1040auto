import axiosInstance from '@/providers/axiosInstance';

export const userLogin = async (username: string, password: string): Promise<{ token: string; user: any }> => {
try {
  const response = await axiosInstance.post('/api/login', { username, password });


  const { token, user } = response.data;

    // Store user and token in local storage
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('authToken', token);

    return { token, user }; // Return both token and user for further use
  } catch (error) {
    console.error('Error during login:', error);
    const errorMessage = (error as any)?.response?.data?.message || 'Login failed';
    throw new Error(errorMessage);
}
};