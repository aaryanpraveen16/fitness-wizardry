import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowDown, 
  Plus, 
  Search, 
  Trash2, 
  Calendar,
  Utensils,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import FoodEntryModal from "@/components/nutrition/FoodEntryModal";
import { 
  Food, 
  Meal, 
  getMeals, 
  addFoodToMeal, 
  removeFoodFromMeal, 
  searchFoods, 
  saveCustomFood, 
  calculateDailyNutrition,
  logFood
} from "@/services/foodService";

const Nutrition = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [userId, setUserId] = useState(1); // Default user ID for now
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [meals, setMeals] = useState<Meal[]>(() => {
    // Load meals from localStorage on initial render
    const savedMeals = localStorage.getItem(`meals-${selectedDate}`);
    return savedMeals ? JSON.parse(savedMeals) : [];
  });
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<Meal['type'] | null>(null);
  
  // Daily nutrition totals
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  
  // Daily goals
  const [dailyGoals, setDailyGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
  });

  // Save meals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`meals-${selectedDate}`, JSON.stringify(meals));
  }, [meals, selectedDate]);

  // Load meals and calculate totals on mount and when date/userId changes
  useEffect(() => {
    loadMeals();
  }, [selectedDate, userId]);

  const loadMeals = async () => {
    try {
      // First try to load from localStorage
      const savedMeals = localStorage.getItem(`meals-${selectedDate}`);
      if (savedMeals) {
        setMeals(JSON.parse(savedMeals));
        return;
      }

      // If not in localStorage, fetch from backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/food/meals?date=${selectedDate}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch meals');
      }
      
      const fetchedMeals = await response.json();
      setMeals(fetchedMeals);
      
      // Save fetched meals to localStorage
      localStorage.setItem(`meals-${selectedDate}`, JSON.stringify(fetchedMeals));
      
      // Calculate daily totals
      const totals = calculateDailyNutrition(userId, selectedDate);
      setDailyTotals(totals);
    } catch (error) {
      console.error('Error loading meals:', error);
      toast({
        title: "Error",
        description: "Failed to load meals. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    
    const results = searchFoods(searchQuery, userId);
    setSearchResults(results);
  };
  
  const handleAddFood = async (food: Food) => {
    try {
      // Update meals state with the new food
      setMeals(prevMeals => {
        const updatedMeals = [...prevMeals];
        const mealIndex = updatedMeals.findIndex(m => m.type === selectedMealType);
        
        if (mealIndex !== -1) {
          updatedMeals[mealIndex] = {
            ...updatedMeals[mealIndex],
            foods: [...updatedMeals[mealIndex].foods, food]
          };
        } else {
          // Create new meal if it doesn't exist
          updatedMeals.push({
            userId,
            date: selectedDate,
            type: selectedMealType,
            foods: [food]
          });
        }
        
        return updatedMeals;
      });

      // Update daily totals
      setDailyTotals(prev => ({
        ...prev,
        calories: prev.calories + food.calories,
        protein: prev.protein + food.protein,
        carbs: prev.carbs + food.carbs,
        fat: prev.fat + food.fat
      }));

      toast({
        title: "Success",
        description: `Added ${food.name} to ${selectedMealType}`,
      });

      setShowFoodModal(false);
      setSelectedMealType(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add food. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleRemoveFood = async (mealId: number, foodId: number) => {
    try {
      // Remove food from backend
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/food/remove/${mealId}/${foodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove food');
      }

      // Update the meals state
      setMeals(prevMeals => {
        const updatedMeals = prevMeals.map(meal => {
          if (meal.id === mealId) {
            return {
              ...meal,
              foods: meal.foods.filter(food => food.id !== foodId)
            };
          }
          return meal;
        });
        return updatedMeals;
      });

      // Update daily totals
      const removedFood = meals
        .find(meal => meal.id === mealId)
        ?.foods.find(food => food.id === foodId);

      if (removedFood) {
        setDailyTotals(prev => ({
          ...prev,
          calories: prev.calories - removedFood.calories,
          protein: prev.protein - removedFood.protein,
          carbs: prev.carbs - removedFood.carbs,
          fat: prev.fat - removedFood.fat
        }));
      }

      toast({
        title: "Success",
        description: "Food removed successfully",
      });
    } catch (error) {
      console.error('Error removing food:', error);
      toast({
        title: "Error",
        description: "Failed to remove food. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveCustomFood = (food: Food) => {
    const savedFood = saveCustomFood(userId, food);
    
    toast({
      title: "Food saved",
      description: `${savedFood.name} added to your custom foods`,
    });
    
    // If a meal type was selected, add it to that meal
    if (selectedMealType) {
      handleAddFood(savedFood);
      setSelectedMealType(null);
    }
  };
  
  const openAddFoodModal = (mealType: Meal['type']) => {
    setSelectedMealType(mealType);
    setShowFoodModal(true);
  };
  
  // Get the appropriate meal by type
  const getMealByType = (type: Meal['type']): Meal => {
    const meal = meals.find(m => m.type === type);
    
    if (meal) return meal;
    
    // Return an empty meal structure if none exists
    return {
      id: 0, // Will be set when actually saving
      userId,
      date: selectedDate,
      type,
      foods: []
    };
  };
  
  // Calculate macro percentages
  const calculateMacroPercentage = (consumed: number, goal: number) => {
    return Math.min(Math.round((consumed / goal) * 100), 100);
  };
  
  const macros = {
    protein: { 
      consumed: dailyTotals.protein, 
      goal: dailyGoals.protein, 
      percentage: calculateMacroPercentage(dailyTotals.protein, dailyGoals.protein) 
    },
    carbs: { 
      consumed: dailyTotals.carbs, 
      goal: dailyGoals.carbs, 
      percentage: calculateMacroPercentage(dailyTotals.carbs, dailyGoals.carbs) 
    },
    fat: { 
      consumed: dailyTotals.fat, 
      goal: dailyGoals.fat, 
      percentage: calculateMacroPercentage(dailyTotals.fat, dailyGoals.fat) 
    }
  };
  
  // Calculate remaining calories
  const remainingCalories = dailyGoals.calories - dailyTotals.calories;

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl">
      <div className="flex flex-col items-start space-y-4">
        <h1 className="text-3xl font-bold">Nutrition Tracker</h1>
        <p className="text-muted-foreground mb-6">
          Track your meals and monitor your nutritional intake.
        </p>
        
        {/* Date Selector */}
        <div className="w-full flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>
        </div>
        
        {/* Daily Calorie Summary */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Daily Calorie Tracker</CardTitle>
            <CardDescription>
              Your calorie intake for {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Daily Goal: {dailyGoals.calories} kcal</span>
                <span>Consumed: {dailyTotals.calories} kcal</span>
              </div>
              <Progress value={(dailyTotals.calories / dailyGoals.calories) * 100} />
              <div className="flex items-center justify-end text-sm text-muted-foreground">
                <ArrowDown className="h-4 w-4 mr-1" />
                <span>{remainingCalories} kcal remaining</span>
              </div>
            </div>
            
            {/* Macros Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-base">Protein</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <Progress value={macros.protein.percentage} className="h-2" />
                  <div className="flex justify-between text-sm mt-1">
                    <span>{macros.protein.consumed}g</span>
                    <span className="text-muted-foreground">of {macros.protein.goal}g</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-base">Carbs</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <Progress value={macros.carbs.percentage} className="h-2" />
                  <div className="flex justify-between text-sm mt-1">
                    <span>{macros.carbs.consumed}g</span>
                    <span className="text-muted-foreground">of {macros.carbs.goal}g</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-base">Fat</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <Progress value={macros.fat.percentage} className="h-2" />
                  <div className="flex justify-between text-sm mt-1">
                    <span>{macros.fat.consumed}g</span>
                    <span className="text-muted-foreground">of {macros.fat.goal}g</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        {/* Meal Logging */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Log Your Meals</CardTitle>
            <CardDescription>
              Add food items to your daily log
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="log">
              <TabsList className="mb-4">
                <TabsTrigger value="log">Meal Log</TabsTrigger>
                <TabsTrigger value="search">Search Food</TabsTrigger>
              </TabsList>
              
              <TabsContent value="log">
                <div className="space-y-6">
                  {['breakfast', 'lunch', 'dinner', 'snacks'].map((mealType) => {
                    const meal = getMealByType(mealType as Meal['type']);
                    return (
                      <div key={mealType} className="space-y-2">
                        <h3 className="font-medium capitalize">{mealType}</h3>
                        {meal.foods.length > 0 ? (
                          meal.foods.map((food, j) => (
                            <div key={j} className="flex justify-between items-center py-2 border-b">
                              <div>
                                <p className="font-medium">{food.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium">{food.calories} kcal</p>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleRemoveFood(meal.id!, food.id!)}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <Alert className="bg-muted/50">
                            <AlertDescription className="flex items-center justify-center py-2 text-muted-foreground">
                              <Utensils className="h-4 w-4 mr-2" />
                              No foods logged for {mealType}
                            </AlertDescription>
                          </Alert>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center mt-2"
                          onClick={() => openAddFoodModal(mealType as Meal['type'])}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add food to {mealType}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="search">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search foods..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button onClick={handleSearch}>
                      <Search className="h-4 w-4 mr-2" /> Search
                    </Button>
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="border rounded-md">
                      {searchResults.map((food, i) => (
                        <div key={i} className="flex justify-between items-center p-3 border-b last:border-0">
                          <div>
                            <p className="font-medium">{food.name}</p>
                            <p className="text-sm text-muted-foreground">
                              P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{food.calories} kcal</span>
                            <div className="relative">
                              <Button 
                                size="sm" 
                                className="flex items-center gap-1"
                                onClick={() => handleAddFood(food)}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-center">
                    <Button variant="secondary" onClick={() => setShowFoodModal(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Create custom food
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Food Entry Modal */}
      {showFoodModal && (
        <FoodEntryModal
          isOpen={showFoodModal}
          onClose={() => setShowFoodModal(false)}
          onSave={handleAddFood}
          mealType={selectedMealType}
        />
      )}
    </div>
  );
};

export default Nutrition;
