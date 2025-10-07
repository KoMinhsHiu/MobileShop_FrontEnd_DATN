import React, { useState, useEffect } from "react";
import { AuthLayout, RegisterForm } from "@/component/auth";

interface RegisterPageComponent extends React.FC {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
}

const RegisterPage: RegisterPageComponent = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <AuthLayout
      title="Đăng ký"
      subtitle="Tạo tài khoản mới"
      showDemoInfo={false}
    >
      <RegisterForm />
    </AuthLayout>
  );
};

// Custom layout for register page (no header/footer)
RegisterPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {page}
    </div>
  );
};

export default RegisterPage;