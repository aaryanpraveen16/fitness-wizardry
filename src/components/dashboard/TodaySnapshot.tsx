
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarCheck, Utensils, BarChart3 } from "lucide-react";

interface TodaySnapshotProps {
  todaysWorkout: string;
  workoutDuration: string;
  caloriesRemaining: number;
  caloriesGoal: number;
  onStartWorkout: () => void;
  onLogMeal: () => void;
  onUpdateProgress: () => void;
}

const TodaySnapshot: React.FC<TodaySnapshotProps> = ({
  todaysWorkout,
  workoutDuration,
  caloriesRemaining,
  caloriesGoal,
  onStartWorkout,
  onLogMeal,
  onUpdateProgress
}) => {
  const caloriesConsumed = caloriesGoal - caloriesRemaining;
  const calorieProgress = Math.min(Math.round((caloriesConsumed / caloriesGoal) * 100), 100);
  
  return (
    <Card className="border-2 border-primary/10 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <CalendarCheck className="h-5 w-5 text-primary" />
          Today's Plan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <CalendarCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Today's Workout</h3>
                <p className="text-lg font-semibold">{todaysWorkout}</p>
                <p className="text-sm text-muted-foreground">{workoutDuration}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="bg-primary/10 p-2 rounded-full">
                <Utensils className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Calories Remaining</h3>
                <p className="text-lg font-semibold">
                  You can consume {caloriesRemaining} kcal more today
                </p>
                <div className="mt-1">
                  <Progress value={calorieProgress} className="h-2" />
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{caloriesConsumed} kcal consumed</span>
                    <span>{caloriesGoal} kcal goal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2">
          <Button onClick={onStartWorkout} className="flex-1">
            <CalendarCheck className="mr-2 h-4 w-4" />
            Start Workout
          </Button>
          <Button onClick={onLogMeal} variant="outline" className="flex-1">
            <Utensils className="mr-2 h-4 w-4" />
            Log Meal
          </Button>
          <Button onClick={onUpdateProgress} variant="secondary" className="flex-1">
            <BarChart3 className="mr-2 h-4 w-4" />
            Update Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaySnapshot;
