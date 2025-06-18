// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { userLogin } from '@/services/authService'; // Import the userLogin function from authService
interface User {
    id: number;
    role: number | null;
  }
  
  // Removed duplicate useAuth declaration
const AuthContext = createContext<{
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}>({
  user: null,
  login: async () => Promise.resolve(),
  logout: () => {}
});
export const useAuth = () =>  useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

const login = async (username: string, password: string) => {
  try {
    const userData = await userLogin(username, password); // Call the userLogin function
    const user = userData.user as User; // Extract the user property
    setUser(user); // Update the user state
    localStorage.setItem('user', JSON.stringify(user)); // Persist user in localStorage
  } catch (error) {
    console.error('Login failed:', error);
    throw error; // Propagate error for further handling
  }
};

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };
  const value = {
    user,
    login,
    logout
}
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

