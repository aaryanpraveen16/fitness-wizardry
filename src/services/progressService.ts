
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
  profileId?: number; // Added to support multiple profiles
  date: string;
  workoutMinutes?: number;
  caloriesBurned?: number;
  steps?: number;
  weight?: number;
  bodyFat?: number;
  mood?: string;
  notes?: string;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    thighs?: number;
    arms?: number;
  };
}

// Local storage key
const PROGRESS_KEY = 'fitnessApp_progress';

// Get all progress entries from local storage
const getAllProgress = (): ProgressEntry[] => {
  const storedProgress = localStorage.getItem(PROGRESS_KEY);
  if (!storedProgress) return [];
  return JSON.parse(storedProgress) as ProgressEntry[];
};

// Save progress entries to local storage
const saveAllProgress = (entries: ProgressEntry[]): void => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(entries));
};

// Log a new progress entry
export const logProgress = async (entry: ProgressEntry): Promise<ProgressEntry> => {
  try {
    // For API implementation:
    // const response = await api.post<ProgressEntry>('/progress', entry);
    // return response.data;
    
    // Local storage implementation:
    const allEntries = getAllProgress();
    const newEntry = {
      ...entry,
      id: Date.now()
    };
    
    allEntries.push(newEntry);
    saveAllProgress(allEntries);
    
    return newEntry;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to log progress');
    }
    throw error;
  }
};

// Get all progress entries for a user
export const getProgressByUser = async (userId: number, profileId?: number): Promise<ProgressEntry[]> => {
  try {
    // For API implementation:
    // const response = await api.get<ProgressEntry[]>(`/progress/${userId}`);
    // return response.data;
    
    // Local storage implementation:
    const allEntries = getAllProgress();
    return allEntries.filter(entry => {
      if (profileId) {
        return entry.userId === userId && entry.profileId === profileId;
      }
      return entry.userId === userId;
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get progress');
    }
    throw error;
  }
};

// Get progress entries for a user within a date range
export const getProgressByDateRange = async (
  userId: number, 
  startDate: string, 
  endDate: string,
  profileId?: number
): Promise<ProgressEntry[]> => {
  try {
    // For API implementation:
    // const response = await api.get<ProgressEntry[]>(`/progress/${userId}/range`, {
    //   params: { startDate, endDate, profileId }
    // });
    // return response.data;
    
    // Local storage implementation:
    const userEntries = await getProgressByUser(userId, profileId);
    return userEntries.filter(entry => {
      const entryDate = new Date(entry.date).getTime();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      return entryDate >= start && entryDate <= end;
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get progress');
    }
    throw error;
  }
};

// Get the latest progress entry for a user
export const getLatestProgress = async (userId: number, profileId?: number): Promise<ProgressEntry | null> => {
  try {
    // For API implementation:
    // const response = await api.get<ProgressEntry>(`/progress/${userId}/latest`);
    // return response.data;
    
    // Local storage implementation:
    const userEntries = await getProgressByUser(userId, profileId);
    if (userEntries.length === 0) return null;
    
    // Sort by date (newest first) and return the first one
    return userEntries.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })[0];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get latest progress');
    }
    throw error;
  }
};

// Update a progress entry
export const updateProgress = async (entry: ProgressEntry): Promise<ProgressEntry> => {
  try {
    // For API implementation:
    // const response = await api.put<ProgressEntry>(`/progress/${entry.id}`, entry);
    // return response.data;
    
    // Local storage implementation:
    const allEntries = getAllProgress();
    const entryIndex = allEntries.findIndex(e => e.id === entry.id);
    
    if (entryIndex >= 0) {
      allEntries[entryIndex] = entry;
      saveAllProgress(allEntries);
      return entry;
    }
    
    throw new Error('Progress entry not found');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update progress');
    }
    throw error;
  }
};

// Delete a progress entry
export const deleteProgress = async (entryId: number): Promise<boolean> => {
  try {
    // For API implementation:
    // await api.delete(`/progress/${entryId}`);
    // return true;
    
    // Local storage implementation:
    const allEntries = getAllProgress();
    const filteredEntries = allEntries.filter(e => e.id !== entryId);
    
    if (filteredEntries.length < allEntries.length) {
      saveAllProgress(filteredEntries);
      return true;
    }
    
    return false;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete progress');
    }
    throw error;
  }
};
