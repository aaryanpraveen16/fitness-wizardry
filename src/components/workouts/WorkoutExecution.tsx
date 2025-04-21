
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Timer, Check, Clock, Dumbbell } from "lucide-react";
import { Workout, Exercise, toggleExerciseCompletion } from "@/services/workoutService";
import { useToast } from "@/hooks/use-toast";

interface WorkoutExecutionProps {
  workout: Workout;
  onComplete: () => void;
  onCancel: () => void;
}

const WorkoutExecution: React.FC<WorkoutExecutionProps> = ({ 
  workout, 
  onComplete, 
  onCancel 
}) => {
  const { toast } = useToast();
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<number[]>(
    workout.exercises.filter(e => e.completed).map(e => e.id!)
  );
  
  // Format time in minutes and seconds
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Start/pause timer
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  // Reset timer
  const resetTimer = () => {
    setElapsedTime(0);
    setIsActive(false);
  };
  
  // Toggle exercise completion
  const toggleExercise = (exerciseId: number) => {
    // Update local state
    if (completedExercises.includes(exerciseId)) {
      setCompletedExercises(prev => prev.filter(id => id !== exerciseId));
    } else {
      setCompletedExercises(prev => [...prev, exerciseId]);
    }
    
    // Update in storage
    toggleExerciseCompletion(workout.id!, exerciseId);
  };
  
  // Complete the workout
  const handleComplete = () => {
    toast({
      title: "Workout completed",
      description: `Great job completing ${workout.name}!`,
    });
    onComplete();
  };
  
  // Calculate progress percentage
  const progressPercentage = Math.round(
    (completedExercises.length / workout.exercises.length) * 100
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Dumbbell className="h-5 w-5 mr-2" />
            {workout.name}
          </div>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            {formatTime(elapsedTime)}
          </div>
        </CardTitle>
        <CardDescription>
          {progressPercentage}% complete - {completedExercises.length} of {workout.exercises.length} exercises done
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex justify-center space-x-4 mb-6">
          <Button onClick={toggleTimer} variant="outline">
            {isActive ? "Pause" : "Start"} Timer
          </Button>
          <Button onClick={resetTimer} variant="outline">
            Reset Timer
          </Button>
        </div>
        
        <div className="space-y-6">
          {workout.exercises.map((exercise) => (
            <div key={exercise.id} className="border rounded-md p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <Checkbox 
                      checked={completedExercises.includes(exercise.id!)}
                      onCheckedChange={() => toggleExercise(exercise.id!)}
                      className="mr-2"
                    />
                    <h3 className="font-medium">{exercise.name}</h3>
                  </div>
                  
                  <div className="ml-6 mt-2 text-sm text-muted-foreground">
                    {exercise.sets && exercise.reps && (
                      <p>{exercise.sets} sets × {exercise.reps}</p>
                    )}
                    {exercise.duration && (
                      <p>Duration: {exercise.duration}</p>
                    )}
                    {exercise.weight && (
                      <p>Weight: {exercise.weight}</p>
                    )}
                    {exercise.notes && (
                      <p className="mt-1 italic">{exercise.notes}</p>
                    )}
                  </div>
                </div>
                
                {/* Exercise Tracking Form */}
                <div className="flex flex-col space-y-2 min-w-[120px]">
                  {exercise.sets && exercise.reps && (
                    <>
                      <label className="text-xs text-muted-foreground">Actual Weight</label>
                      <Input type="text" placeholder={exercise.weight || '0'} className="h-8" />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-6">
        <Button variant="outline" onClick={onCancel}>
          Save & Exit
        </Button>
        <Button 
          onClick={handleComplete}
          disabled={completedExercises.length < workout.exercises.length}
        >
          <Check className="mr-2 h-4 w-4" />
          Complete Workout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WorkoutExecution;
