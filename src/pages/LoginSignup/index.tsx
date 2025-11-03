import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
        <p>If you are not redirected automatically, <Link href="/LoginSignup/login">click here</Link>.</p>
      </div>
    </div>
  );
};

export default LoginSignupIndex;
