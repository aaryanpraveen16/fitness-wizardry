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

// Define workout types
export interface Exercise {
  id?: number;
  name: string;
  sets?: number;
  reps?: string;
  weight?: string;
  duration?: string;
  distance?: string;
  notes?: string;
  completed?: boolean;
}

export interface Workout {
  id?: number;
  userId: number;
  name: string;
  date: string;
  type: string;
  exercises: Exercise[];
  completed?: boolean;
  duration?: number;
  notes?: string;
}

export interface WorkoutPlan {
  id: number;
  title: string;
  description: string;
  duration: string;
  frequency: string;
  difficulty: string;
  image: string;
  category: string;
  workouts: Workout[];
}

// Local storage keys
const WORKOUT_LOG_KEY = 'fitnessApp_workoutLog';
const WORKOUT_PLANS_KEY = 'fitnessApp_workoutPlans';

// Get workouts from local storage
export const getWorkouts = (userId: number): Workout[] => {
  const storedWorkouts = localStorage.getItem(WORKOUT_LOG_KEY);
  if (!storedWorkouts) return [];
  
  const allWorkouts = JSON.parse(storedWorkouts) as Workout[];
  return allWorkouts.filter(workout => workout.userId === userId);
};

// Get workouts for a specific date
export const getWorkoutsByDate = (userId: number, date: string): Workout[] => {
  const allWorkouts = getWorkouts(userId);
  return allWorkouts.filter(workout => workout.date === date);
};

// Save a workout to local storage
export const saveWorkout = (workout: Workout): Workout => {
  const existingWorkouts = JSON.parse(localStorage.getItem(WORKOUT_LOG_KEY) || '[]') as Workout[];
  
  // Check if workout with this ID exists
  const workoutIndex = workout.id 
    ? existingWorkouts.findIndex(w => w.id === workout.id) 
    : -1;
  
  if (workoutIndex >= 0) {
    // Update existing workout
    existingWorkouts[workoutIndex] = workout;
  } else {
    // Add new workout with generated ID
    workout.id = Date.now();
    existingWorkouts.push(workout);
  }
  
  localStorage.setItem(WORKOUT_LOG_KEY, JSON.stringify(existingWorkouts));
  return workout;
};

// Delete a workout
export const deleteWorkout = (workoutId: number): boolean => {
  const existingWorkouts = JSON.parse(localStorage.getItem(WORKOUT_LOG_KEY) || '[]') as Workout[];
  const filteredWorkouts = existingWorkouts.filter(w => w.id !== workoutId);
  
  if (filteredWorkouts.length < existingWorkouts.length) {
    localStorage.setItem(WORKOUT_LOG_KEY, JSON.stringify(filteredWorkouts));
    return true;
  }
  
  return false;
};

// Complete an exercise in a workout
export const toggleExerciseCompletion = (workoutId: number, exerciseId: number): boolean => {
  const existingWorkouts = JSON.parse(localStorage.getItem(WORKOUT_LOG_KEY) || '[]') as Workout[];
  const workoutIndex = existingWorkouts.findIndex(w => w.id === workoutId);
  
  if (workoutIndex >= 0) {
    const workout = existingWorkouts[workoutIndex];
    const exerciseIndex = workout.exercises.findIndex(e => e.id === exerciseId);
    
    if (exerciseIndex >= 0) {
      // Toggle the completed status
      workout.exercises[exerciseIndex].completed = !workout.exercises[exerciseIndex].completed;
      existingWorkouts[workoutIndex] = workout;
      localStorage.setItem(WORKOUT_LOG_KEY, JSON.stringify(existingWorkouts));
      return true;
    }
  }
  
  return false;
};

// Get workout plans from local storage
export const getWorkoutPlans = (): WorkoutPlan[] => {
  const storedPlans = localStorage.getItem(WORKOUT_PLANS_KEY);
  if (!storedPlans) {
    // Initialize with default plans if none exist
    localStorage.setItem(WORKOUT_PLANS_KEY, JSON.stringify(defaultWorkoutPlans));
    return defaultWorkoutPlans;
  }
  
  return JSON.parse(storedPlans) as WorkoutPlan[];
};

// Get a specific workout plan
export const getWorkoutPlanById = (planId: number): WorkoutPlan | undefined => {
  const plans = getWorkoutPlans();
  return plans.find(plan => plan.id === planId);
};

