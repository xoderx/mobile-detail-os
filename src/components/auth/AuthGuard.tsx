import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, UserRole } from '@/store/auth-store';
interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}
export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If user is logged in but doesn't have the right role, send to their default portal
    const defaultPath = user.role === 'admin' ? '/admin' : user.role === 'tech' ? '/tech' : '/';
    return <Navigate to={defaultPath} replace />;
  }
  return <>{children}</>;
}