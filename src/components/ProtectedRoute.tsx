// frontend/src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If we have a user, we're authenticated
        if (user) {
          setIsCheckingAuth(false);
          setAuthError(null);
          return;
        }

        // If we're not loading and don't have a user, we're not authenticated
        if (!loading && !user) {
          setIsCheckingAuth(false);
          setAuthError(new Error('No authenticated user found'));
          return;
        }

        // If we're still loading, wait for the next check
        if (loading) {
          return;
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsCheckingAuth(false);
        setAuthError(error as Error);
      }
    };

    checkAuth();
  }, [user, loading]);

  // Only show loading state if we're actually checking auth
  if (isCheckingAuth && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nextrend-500"></div>
      </div>
    );
  }

  // If we have an error or no user, redirect to login
  if (authError || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If we have a user and no errors, render the children
  return <>{children}</>;
}