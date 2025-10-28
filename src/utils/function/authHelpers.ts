import { decodeJWT, JWTPayload } from './jwtUtils';

/**
 * Get user role from localStorage token
 * @returns user role or null if not found/invalid
 */
export const getCurrentUserRole = (): string | null => {
  try {
    const tokens = localStorage.getItem('phonehub_tokens');
    if (!tokens) return null;
    
    const tokenData = JSON.parse(tokens);
    const accessToken = tokenData.accessToken;
    
    if (!accessToken) return null;
    
    const decoded = decodeJWT(accessToken);
    return decoded?.role || null;
  } catch (error) {
    console.error('Error getting current user role:', error);
    return null;
  }
};

/**
 * Check if current user is admin
 * @returns true if user is admin, false otherwise
 */
export const isCurrentUserAdmin = (): boolean => {
  return getCurrentUserRole() === 'admin';
};

/**
 * Check if current user is customer
 * @returns true if user is customer, false otherwise
 */
export const isCurrentUserCustomer = (): boolean => {
  return getCurrentUserRole() === 'customer';
};

/**
 * Get decoded token payload for debugging
 * @returns decoded token payload or null
 */
export const getDecodedTokenPayload = (): JWTPayload | null => {
  try {
    const tokens = localStorage.getItem('phonehub_tokens');
    if (!tokens) return null;
    
    const tokenData = JSON.parse(tokens);
    const accessToken = tokenData.accessToken;
    
    if (!accessToken) return null;
    
    return decodeJWT(accessToken);
  } catch (error) {
    console.error('Error getting decoded token payload:', error);
    return null;
  }
};

/**
 * Debug function to log token information
 */
export const debugTokenInfo = (): void => {
  const payload = getDecodedTokenPayload();
  if (payload) {
    console.log('🔐 JWT Token Debug Info:');
    console.log('📋 Decoded Payload:', payload);
    console.log('👤 User ID:', payload.sub);
    console.log('👤 Username:', payload.username);
    console.log('📧 Email:', payload.email);
    console.log('🔑 Role:', payload.role);
    console.log('⏰ Issued At:', new Date(payload.iat * 1000));
    console.log('⏰ Expires At:', new Date(payload.exp * 1000));
    console.log('🆔 JTI:', payload.jti);
  } else {
    console.log('❌ No valid token found');
  }
};










