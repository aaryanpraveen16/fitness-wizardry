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
  user: {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    height: number;
    weight: number;
  };
  token: string;
}

// Store token key
const TOKEN_KEY = 'jwt';

// Login function
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', data);
    // Store token
    localStorage.setItem(TOKEN_KEY, response.data.token);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw error;
  }
};

// Mock signup function
export const signup = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  // Simulate API request
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const response: AuthResponse = {
        user: {
          userId: Math.floor(Math.random() * 1000),
          firstName: name.split(' ')[0], // Assuming 'name' is a full name separated by a space
          lastName: name.split(' ')[1], // Assuming 'name' is a full name separated by a space
          email: email,
          height: 0, // Default height, should be provided by actual user data
          weight: 0, // Default weight, should be provided by actual user data
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsIm5hbWUiOiJUZXN0IFVzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciJ9.eRkK1F0G8_nXBhr9gmgI9lUavj9qL0vvQ_9ZkkXaYJQ"
      };
      
      // Store token
      localStorage.setItem(TOKEN_KEY, response.token);
      
      resolve(response);
    }, 1000);
  });
};

// Get current user's token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
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

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', data);
    // Store token
    localStorage.setItem(TOKEN_KEY, response.data.token);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw error;
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
