
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, ChevronDown, ChevronUp } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  name: string;
  foods: Food[];
  isExpanded: boolean;
}

const Nutrition: React.FC = () => {
  // Sample data
  const dailyGoal = 2000;
  const [meals, setMeals] = useState<Meal[]>([
    {
      name: "Breakfast",
      foods: [
        { id: "1", name: "Oatmeal with banana", calories: 320, protein: 12, carbs: 58, fat: 5 },
        { id: "2", name: "Coffee with milk", calories: 60, protein: 2, carbs: 3, fat: 3 }
      ],
      isExpanded: true
    },
    {
      name: "Lunch",
      foods: [
        { id: "3", name: "Grilled chicken salad", calories: 380, protein: 35, carbs: 15, fat: 12 }
      ],
      isExpanded: false
    },
    {
      name: "Dinner",
      foods: [],
      isExpanded: false
    },
    {
      name: "Snacks",
      foods: [
        { id: "4", name: "Protein bar", calories: 220, protein: 20, carbs: 25, fat: 7 }
      ],
      isExpanded: false
    }
  ]);

  const [newFood, setNewFood] = useState<Partial<Food>>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const [selectedMeal, setSelectedMeal] = useState("Breakfast");

  // Calculate totals
  const totalCalories = meals.flatMap(meal => meal.foods).reduce((sum, food) => sum + food.calories, 0);
  const totalProtein = meals.flatMap(meal => meal.foods).reduce((sum, food) => sum + food.protein, 0);
  const totalCarbs = meals.flatMap(meal => meal.foods).reduce((sum, food) => sum + food.carbs, 0);
  const totalFat = meals.flatMap(meal => meal.foods).reduce((sum, food) => sum + food.fat, 0);
  
  const calorieProgress = Math.min(Math.round((totalCalories / dailyGoal) * 100), 100);
  const remainingCalories = dailyGoal - totalCalories;

  // Toggle meal expansion
  const toggleMeal = (mealName: string) => {
    setMeals(meals.map(meal => 
      meal.name === mealName 
        ? { ...meal, isExpanded: !meal.isExpanded } 
        : meal
    ));
  };

  // Add a new food
  const addFood = () => {
    if (!newFood.name) return;
    
    const food: Food = {
      id: Date.now().toString(),
      name: newFood.name,
      calories: newFood.calories || 0,
      protein: newFood.protein || 0,
      carbs: newFood.carbs || 0,
      fat: newFood.fat || 0
    };
    
    setMeals(meals.map(meal => 
      meal.name === selectedMeal 
        ? { ...meal, foods: [...meal.foods, food] } 
        : meal
    ));
    
    setNewFood({
      name: "",
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    });
  };

  return (
    <div className="container mx-auto p-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Nutrition Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main calorie tracker */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Calorie Intake</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Consumed: {totalCalories} kcal</span>
                  <span className="text-muted-foreground">Goal: {dailyGoal} kcal</span>
                </div>
                <Progress value={calorieProgress} className="h-3" />
                <p className="mt-2 text-center font-medium text-lg">
                  {remainingCalories > 0 
                    ? `You can consume ${remainingCalories} more calories today` 
                    : "You've reached your calorie goal for today"}
                </p>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Log Food
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Food</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="meal">Meal</Label>
                      <select 
                        id="meal"
                        className="w-full p-2 border rounded"
                        value={selectedMeal}
                        onChange={(e) => setSelectedMeal(e.target.value)}
                      >
                        {meals.map(meal => (
                          <option key={meal.name} value={meal.name}>{meal.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="foodName">Food Name</Label>
                      <Input 
                        id="foodName"
                        value={newFood.name} 
                        onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="calories">Calories</Label>
                        <Input 
                          id="calories"
                          type="number" 
                          value={newFood.calories || ''} 
                          onChange={(e) => setNewFood({...newFood, calories: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="protein">Protein (g)</Label>
                        <Input 
                          id="protein"
                          type="number" 
                          value={newFood.protein || ''} 
                          onChange={(e) => setNewFood({...newFood, protein: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="carbs">Carbs (g)</Label>
                        <Input 
                          id="carbs"
                          type="number" 
                          value={newFood.carbs || ''} 
                          onChange={(e) => setNewFood({...newFood, carbs: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fat">Fat (g)</Label>
                        <Input 
                          id="fat"
                          type="number" 
                          value={newFood.fat || ''} 
                          onChange={(e) => setNewFood({...newFood, fat: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={addFood} className="w-full">
                      Add Food
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Meal Log</h2>
            {meals.map((meal) => (
              <Card key={meal.name}>
                <CardHeader className="pb-2 cursor-pointer" onClick={() => toggleMeal(meal.name)}>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{meal.name}</CardTitle>
                    <Button variant="ghost" size="sm">
                      {meal.isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {meal.foods.length === 0 
                      ? "No foods logged" 
                      : `${meal.foods.reduce((sum, food) => sum + food.calories, 0)} calories`}
                  </p>
                </CardHeader>
                
                {meal.isExpanded && (
                  <CardContent>
                    {meal.foods.length === 0 ? (
                      <p className="text-muted-foreground text-center py-2">
                        No foods logged for this meal
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {meal.foods.map((food) => (
                          <div key={food.id} className="flex justify-between py-2 border-b last:border-0">
                            <div>
                              <p className="font-medium">{food.name}</p>
                              <p className="text-xs text-muted-foreground">
                                P: {food.protein}g • C: {food.carbs}g • F: {food.fat}g
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{food.calories} kcal</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
        
        {/* Macros summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Macros Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Protein</span>
                    <span className="text-sm">{totalProtein}g</span>
                  </div>
                  <Progress value={totalProtein > 0 ? 100 : 0} className="h-2 bg-blue-100" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Carbs</span>
                    <span className="text-sm">{totalCarbs}g</span>
                  </div>
                  <Progress value={totalCarbs > 0 ? 100 : 0} className="h-2 bg-green-100" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Fat</span>
                    <span className="text-sm">{totalFat}g</span>
                  </div>
                  <Progress value={totalFat > 0 ? 100 : 0} className="h-2 bg-yellow-100" />
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="font-medium mb-2">Macro Distribution</h3>
                <div className="bg-muted h-4 rounded-full overflow-hidden flex">
                  {totalCalories > 0 ? (
                    <>
                      <div 
                        className="bg-blue-500 h-full" 
                        style={{ width: `${(totalProtein * 4 / totalCalories) * 100}%` }} 
                        title="Protein"
                      ></div>
                      <div 
                        className="bg-green-500 h-full" 
                        style={{ width: `${(totalCarbs * 4 / totalCalories) * 100}%` }} 
                        title="Carbs"
                      ></div>
                      <div 
                        className="bg-yellow-500 h-full" 
                        style={{ width: `${(totalFat * 9 / totalCalories) * 100}%` }} 
                        title="Fat"
                      ></div>
                    </>
                  ) : (
                    <div className="bg-gray-300 h-full w-full"></div>
                  )}
                </div>
                
                <div className="flex justify-between mt-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span>Protein ({Math.round((totalProtein * 4 / totalCalories) * 100) || 0}%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span>Carbs ({Math.round((totalCarbs * 4 / totalCalories) * 100) || 0}%)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                    <span>Fat ({Math.round((totalFat * 9 / totalCalories) * 100) || 0}%)</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <h3 className="font-medium">Low-cal Snack Options</h3>
                <ul className="text-sm space-y-1">
                  <li className="flex justify-between">
                    <span>Greek yogurt</span>
                    <span className="text-muted-foreground">100 kcal</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Apple with cinnamon</span>
                    <span className="text-muted-foreground">80 kcal</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Carrot sticks</span>
                    <span className="text-muted-foreground">50 kcal</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Rice cake with avocado</span>
                    <span className="text-muted-foreground">120 kcal</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Nutrition;
