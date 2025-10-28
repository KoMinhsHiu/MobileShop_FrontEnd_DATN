import { jwtDecode } from 'jwt-decode';

export interface JWTPayload {
  sub: number;
  username: string;
  email: string;
  role: string;
  iat: number;
  jti: string;
  exp: number;
}

/**
 * Decode JWT token and return the payload
 * @param token - JWT token string
 * @returns Decoded JWT payload or null if invalid
 */
export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param token - JWT token string
 * @returns true if token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // Consider invalid tokens as expired
  }
};

/**
 * Get user role from JWT token
 * @param token - JWT token string
 * @returns user role or null if invalid
 */
export const getUserRole = (token: string): string | null => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.role;
  } catch (error) {
    console.error('Error getting user role from token:', error);
    return null;
  }
};

/**
 * Get user ID from JWT token
 * @param token - JWT token string
 * @returns user ID or null if invalid
 */
export const getUserId = (token: string): number | null => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    return decoded.sub;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
};










