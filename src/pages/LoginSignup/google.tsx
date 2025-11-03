import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const GoogleCallbackPage = () => {
  const router = useRouter();
  const { googleOAuthCallback } = useAuth();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        if (!router.isReady) return;

        const { code } = router.query;
        if (!code || typeof code !== "string") {
          setError("Invalid or missing authorization code");
          console.error("❌ Invalid or missing authorization code");
          return;
        }

        console.log("🔍 Handling Google OAuth callback with code:", code);

        const isSuccess = await googleOAuthCallback(code);

        if (isSuccess) {
          console.log("✅ Google OAuth callback handled successfully, redirecting to home page");
          router.push("/");
        }
      } catch (error) {
        console.error("❌ Error handling Google callback:", error);
        setError("Failed to process Google authentication");
      }
    };

    handleGoogleCallback();
  }, [router.isReady, router.query]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {error ? (
        <div style={{ textAlign: 'center' }}>
          <h2>Authentication Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2>Đang xử lý xác thực Google...</h2>
          <p>Vui lòng chờ trong khi chúng tôi hoàn tất đăng nhập. Nếu không được chuyển hướng, <Link href="/LoginSignup/login">nhấn vào đây</Link>.</p>
        </div>
      )}
    </div>
  );
};

export default GoogleCallbackPage;