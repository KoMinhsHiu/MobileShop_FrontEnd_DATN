import axios from "axios";

// Main axios instance for all APIs (with /v1 prefix)
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  timeout: 30000, // Tăng timeout lên 30 giây
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Keep v1AxiosInstance as alias for backward compatibility
export const v1AxiosInstance = axiosInstance;

// Separate axios instance for phone APIs (without /api/v1 prefix)
export const phoneAxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add request interceptor for debugging and authentication
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    try {
      const tokens = localStorage.getItem('phonehub_tokens');
      if (tokens) {
        const tokenData = JSON.parse(tokens);
        console.log('🔑 Token data structure:', JSON.stringify(tokenData, null, 2));
        
        // Try different possible token structures
        const accessToken = tokenData.accessToken || tokenData.access_token || tokenData.token;
        const expiresIn = tokenData.expiresIn || tokenData.expires_in;
        
        if (accessToken) {
          // Check if token is expired
          const tokenAge = Date.now() - (tokenData.issuedAt || 0);
          const isExpired = expiresIn && tokenAge > (expiresIn * 1000);
          
          if (isExpired) {
            console.warn('⚠️ Token appears to be expired');
          }
          
          config.headers.Authorization = `Bearer ${accessToken}`;
          console.log('✅ Token added to request:', JSON.stringify({
            tokenPreview: accessToken.substring(0, 20) + '...',
            expiresIn,
            isExpired,
            tokenAge: Math.round(tokenAge / 1000) + 's'
          }, null, 2));
        } else {
          console.warn('❌ No access token found in token data:', Object.keys(tokenData));
        }
      } else {
        console.log('❌ No tokens found in localStorage');
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error);
    }

    console.log("🚀 Making request:", JSON.stringify({
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      hasAuth: !!config.headers.Authorization,
      authHeader: config.headers.Authorization ? String(config.headers.Authorization).substring(0, 20) + "..." : "none"
    }, null, 2));
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response received:", JSON.stringify({
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      dataPreview: response.data ? Object.keys(response.data) : "no data"
    }, null, 2));
    return response;
  },
  (error) => {
    console.error("❌ Response interceptor error:", JSON.stringify({
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      responseData: error.response?.data
    }, null, 2));
    return Promise.reject(error);
  }
);

// Add request interceptor for phoneAxiosInstance as well
phoneAxiosInstance.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    try {
      const tokens = localStorage.getItem('phonehub_tokens');
      if (tokens) {
        const tokenData = JSON.parse(tokens);
        const accessToken = tokenData.accessToken || tokenData.access_token || tokenData.token;
        const expiresIn = tokenData.expiresIn || tokenData.expires_in;
        
        if (accessToken) {
          const tokenAge = Date.now() - (tokenData.issuedAt || 0);
          const isExpired = expiresIn && tokenAge > (expiresIn * 1000);
          
          if (!isExpired) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }
      }
    } catch (error) {
      console.warn('Failed to get auth token for phoneAxiosInstance:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for phoneAxiosInstance
phoneAxiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// v1AxiosInstance is now an alias for axiosInstance, so no separate interceptors needed

export default axiosInstance;
