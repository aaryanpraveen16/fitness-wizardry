import axios from 'axios';
import { getToken } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to add token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Define progress types
export interface ProgressEntry {
  id?: number;
  userId: number;
  date: string;
  workoutMinutes?: number;
  caloriesBurned?: number;
  steps?: number;
  mood?: string;
}

// Log a new progress entry
export const logProgress = async (entry: ProgressEntry) => {
  try {
    const response = await api.post<ProgressEntry>('/progress', entry);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to log progress');
    }
    throw error;
  }
};

// Get all progress entries for a user
export const getProgressByUser = async (userId: number) => {
  try {
    const response = await api.get<ProgressEntry[]>(`/progress/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get progress');
    }
    throw error;
  }
};

// Get progress entries for a user within a date range
export const getProgressByDateRange = async (userId: number, startDate: string, endDate: string) => {
  try {
    const response = await api.get<ProgressEntry[]>(`/progress/${userId}/range`, {
      params: { startDate, endDate }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get progress');
    }
    throw error;
  }
};

// Get the latest progress entry for a user
export const getLatestProgress = async (userId: number) => {
  try {
    const response = await api.get<ProgressEntry>(`/progress/${userId}/latest`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get latest progress');
    }
    throw error;
  }
}; 