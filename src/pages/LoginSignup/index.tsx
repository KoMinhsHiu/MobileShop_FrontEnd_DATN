import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const LoginSignupIndex = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page by default
    router.replace('/LoginSignup/login');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2>Redirecting to login...</h2>
        <p>If you are not redirected automatically, <a href="/LoginSignup/login">click here</a>.</p>
      </div>
    </div>
  );
};

export default LoginSignupIndex;
