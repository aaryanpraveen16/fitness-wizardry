import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { logProgress } from '@/services/progressService';
import { useToast } from "@/hooks/use-toast";

const ProgressForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    date: new Date().toISOString().split('T')[0],
    workoutMinutes: '',
    caloriesBurned: '',
    steps: '',
    mood: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert string values to numbers where needed
      const entry = {
        userId: parseInt(formData.userId),
        date: formData.date,
        workoutMinutes: formData.workoutMinutes ? parseInt(formData.workoutMinutes) : undefined,
        caloriesBurned: formData.caloriesBurned ? parseInt(formData.caloriesBurned) : undefined,
        steps: formData.steps ? parseInt(formData.steps) : undefined,
        mood: formData.mood || undefined
      };

      const response = await logProgress(entry);
      
      toast({
        title: "Progress logged",
        description: "Your progress has been successfully logged.",
      });
      
      // Reset form
      setFormData({
        userId: '',
        date: new Date().toISOString().split('T')[0],
        workoutMinutes: '',
        caloriesBurned: '',
        steps: '',
        mood: ''
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
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              placeholder="Enter your user ID"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workoutMinutes">Workout Minutes</Label>
            <Input
              id="workoutMinutes"
              name="workoutMinutes"
              type="number"
              value={formData.workoutMinutes}
              onChange={handleChange}
              placeholder="Minutes spent working out"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="caloriesBurned">Calories Burned</Label>
            <Input
              id="caloriesBurned"
              name="caloriesBurned"
              type="number"
              value={formData.caloriesBurned}
              onChange={handleChange}
              placeholder="Calories burned"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="steps">Steps</Label>
            <Input
              id="steps"
              name="steps"
              type="number"
              value={formData.steps}
              onChange={handleChange}
              placeholder="Number of steps"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mood">Mood</Label>
            <Input
              id="mood"
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              placeholder="How are you feeling?"
            />
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