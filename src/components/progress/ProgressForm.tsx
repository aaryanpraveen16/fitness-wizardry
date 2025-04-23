import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { logProgress } from '@/services/progressService';
import { useToast } from "@/hooks/use-toast";

const ProgressForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    workoutDaysStreak: '',
    dailyCalorieIntake: '',
    currentInputDate: new Date().toISOString().split('T')[0],
    userWeight: '',
    evaluationType: 'daily'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      evaluationType: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert string values to numbers where needed
      const entry = {
        workoutDaysStreak: formData.workoutDaysStreak ? parseInt(formData.workoutDaysStreak) : 0,
        dailyCalorieIntake: formData.dailyCalorieIntake ? parseInt(formData.dailyCalorieIntake) : 0,
        currentInputDate: formData.currentInputDate,
        userWeight: formData.userWeight ? parseFloat(formData.userWeight) : 0,
        evaluationType: formData.evaluationType
      };

      const response = await logProgress(entry);
      
      toast({
        title: "Progress logged",
        description: "Your progress has been successfully logged.",
      });
      
      // Reset form
      setFormData({
        workoutDaysStreak: '',
        dailyCalorieIntake: '',
        currentInputDate: new Date().toISOString().split('T')[0],
        userWeight: '',
        evaluationType: 'daily'
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to log progress",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Log Progress</CardTitle>
        <CardDescription>Track your daily fitness progress</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentInputDate">Date</Label>
            <Input
              id="currentInputDate"
              name="currentInputDate"
              type="date"
              value={formData.currentInputDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workoutDaysStreak">Workout Days Streak</Label>
            <Input
              id="workoutDaysStreak"
              name="workoutDaysStreak"
              type="number"
              value={formData.workoutDaysStreak}
              onChange={handleChange}
              placeholder="Number of consecutive workout days"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dailyCalorieIntake">Daily Calorie Intake</Label>
            <Input
              id="dailyCalorieIntake"
              name="dailyCalorieIntake"
              type="number"
              value={formData.dailyCalorieIntake}
              onChange={handleChange}
              placeholder="Calories consumed today"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="userWeight">Current Weight (kg)</Label>
            <Input
              id="userWeight"
              name="userWeight"
              type="number"
              step="0.1"
              value={formData.userWeight}
              onChange={handleChange}
              placeholder="Your current weight"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="evaluationType">Evaluation Type</Label>
            <Select value={formData.evaluationType} onValueChange={handleSelectChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select evaluation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging..." : "Log Progress"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProgressForm; 