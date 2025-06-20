// components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return children;
};

export default ProtectedRoute;
