import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/authContext";
import { AuthLayout, LoginForm } from "@/component/auth";

interface LoginPageComponent extends React.FC {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
}

const LoginPage: LoginPageComponent = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.push('/');
    }
  }, [mounted, isAuthenticated, router]);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle="Chào mừng bạn trở lại!"
      showDemoInfo={true}
    >
      <LoginForm />
    </AuthLayout>
  );
};

// Custom layout for login page (no header/footer)
LoginPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {page}
    </div>
  );
};

export default LoginPage;