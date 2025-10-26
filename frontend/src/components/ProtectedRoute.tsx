import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, token, hasRole } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check if user has one of them
  if (roles && !hasRole(roles)) {
    // Redirect to appropriate dashboard based on user role
    const dashboardMap: Record<UserRole, string> = {
      EMPLOYEE: '/employee/dashboard',
      LOAN_OFFICER: '/loan-officer/dashboard',
      ACCOUNTANT: '/accountant/dashboard',
      ADMIN: '/admin/dashboard',
    };
    return <Navigate to={dashboardMap[user.role]} replace />;
  }

  return <>{children}</>;
}
