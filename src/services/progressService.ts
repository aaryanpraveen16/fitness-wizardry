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
export interface ProgressDto {
  workoutDaysStreak: number;
  dailyCalorieIntake: number;
  userWeight: number;
  currentDate?: string;
  evaluationType: string;
}

export interface Progress {
  id?: number;
  userId: number;
  workoutDaysStreak: number;
  dailyCalorieIntake: number;
  userWeight: number;
  currentInputDate: string;
  evaluationType: string;
}

// Log a new progress entry
export const logProgress = async (progressDto: ProgressDto): Promise<string> => {
  try {
    const response = await api.post<string>('/progress/log', progressDto);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to log progress');
    }
    throw error;
  }
};

// Get all progress entries for the current user
export const getAllProgress = async (): Promise<Progress[]> => {
  try {
    const response = await api.get<Progress[]>('/progress/all');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get progress');
    }
    throw error;
  }
};

// Get today's progress for the current user
export const getTodayProgress = async (): Promise<Progress | null> => {
  try {
    const response = await api.get<Progress>('/progress/today');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get today\'s progress');
    }
    throw error;
  }
};

// Update a progress entry
export const updateProgress = async (progressDto: ProgressDto): Promise<string> => {
  try {
    const response = await api.put<string>('/progress/log', progressDto);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update progress');
    }
    throw error;
  }
};

// Delete a progress entry
export const deleteProgress = async (): Promise<string> => {
  try {
    const response = await api.delete<string>('/progress/log');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete progress');
    }
    throw error;
  }
};

// Evaluate progress
export const evaluateProgress = async (type: string = 'daily'): Promise<string> => {
  try {
    const response = await api.get<string>('/progress/evaluate', {
      params: { type }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to evaluate progress');
    }
    throw error;
  }
};
