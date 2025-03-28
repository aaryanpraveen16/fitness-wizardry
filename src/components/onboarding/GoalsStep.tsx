
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Dumbbell, Heart, Scale, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface GoalsStepProps {
  fitnessGoal: string;
  setFitnessGoal: (goal: string) => void;
  targetWeight: string;
  setTargetWeight: (weight: string) => void;
  calorieGoal: string;
  setCalorieGoal: (calories: string) => void;
  workoutDays: number;
  setWorkoutDays: (days: number) => void;
  onContinue: () => void;
  onBack: () => void;
}

const GoalsStep: React.FC<GoalsStepProps> = ({
  fitnessGoal,
  setFitnessGoal,
  targetWeight,
  setTargetWeight,
  calorieGoal,
  setCalorieGoal,
  workoutDays,
  setWorkoutDays,
  onContinue,
  onBack
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Your Fitness Goals</h2>
      <p className="text-center text-muted-foreground">Let's set some goals to help you achieve your fitness journey</p>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-2 block">Select your primary fitness goal</Label>
          <ToggleGroup type="single" variant="outline" className="grid grid-cols-2 gap-2" value={fitnessGoal} onValueChange={(value) => value && setFitnessGoal(value)}>
            <ToggleGroupItem value="lose-weight" className="flex flex-col items-center justify-center gap-2 h-20">
              <Scale size={20} />
              <span>Lose Weight</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="gain-muscle" className="flex flex-col items-center justify-center gap-2 h-20">
              <Dumbbell size={20} />
              <span>Gain Muscle</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="maintain" className="flex flex-col items-center justify-center gap-2 h-20">
              <Heart size={20} />
              <span>Maintain Fitness</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="build-endurance" className="flex flex-col items-center justify-center gap-2 h-20">
              <Timer size={20} />
              <span>Build Endurance</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div>
          <Label htmlFor="targetWeight" className="text-base font-medium">Target Weight (kg)</Label>
          <Input
            id="targetWeight"
            type="number"
            placeholder="Enter your target weight"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Setting a target helps track your progress more effectively
          </p>
        </div>

        <div>
          <Label htmlFor="calorieGoal" className="text-base font-medium">Daily Calorie Goal</Label>
          <Input
            id="calorieGoal"
            type="number"
            placeholder="Enter your daily calorie goal"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(e.target.value)}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Suggested based on your profile, but you can adjust as needed
          </p>
        </div>

        <div>
          <div className="flex justify-between">
            <Label className="text-base font-medium">Workout Days per Week</Label>
            <span className="font-medium">{workoutDays} days</span>
          </div>
          <Slider
            value={[workoutDays]}
            min={1}
            max={7}
            step={1}
            onValueChange={(value) => setWorkoutDays(value[0])}
            className="mt-2"
          />
          <div className="flex justify-between mt-1 text-sm text-muted-foreground">
            <span>1 day</span>
            <span>7 days</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default GoalsStep;
