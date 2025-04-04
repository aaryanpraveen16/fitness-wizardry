
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Nutrition = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample nutrition data
  const dailyCalories = {
    consumed: 1350,
    goal: 2000,
    remaining: 650
  };
  
  const macros = {
    protein: { consumed: 85, goal: 150, percentage: 56 },
    carbs: { consumed: 120, goal: 200, percentage: 60 },
    fat: { consumed: 45, goal: 65, percentage: 69 }
  };
  
  const meals = [
    {
      type: "breakfast",
      foods: [
        { name: "Oatmeal with berries", calories: 320, protein: 12, carbs: 45, fat: 8 },
        { name: "Greek Yogurt", calories: 150, protein: 15, carbs: 8, fat: 5 }
      ]
    },
    {
      type: "lunch",
      foods: [
        { name: "Grilled Chicken Salad", calories: 420, protein: 35, carbs: 25, fat: 18 }
      ]
    },
    {
      type: "dinner",
      foods: [
        { name: "Salmon with vegetables", calories: 460, protein: 36, carbs: 20, fat: 24 }
      ]
    },
    {
      type: "snacks",
      foods: [
        { name: "Apple with almond butter", calories: 220, protein: 7, carbs: 22, fat: 14 }
      ]
    }
  ];
  
  // Sample food database for search
  const foodDatabase = [
    { name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
    { name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
    { name: "Greek Yogurt", calories: 100, protein: 10, carbs: 4, fat: 2.5 },
    { name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: "Salmon Fillet", calories: 206, protein: 22, carbs: 0, fat: 13 },
    { name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 1.8 },
    { name: "Sweet Potato", calories: 112, protein: 2, carbs: 26, fat: 0.1 },
  ];
  
  const [searchResults, setSearchResults] = useState([]);
  
  const handleSearch = () => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    
    const results = foodDatabase.filter(food => 
      food.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
  };
  
  const handleAddFood = (food) => {
    toast({
      title: "Food added",
      description: `${food.name} added to your log`,
    });
    setSearchResults([]);
    setSearchQuery("");
  };
  
  const handleLogCustomFood = () => {
    toast({
      title: "Custom food",
      description: "Add your own food and nutritional information",
    });
  };

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl">
      <div className="flex flex-col items-start space-y-4">
        <h1 className="text-3xl font-bold">Nutrition Tracker</h1>
        <p className="text-muted-foreground mb-6">
          Track your meals and monitor your nutritional intake.
        </p>
        
        {/* Daily Calorie Summary */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Daily Calorie Tracker</CardTitle>
            <CardDescription>
              Your calorie intake for today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Daily Goal: {dailyCalories.goal} kcal</span>
                <span>Consumed: {dailyCalories.consumed} kcal</span>
              </div>
              <Progress value={(dailyCalories.consumed / dailyCalories.goal) * 100} />
              <div className="flex items-center justify-end text-sm text-muted-foreground">
                <ArrowDown className="h-4 w-4 mr-1" />
                <span>{dailyCalories.remaining} kcal remaining</span>
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
                  {meals.map((meal, i) => (
                    <div key={i} className="space-y-2">
                      <h3 className="font-medium capitalize">{meal.type}</h3>
                      {meal.foods.map((food, j) => (
                        <div key={j} className="flex justify-between items-center py-2 border-b">
                          <div>
                            <p>{food.name}</p>
                            <p className="text-sm text-muted-foreground">
                              P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                            </p>
                          </div>
                          <p className="font-medium">{food.calories} kcal</p>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" className="flex items-center mt-2">
                        <Plus className="h-4 w-4 mr-1" /> Add food to {meal.type}
                      </Button>
                    </div>
                  ))}
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
                            <Button size="sm" onClick={() => handleAddFood(food)}>Add</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-center">
                    <Button variant="outline" onClick={handleLogCustomFood}>
                      <Plus className="h-4 w-4 mr-2" /> Log custom food
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Nutrition;
