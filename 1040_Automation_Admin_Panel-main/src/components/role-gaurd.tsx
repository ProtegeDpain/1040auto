// components/RoleGuard.js
import { useAuth } from '@/contexts/auth-context';

interface RoleGuardProps {
  allowedRoles: number[]; // Array of allowed roles
  children: React.ReactNode; // Components to render if the role matches
}

export const RoleGuard = ({ allowedRoles, children }: RoleGuardProps) => {
  const { user } = useAuth();

  // Check if the user's role is included in the allowed roles
  if (!user?.role || !allowedRoles.includes(user.role)) {
    return null; // Return null if the user is not authorized
  }

  return <>{children}</>; // Render children if the user is authorized
};
