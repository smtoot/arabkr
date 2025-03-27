import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type ProtectedRouteProps = {
  requiredRole?: "student" | "teacher" | "admin";
};

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Show loading state while auth status is being checked
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If role check is required
  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render children
  return <Outlet />;
}
