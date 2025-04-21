
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils } from "lucide-react";

interface MealLoggedCardProps {
  meal: { name: string; calories: number };
}

const MealLoggedCard: React.FC<MealLoggedCardProps> = ({ meal }) => (
  <Card className="border shadow hover:shadow-lg transition-shadow bg-white/90">
    <CardHeader className="flex flex-row items-center gap-2 pb-2">
      <Utensils className="h-6 w-6 text-primary" />
      <CardTitle className="text-base font-semibold">{meal.name}</CardTitle>
    </CardHeader>
    <CardContent className="pt-1">
      <span className="text-sm text-muted-foreground">{meal.calories} kcal</span>
    </CardContent>
  </Card>
);

export default MealLoggedCard;
