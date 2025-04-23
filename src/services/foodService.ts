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
  console.log("Token retrieved:", token ? "Token exists" : "No token found");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Authorization header set:", config.headers.Authorization);
  }
  return config;
});

// Food and meal types
export interface Food {
  id?: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  userId?: number;
  isCustom?: boolean;
}

export interface FoodLogDto {
  foodName: string;
  mealType: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id?: number;
  userId: number;
  date: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  foods: Food[];
}

// Log food
export const logFood = async (foodLogDto: FoodLogDto): Promise<string> => {
  try {
    console.log("Attempting to log food:", foodLogDto);
    const response = await api.post<string>('/food/log', foodLogDto);
    console.log("Food logged successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error logging food:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw new Error(error.response?.data?.message || 'Failed to log food');
    }
    throw error;
  }
};

// Local storage keys
const FOOD_LOG_KEY = 'fitnessApp_foodLog';
const CUSTOM_FOODS_KEY = 'fitnessApp_customFoods';

// Get meals from local storage
export const getMeals = (userId: number, date: string): Meal[] => {
  const storedMeals = localStorage.getItem(FOOD_LOG_KEY);
  if (!storedMeals) return [];
  
  const allMeals = JSON.parse(storedMeals) as Meal[];
  return allMeals.filter(meal => meal.userId === userId && meal.date === date);
};

// Save a meal to local storage
export const saveMeal = (meal: Meal): Meal => {
  const existingMeals = JSON.parse(localStorage.getItem(FOOD_LOG_KEY) || '[]') as Meal[];
  
  // Check if meal with this ID exists
  const mealIndex = meal.id 
    ? existingMeals.findIndex(m => m.id === meal.id) 
    : -1;
  
  if (mealIndex >= 0) {
    // Update existing meal
    existingMeals[mealIndex] = meal;
  } else {
    // Add new meal with generated ID
    meal.id = Date.now();
    existingMeals.push(meal);
  }
  
  localStorage.setItem(FOOD_LOG_KEY, JSON.stringify(existingMeals));
  return meal;
};

// Add food to a meal
export const addFoodToMeal = async (userId: number, date: string, mealType: Meal['type'], food: Food): Promise<Meal> => {
  try {
    const foodLogDto: FoodLogDto = {
      foodName: food.name,
      mealType: mealType,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat
    };

    await logFood(foodLogDto);

    // Return the updated meal structure
    return {
      id: Date.now(),
      userId,
      date,
      type: mealType,
      foods: [food]
    };
  } catch (error) {
    console.error('Error adding food to meal:', error);
    throw error;
  }
};

// Remove food from a meal
export const removeFoodFromMeal = (mealId: number, foodId: number): boolean => {
  const existingMeals = JSON.parse(localStorage.getItem(FOOD_LOG_KEY) || '[]') as Meal[];
  const mealIndex = existingMeals.findIndex(m => m.id === mealId);
  
  if (mealIndex >= 0) {
    existingMeals[mealIndex].foods = existingMeals[mealIndex].foods.filter(f => f.id !== foodId);
    localStorage.setItem(FOOD_LOG_KEY, JSON.stringify(existingMeals));
    return true;
  }
  
  return false;
};

// Get custom foods for a user
export const getCustomFoods = (userId: number): Food[] => {
  const storedFoods = localStorage.getItem(CUSTOM_FOODS_KEY);
  if (!storedFoods) return [];
  
  const allFoods = JSON.parse(storedFoods) as Food[];
  return allFoods.filter(food => food.userId === userId);
};

// Save a custom food
export const saveCustomFood = (userId: number, food: Food): Food => {
  const existingFoods = JSON.parse(localStorage.getItem(CUSTOM_FOODS_KEY) || '[]') as Food[];
  
  const newFood = {
    ...food,
    id: Date.now(),
    userId,
    isCustom: true
  };
  
  existingFoods.push(newFood);
  localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(existingFoods));
  
  return newFood;
};

// Calculate daily nutrition totals
export const calculateDailyNutrition = (userId: number, date: string) => {
  const meals = getMeals(userId, date);
  
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };
  
  meals.forEach(meal => {
    meal.foods.forEach(food => {
      totals.calories += food.calories;
      totals.protein += food.protein;
      totals.carbs += food.carbs;
      totals.fat += food.fat;
    });
  });
  
  return totals;
};

// Food database
export const commonFoods: Food[] = [
  { id: 1, name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
  { id: 2, name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { id: 3, name: "Greek Yogurt", calories: 100, protein: 10, carbs: 4, fat: 2.5 },
  { id: 4, name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: 5, name: "Salmon Fillet", calories: 206, protein: 22, carbs: 0, fat: 13 },
  { id: 6, name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  { id: 7, name: "Sweet Potato", calories: 112, protein: 2, carbs: 26, fat: 0.1 },
  { id: 8, name: "Spinach", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { id: 9, name: "Eggs", calories: 78, protein: 6, carbs: 0.6, fat: 5 },
  { id: 10, name: "Almonds (1oz)", calories: 164, protein: 6, carbs: 6, fat: 14 },
  { id: 11, name: "Avocado", calories: 234, protein: 2.9, carbs: 12, fat: 21 },
  { id: 12, name: "Quinoa", calories: 222, protein: 8, carbs: 39, fat: 3.6 },
  { id: 13, name: "Cottage Cheese", calories: 206, protein: 28, carbs: 8, fat: 4.3 },
  { id: 14, name: "Broccoli", calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  { id: 15, name: "Oatmeal", calories: 150, protein: 5, carbs: 27, fat: 2.5 },
];

// Search foods in database and custom foods
export const searchFoods = (query: string, userId: number): Food[] => {
  const customFoods = getCustomFoods(userId);
  
  // Combine common foods and custom foods, then filter
  const allFoods = [...commonFoods, ...customFoods];
  
  return allFoods.filter(food => 
    food.name.toLowerCase().includes(query.toLowerCase())
  );
};
