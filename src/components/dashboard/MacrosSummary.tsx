
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface MacrosSummaryProps {
  protein: number;
  carbs: number;
  fat: number;
  totalCalories: number;
  calorieGoal: number;
}

const MacrosSummary: React.FC<MacrosSummaryProps> = ({
  protein,
  carbs,
  fat,
  totalCalories,
  calorieGoal
}) => {
  // Calculate percentages
  const total = protein + carbs + fat;
  const proteinPercentage = total > 0 ? Math.round((protein / total) * 100) : 0;
  const carbsPercentage = total > 0 ? Math.round((carbs / total) * 100) : 0;
  const fatPercentage = total > 0 ? Math.round((fat / total) * 100) : 0;
  
  // Calculate calories from macros
  const proteinCalories = protein * 4;
  const carbsCalories = carbs * 4;
  const fatCalories = fat * 9;
  
  // Prepare data for pie chart
  const data = [
    { name: `Protein (${proteinPercentage}%)`, value: protein, calories: proteinCalories },
    { name: `Carbs (${carbsPercentage}%)`, value: carbs, calories: carbsCalories },
    { name: `Fat (${fatPercentage}%)`, value: fat, calories: fatCalories },
  ];
  
  // Colors for the pie chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658'];
  
  // Calculate calorie percentage
  const caloriePercentage = Math.min(100, Math.round((totalCalories / calorieGoal) * 100));
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">Macros Summary</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between">
          <div className="w-full md:w-1/2 space-y-2 mt-4 md:mt-0">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 bg-[#8884d8]/10 rounded-md">
                <p className="text-xs text-muted-foreground">Protein</p>
                <p className="font-semibold">{protein}g</p>
                <p className="text-xs">{proteinCalories} kcal</p>
              </div>
              <div className="p-2 bg-[#82ca9d]/10 rounded-md">
                <p className="text-xs text-muted-foreground">Carbs</p>
                <p className="font-semibold">{carbs}g</p>
                <p className="text-xs">{carbsCalories} kcal</p>
              </div>
              <div className="p-2 bg-[#ffc658]/10 rounded-md">
                <p className="text-xs text-muted-foreground">Fat</p>
                <p className="font-semibold">{fat}g</p>
                <p className="text-xs">{fatCalories} kcal</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Daily Calories</p>
                <p className="text-sm font-medium">{totalCalories} / {calorieGoal} kcal</p>
              </div>
              <div className="h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className="h-2 bg-primary rounded-full" 
                  style={{ width: `${caloriePercentage}%` }}
                />
              </div>
              <p className="text-xs text-right mt-1 text-muted-foreground">
                {caloriePercentage}% of daily goal
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}g`, 'Amount']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MacrosSummary;
