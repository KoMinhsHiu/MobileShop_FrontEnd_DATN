import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { authAPI } from '@/utils/api/auth';
import { decodeJWT, getUserRole, isTokenExpired, JWTPayload } from '@/utils/function/jwtUtils';

interface User {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  roleId: number;
  role: string; // Add role field
  avatar?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  googleOAuth: () => Promise<void>;
  googleOAuthCallback: (code: string) => Promise<boolean>;
  isLoading: boolean;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone: string;
  roleId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user data
const MOCK_USER = {
  username: 'user',
  password: 'user123',
  email: 'user@phonehub.com',
  firstName: 'Người',
  lastName: 'Dùng',
  phone: '0123456789',
  dateOfBirth: '1990-01-01',
  roleId: 1,
  address: '123 Đường ABC, Quận 1, TP.HCM',
  avatar: ''
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        // Don't auto-login if we're in the process of logging out
        if (isLoggingOut) {
          setIsLoading(false);
          return;
        }
        
        const savedUser = localStorage.getItem('phonehub_user');
        const savedTokens = localStorage.getItem('phonehub_tokens');
        
        if (savedUser && savedTokens) {
          const userData = JSON.parse(savedUser);
          const tokenData = JSON.parse(savedTokens);
          const accessToken = tokenData.accessToken;
          
          // Check if token is expired
          if (isTokenExpired(accessToken)) {
            console.log('Token expired, logging out user');
            localStorage.removeItem('phonehub_user');
            localStorage.removeItem('phonehub_tokens');
            setUser(null);
            return;
          }
          
          // Decode token to get role information
          const decodedToken = decodeJWT(accessToken);
          if (decodedToken) {
            // Update user data with role from token
            const updatedUser = {
              ...userData,
              role: decodedToken.role,
              email: decodedToken.email,
              username: decodedToken.username
            };
            setUser(updatedUser);
          } else {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('phonehub_user');
        localStorage.removeItem('phonehub_tokens');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [isLoggingOut]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Call login API
      const response = await authAPI.login({ username, password });
      
      if (response.status === 200) {
        // Decode JWT token to get user information
        const accessToken = response.data.tokens.accessToken;
        const decodedToken = decodeJWT(accessToken);
        
        if (!decodedToken) {
          toast.error('Token không hợp lệ!');
          return false;
        }
        
        // Create user object from decoded token
        const userData: User = {
          userId: decodedToken.sub,
          username: decodedToken.username,
          email: decodedToken.email,
          firstName: '', // Will be populated from user profile API
          lastName: '', // Will be populated from user profile API
          phone: '', // Will be populated from user profile API
          dateOfBirth: '', // Will be populated from user profile API
          roleId: decodedToken.role === 'admin' ? 2 : 1, // Map role to roleId
          role: decodedToken.role,
          avatar: ''
        };
        
        // Save tokens and user data to localStorage
        const tokensWithTimestamp = {
          ...response.data.tokens,
          issuedAt: Date.now() // Add timestamp when token was issued
        };
        localStorage.setItem('phonehub_tokens', JSON.stringify(tokensWithTimestamp));
        localStorage.setItem('phonehub_user', JSON.stringify(userData));
        setUser(userData);
        
        toast.success('Đăng nhập thành công!');
        
        // Redirect based on returnUrl or user role
        setTimeout(() => {
          // Check if there's a returnUrl in the query params
          const returnUrl = router.query.returnUrl as string;
          
          if (returnUrl && returnUrl !== '/LoginSignup/login' && returnUrl !== '/LoginSignup/register') {
            // Redirect back to the intended page
            console.log('🔙 Redirecting to returnUrl:', returnUrl);
            router.push(returnUrl);
          } else if (decodedToken.role === 'customer') {
            router.push('/'); // Redirect to home page for customers
          } else if (decodedToken.role === 'admin') {
            router.push('/admin'); // Redirect to admin dashboard
          } else {
            router.push('/'); // Default redirect
          }
        }, 500);
        
        return true;
      } else {
        toast.error('Đăng nhập thất bại!');
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi đăng nhập!');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Call register API
      const response = await authAPI.register(userData);
      
      if (response.status === 201) {
        // Decode JWT token to get user information
        const accessToken = response.data.tokens.accessToken;
        const decodedToken = decodeJWT(accessToken);
        
        if (!decodedToken) {
          toast.error('Token không hợp lệ!');
          return false;
        }
        
        // Create user object from decoded token
        const newUser: User = {
          userId: decodedToken.sub,
          username: decodedToken.username,
          email: decodedToken.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          dateOfBirth: userData.dateOfBirth,
          roleId: decodedToken.role === 'admin' ? 2 : 1, // Map role to roleId
          role: decodedToken.role,
          avatar: ''
        };
        
        // Save tokens and user data to localStorage
        const tokensWithTimestamp = {
          ...response.data.tokens,
          issuedAt: Date.now() // Add timestamp when token was issued
        };
        localStorage.setItem('phonehub_tokens', JSON.stringify(tokensWithTimestamp));
        localStorage.setItem('phonehub_user', JSON.stringify(newUser));
        setUser(newUser);
        
        toast.success('Đăng ký thành công!');
        
        // Redirect based on returnUrl or user role
        setTimeout(() => {
          // Check if there's a returnUrl in the query params
          const returnUrl = router.query.returnUrl as string;
          
          if (returnUrl && returnUrl !== '/LoginSignup/login' && returnUrl !== '/LoginSignup/register') {
            // Redirect back to the intended page
            console.log('🔙 Redirecting to returnUrl:', returnUrl);
            router.push(returnUrl);
          } else if (decodedToken.role === 'customer') {
            router.push('/'); // Redirect to home page for customers
          } else if (decodedToken.role === 'admin') {
            router.push('/admin'); // Redirect to admin dashboard
          } else {
            router.push('/'); // Default redirect
          }
        }, 500);
        
        return true;
      } else {
        toast.error('Đăng ký thất bại!');
        return false;
      }
    } catch (error: any) {
      console.error('Register error:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi đăng ký!');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoggingOut(true); // Set logout flag to prevent auto-login
    
    try {
      // Get access token from localStorage
      const tokens = localStorage.getItem('phonehub_tokens');
      if (tokens) {
        const tokenData = JSON.parse(tokens);
        const accessToken = tokenData.accessToken;
        
        // Call logout API
        await authAPI.logout(accessToken);
      }
    } catch (error: any) {
      console.error('Logout API error:', error);
      // Continue with local logout even if API fails
    } finally {
      // Clear ALL authentication data from localStorage
      localStorage.removeItem('phonehub_user');
      localStorage.removeItem('phonehub_tokens');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('isAdmin');
      
      // Clear from sessionStorage as well
      sessionStorage.removeItem('phonehub_user');
      sessionStorage.removeItem('phonehub_tokens');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('isAdmin');
      
      // Clear user state
      setUser(null);
      
      console.log('All authentication data cleared');
      
      // Reset logout flag after a delay to allow redirect
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 2000);
      
      // Don't show toast here - let the calling component handle it
      // Don't redirect here - let the calling component handle it
    }
  };

  
  const googleOAuth = async (): Promise<void> => {
    try {
      await authAPI.googleOAuth();
    } catch (error: any) {
      console.error('Google OAuth error:', error);
    }
  };

  const googleOAuthCallback = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authAPI.googleOAuthCallback(code);

      if (response.status === 200) {
        // Handle successful OAuth login similar to normal login
        const accessToken = response.data.tokens.accessToken;
        const decodedToken = decodeJWT(accessToken);

        if (!decodedToken) {
          toast.error('Token không hợp lệ!');
          return false;
        }

        const userData: User = {
          userId: decodedToken.sub,
          username: decodedToken.username,
          email: decodedToken.email,
          firstName: '', // Will be populated from user profile API
          lastName: '', // Will be populated from user profile API
          phone: '', // Will be populated from user profile API
          dateOfBirth: '', // Will be populated from user profile API
          roleId: decodedToken.role === 'admin' ? 2 : 1, // Map role to roleId
          role: decodedToken.role,
          avatar: ''
        };

        const tokensWithTimestamp = {
          ...response.data.tokens,
          issuedAt: Date.now() // Add timestamp when token was issued
        };
        localStorage.setItem('phonehub_tokens', JSON.stringify(tokensWithTimestamp));
        localStorage.setItem('phonehub_user', JSON.stringify(userData));
        setUser(userData);

        toast.success('Đăng nhập bằng Google thành công!');

        // Redirect based on returnUrl or user role
        setTimeout(() => {
          const returnUrl = router.query.returnUrl as string;

          if (returnUrl && returnUrl !== '/LoginSignup/login' && returnUrl !== '/LoginSignup/register') {
            console.log('🔙 Redirecting to returnUrl:', returnUrl);
            router.push(returnUrl);
          } else {
            router.push(userData.role === 'admin' ? '/admin' : '/');
          }
        }, 2000);

        return true;
      } else {
        toast.error('Đăng nhập bằng Google thất bại!');
        return false;
      }
    } catch (error: any) {
      console.error('Google OAuth callback error:', error);

      if (error.status === 404 && error.responseData?.data?.isNewUser) {
        const { googleUser } = error.responseData.data;
        
        // Redirect to register with Google user data
        router.push({
          pathname: '/LoginSignup/register',
          query: {
            email: googleUser.email,
            firstName: googleUser.firstName,
            lastName: googleUser.lastName
          }
        });
        
        return false;
      }

      toast.error(error.message || 'Có lỗi xảy ra khi đăng nhập bằng Google!');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    googleOAuth,
    googleOAuthCallback,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