// Save a workout plan to local storage
export const saveWorkoutPlan = (plan: WorkoutPlan): WorkoutPlan => {
  const existingPlans = getWorkoutPlans();
  
  // Check if plan with this ID exists
  const planIndex = existingPlans.findIndex(p => p.id === plan.id);
  
  if (planIndex >= 0) {
    // Update existing plan
    existingPlans[planIndex] = plan;
  } else {
    // Add new plan with generated ID if it doesn't have one
    if (!plan.id) {
      plan.id = Date.now();
    }
    existingPlans.push(plan);
  }
  
  localStorage.setItem(WORKOUT_PLANS_KEY, JSON.stringify(existingPlans));
  return plan;
};

// Assign a workout plan to a user
export const assignWorkoutPlan = (userId: number, planId: number): boolean => {
  const plan = getWorkoutPlanById(planId);
  if (!plan) return false;
  
  // Get existing workouts once
  const existingWorkouts = JSON.parse(localStorage.getItem(WORKOUT_LOG_KEY) || '[]') as Workout[];
  
  // Create workouts from the plan
  const newWorkouts = plan.workouts.map(workout => ({
    ...workout,
    id: Date.now() + Math.floor(Math.random() * 1000), // Generate unique IDs
    userId
  }));
  
  // Add all new workouts at once
  const updatedWorkouts = [...existingWorkouts, ...newWorkouts];
  
  // Save all workouts in a single localStorage operation
  localStorage.setItem(WORKOUT_LOG_KEY, JSON.stringify(updatedWorkouts));
  
  return true;
};

// Default workout plans
export const defaultWorkoutPlans: WorkoutPlan[] = [
  {
    id: 1,
    title: "Beginner Strength",
    description: "Perfect for those new to strength training",
    duration: "4 weeks",
    frequency: "3x per week",
    difficulty: "Beginner",
    category: "strength",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    workouts: [
      {
        id: 101,
        userId: 0, // Will be replaced with actual userId when assigned
        name: "Full Body Workout A",
        date: "", // Will be set when assigned
        type: "strength",
        exercises: [
          { id: 1001, name: "Bodyweight Squats", sets: 3, reps: "12", notes: "Focus on form" },
          { id: 1002, name: "Push-ups", sets: 3, reps: "8-10", notes: "Modify on knees if needed" },
          { id: 1003, name: "Dumbbell Rows", sets: 3, reps: "10", weight: "5-10 lbs" },
          { id: 1004, name: "Plank", sets: 3, duration: "30 sec" }
        ]
      },
      {
        id: 102,
        userId: 0,
        name: "Full Body Workout B",
        date: "",
        type: "strength",
        exercises: [
          { id: 1005, name: "Lunges", sets: 3, reps: "10 each leg" },
          { id: 1006, name: "Dumbbell Press", sets: 3, reps: "10", weight: "5-10 lbs" },
          { id: 1007, name: "Lat Pulldowns", sets: 3, reps: "12", weight: "Adjustable" },
          { id: 1008, name: "Russian Twists", sets: 3, reps: "12 each side" }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "HIIT Challenge",
    description: "High intensity interval training for maximum calorie burn",
    duration: "4 weeks",
    frequency: "4x per week",
    difficulty: "Intermediate",
    category: "cardio",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    workouts: [
      {
        id: 201,
        userId: 0,
        name: "HIIT Session 1",
        date: "",
        type: "cardio",
        exercises: [
          { id: 2001, name: "Jumping Jacks", duration: "45 sec", notes: "Rest 15 sec between exercises" },
          { id: 2002, name: "Mountain Climbers", duration: "45 sec" },
          { id: 2003, name: "Burpees", duration: "45 sec" },
          { id: 2004, name: "High Knees", duration: "45 sec" },
          { id: 2005, name: "Rest", duration: "1 min" },
          { id: 2006, name: "Repeat 3-5 times", notes: "Take 2-3 minute rest between circuits" }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Yoga Flow",
    description: "Enhance flexibility and mindfulness",
    duration: "Ongoing",
    frequency: "Daily",
    difficulty: "All levels",
    category: "flexibility",
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    workouts: [
      {
        id: 301,
        userId: 0,
        name: "Morning Yoga Flow",
        date: "",
        type: "flexibility",
        exercises: [
          { id: 3001, name: "Sun Salutations", duration: "5 min" },
          { id: 3002, name: "Warrior Poses", duration: "5 min" },
          { id: 3003, name: "Balance Poses", duration: "5 min" },
          { id: 3004, name: "Seated Stretches", duration: "5 min" },
          { id: 3005, name: "Savasana", duration: "5 min" }
        ]
      }
    ]
  }
];
