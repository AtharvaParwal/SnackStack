import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Token management
export const setAuthToken = (token) => {
  if (token) {
    // Store token in localStorage
    localStorage.setItem('authToken', token);
    // Set default header for all axios requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Remove token from localStorage
    localStorage.removeItem('authToken');
    // Remove default header
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Get token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Handle authentication errors
export const handleAuthError = (error, shouldLogout = true) => {
  if (error.response?.status === 401 && shouldLogout) {
    console.log('Authentication failed, logging out...');
    logout();
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

// Initialize auth (call this on app start)
export const initializeAuth = () => {
  const token = getAuthToken();
  if (token) {
    setAuthToken(token);
  }
};

// Login function
export const login = async (email, password, loginType = 'buyer') => {
  try {
    const endpoint = loginType === 'buyer' ? API_ENDPOINTS.BUYER_LOGIN : API_ENDPOINTS.LOGIN;
    const response = await axios.post(endpoint, { email, password });
    
    const { token, user, userType } = response.data;
    
    // Set token in axios headers and localStorage
    setAuthToken(token);
    
    // Store minimal user info and auth status
    localStorage.setItem('userType', userType);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('status', 'loggedIn'); // For backward compatibility
    
    return { success: true, user, userType, token };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Login failed' 
    };
  }
};

// Logout function
export const logout = async () => {
  try {
    // Call logout endpoint (optional with JWT)
    await axios.post(API_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    // Clear all auth data
    setAuthToken(null);
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    localStorage.removeItem('status');
    localStorage.clear(); // Clear everything for clean logout
    
    // Redirect to login
    window.location.href = '/login';
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.PROFILE);
    return { success: true, user: response.data };
  } catch (error) {
    console.error('Profile fetch error:', error);
    
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch profile',
      status: error.response?.status
    };
  }
};

// Verify token
export const verifyToken = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.VERIFY_TOKEN);
    return { success: true, user: response.data.user };
  } catch (error) {
    console.error('Token verification error:', error);
    
    return { 
      success: false, 
      error: 'Invalid token',
      status: error.response?.status
    };
  }
};

// Update profile
export const updateProfile = async (profileData) => {
  try {
    const userType = localStorage.getItem('userType');
    const endpoint = userType === 'Buyer' ? API_ENDPOINTS.UPDATE_BUYER : API_ENDPOINTS.UPDATE_VENDOR;
    
    const response = await axios.post(endpoint, profileData);
    return { success: true, user: response.data };
  } catch (error) {
    console.error('Profile update error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to update profile' 
    };
  }
};

export default {
  setAuthToken,
  getAuthToken,
  isAuthenticated,
  initializeAuth,
  login,
  logout,
  getUserProfile,
  verifyToken,
  updateProfile
};
