import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";

const GoogleCallbackPage = () => {
  const router = useRouter();
  const { googleOAuthCallback } = useAuth();
  const [error, setError] = useState<string>("");
  
  const hasCalledRef = useRef(false);

  useEffect(() => {
    if (!router.isReady) return;

    if (hasCalledRef.current) return;

    const { code } = router.query;

    if (!code || typeof code !== "string") {
      if (router.isReady && !code) { 
         setError("Invalid or missing authorization code");
      }
      return;
    }

    const handleGoogleCallback = async () => {
      hasCalledRef.current = true;

      try {
        console.log("🔍 Handling Google OAuth callback with code:", code);

        const codeStatus = await googleOAuthCallback(code);

        if (codeStatus === 200) {
          console.log("✅ Google OAuth callback handled successfully, redirecting to home page");
          router.push("/");
        } else if (codeStatus === 404) {
          console.log("🆕 New user detected, redirecting to registration page");
        } else {
            setError("Authentication failed");
        }
      } catch (error) {
        console.error("❌ Error handling Google callback:", error);
        setError("Failed to process Google authentication");
      }
    };

    handleGoogleCallback();
  }, [googleOAuthCallback, router]);

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
          <h2 style={{ color: 'red' }}>Authentication Error</h2>
          <p>{error}</p>
          <div style={{ marginTop: '20px' }}>
             <Link href="/LoginSignup/login" style={{ color: 'blue', textDecoration: 'underline' }}>
                Quay lại trang đăng nhập
             </Link>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2>Đang xử lý xác thực Google...</h2>
          <div style={{ margin: '20px 0', fontSize: '24px' }}>⏳</div>
          <p>Vui lòng chờ trong giây lát.</p>
        </div>
      )}
    </div>
  );
};

export default GoogleCallbackPage;