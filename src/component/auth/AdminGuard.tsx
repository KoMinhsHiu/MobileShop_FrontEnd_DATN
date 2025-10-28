import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/authContext';
import { isCurrentUserAdmin } from '@/utils/function/authHelpers';
import LoadingIndicator from '@/component/loadingIndicator';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminAccess = () => {
      // If still loading auth state, wait
      if (isLoading) {
        return;
      }

      // If not authenticated, redirect to login
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, redirecting to login');
        router.push('/LoginSignup/login');
        return;
      }

      // Check if user is admin
      const isAdmin = isCurrentUserAdmin();
      
      if (!isAdmin) {
        console.log('User is not admin, redirecting to home');
        router.push('/');
        return;
      }

      // User is admin, allow access
      setIsChecking(false);
    };

    checkAdminAccess();
  }, [isAuthenticated, user, isLoading, router]);

  // Show loading while checking authentication and admin status
  if (isLoading || isChecking) {
    return <LoadingIndicator />;
  }

  // If user is not authenticated or not admin, don't render children
  if (!isAuthenticated || !user || !isCurrentUserAdmin()) {
    return null;
  }

  // User is authenticated and is admin, render children
  return <>{children}</>;
};

export default AdminGuard;









