import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface User {
  username: string;
  email?: string;
  fullName?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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
  fullName: 'Người dùng',
  phone: '0123456789',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  avatar: ''
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const savedUser = localStorage.getItem('phonehub_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('phonehub_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials
      if (username === MOCK_USER.username && password === MOCK_USER.password) {
        const userData: User = {
          username: MOCK_USER.username,
          email: MOCK_USER.email,
          fullName: MOCK_USER.fullName,
          phone: MOCK_USER.phone,
          address: MOCK_USER.address,
          avatar: MOCK_USER.avatar
        };
        
        // Save to localStorage
        localStorage.setItem('phonehub_user', JSON.stringify(userData));
        setUser(userData);
        
        toast.success('Đăng nhập thành công!');
        
        // Redirect to home page
        setTimeout(() => {
          router.push('/');
        }, 500);
        
        return true;
      } else {
        toast.error('Tên đăng nhập hoặc mật khẩu không đúng!');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Có lỗi xảy ra khi đăng nhập!');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('phonehub_user');
    setUser(null);
    toast.success('Đăng xuất thành công!');
    
    // Redirect to home page if on protected route
    if (router.pathname !== '/') {
      router.push('/');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
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
