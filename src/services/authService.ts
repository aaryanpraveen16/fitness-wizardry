import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Define auth types
export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  height: number;
  weight: number;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  height: number;
  weight: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Store token key
export const TOKEN_KEY = 'jwt';
export const USER_KEY = 'user';

// Login function
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    // First, get the token
    const response = await api.post<{ token: string }>('/auth/login', data);
    const { token } = response.data;
    
    console.log("Login successful, token received:", token ? "Token exists" : "No token");
    
    // Store token
    localStorage.setItem(TOKEN_KEY, token);
    console.log("Token stored in localStorage with key:", TOKEN_KEY);
    
    // Create a new axios instance with the token
    const authApi = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Extract email from token
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const email = tokenPayload.sub;
    console.log("Extracted email from token:", email);
    
    // Fetch user details using the email
    const encodedEmail = encodeURIComponent(email);
    console.log("Fetching user details for email:", email, "Encoded:", encodedEmail);
    const userResponse = await authApi.get<User>(`/auth/user/email/${encodedEmail}`);
    const user = userResponse.data;
    console.log("User details received:", user);
    
    // Store user data
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return {
      token,
      user
    };
  } catch (error) {
    console.error("Login error:", error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.response?.data || 'Login failed';
      throw new Error(errorMessage);
    }
    throw error;
  }
};

// Register function
export const register = async (data: RegisterRequest): Promise<User> => {
  try {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw error;
  }
};

// Get user details
export const getUserDetails = async (userId: number): Promise<User> => {
  try {
    const response = await api.get<User>(`/auth/user/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get user details');
    }
    throw error;
  }
};

// Update user
export const updateUser = async (userId: number, data: RegisterRequest): Promise<User> => {
  try {
    const response = await api.put<User>(`/auth/user/${userId}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId: number): Promise<string> => {
  try {
    const response = await api.delete<string>(`/auth/user/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
    throw error;
  }
};

// Get current user's token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Get current user from localStorage
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  toast("Logged out successfully");
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

// Parse JWT to get user information
export const getUserFromToken = (): User | null => {
  const token = getToken();
  
  if (!token) return null;
  
  try {
    // This is a simplified JWT parsing for the mock token
    // In a real app, use a proper JWT library
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    return {
      userId: payload.sub,
      firstName: payload.name,
      lastName: payload.lastName,
      email: payload.email,
      height: payload.height,
      weight: payload.weight
    };
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};

// Add interceptor to add token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
