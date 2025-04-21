
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils } from "lucide-react";

interface MealLoggedCardProps {
  meal: { name: string; calories: number; protein?: number; carbs?: number; fat?: number; mealType?: string };
}

const MealLoggedCard: React.FC<MealLoggedCardProps> = ({ meal }) => {
  // Generate a background color based on meal type
  const getBgColor = () => {
    switch (meal.mealType?.toLowerCase()) {
      case 'breakfast':
        return 'bg-blue-50 dark:bg-blue-900/20';
      case 'lunch':
        return 'bg-green-50 dark:bg-green-900/20';
      case 'dinner':
        return 'bg-purple-50 dark:bg-purple-900/20';
      case 'snacks':
        return 'bg-orange-50 dark:bg-orange-900/20';
      default:
        return 'bg-white/90';
    }
  };

  return (
    <Card className={`border shadow hover:shadow-md transition-shadow ${getBgColor()}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-primary" />
          <CardTitle className="text-base font-semibold">{meal.name}</CardTitle>
        </div>
        {meal.mealType && (
          <span className="text-xs font-medium text-muted-foreground bg-background/80 px-2 py-1 rounded-full">
            {meal.mealType}
          </span>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm font-semibold">{meal.calories} kcal</p>
        {(meal.protein || meal.carbs || meal.fat) && (
          <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
            {meal.protein && <span>P: {meal.protein}g</span>}
            {meal.carbs && <span>C: {meal.carbs}g</span>}
            {meal.fat && <span>F: {meal.fat}g</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealLoggedCard;
