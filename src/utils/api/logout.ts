// Logout API interfaces and functions
export interface LogoutResponse {
  status: number;
  message: string;
  data?: any;
  errors?: any;
}

/**
 * Logout user from the system
 */
export const logoutUser = async (): Promise<LogoutResponse> => {
  const baseURL = process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL || 'https://your-production-api.com'
    : 'http://localhost:3000';
  
  const url = `${baseURL}/api/v1/auth/logout`;
  
  // Get JWT token from localStorage or sessionStorage
  let token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  
  // Check if token exists
  if (!token) {
    throw new Error('Authentication token not found. Please login again.');
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid or expired token.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to logout: ${response.status} ${response.statusText}`);
      }
    }

    return response.json();
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

/**
 * Clear authentication data from storage
 */
export const clearAuthData = (): void => {
  // Clear tokens from both localStorage and sessionStorage
  localStorage.removeItem('authToken');
  sessionStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  sessionStorage.removeItem('refreshToken');
  
  // Clear user data
  localStorage.removeItem('userData');
  sessionStorage.removeItem('userData');
  
  // Clear any other auth-related data
  localStorage.removeItem('isAdmin');
  sessionStorage.removeItem('isAdmin');
  
  console.log('Authentication data cleared from storage');
};

/**
 * Complete logout process (API call + clear storage)
 */
export const performLogout = async (): Promise<void> => {
  try {
    // Try to call logout API
    await logoutUser();
    console.log('Logout API call successful');
  } catch (error) {
    // Even if API call fails, we should still clear local data
    console.warn('Logout API call failed, but clearing local data:', error);
  } finally {
    // Always clear local authentication data
    clearAuthData();
  }
};
