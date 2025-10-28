import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/authContext';

/**
 * Higher Order Component to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 * Saves the intended destination URL to redirect back after login
 */
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: {
    redirectTo?: string; // Where to redirect if not authenticated (default: /LoginSignup/login)
  }
) {
  const ComponentWithAuth = (props: P) => {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const redirectTo = options?.redirectTo || '/LoginSignup/login';

    useEffect(() => {
      // Wait for auth check to complete
      if (isLoading) {
        return;
      }

      // If not authenticated, redirect to login with returnUrl
      if (!isAuthenticated) {
        const currentPath = router.asPath;
        
        console.log('🔒 Not authenticated, redirecting to login');
        console.log('📍 Current path:', currentPath);
        console.log('🔙 Will return to:', currentPath);

        // Save the intended destination
        router.push({
          pathname: redirectTo,
          query: { returnUrl: currentPath }
        });
      }
    }, [isAuthenticated, isLoading, router]);

    // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p>Đang kiểm tra xác thực...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    // Don't render protected content if not authenticated
    if (!isAuthenticated) {
      return null;
    }

    // User is authenticated, render the protected component
    return <WrappedComponent {...props} />;
  };

  // Set display name for debugging
  ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAuth;
}

export default withAuth;

