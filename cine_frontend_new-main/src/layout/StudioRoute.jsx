import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { USER_TYPE, isProducerRole } from '../constants/enums';

export const StudioRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isProducerRole(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
