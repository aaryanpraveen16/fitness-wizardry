
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Dumbbell, SquareCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

interface ExerciseTrackerProps {
  workoutName: string;
  exercises: Exercise[];
  exerciseStatus: boolean[];
  onExerciseLog: (index: number) => void;
  onComplete: () => void;
  onChangeWorkout: () => void;
}

const ExerciseTracker: React.FC<ExerciseTrackerProps> = ({
  workoutName,
  exercises,
  exerciseStatus,
  onExerciseLog,
  onComplete,
  onChangeWorkout
}) => {
  const allExercisesDone = exerciseStatus.every(Boolean);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Dumbbell className="mr-2 h-5 w-5" />
          Today's Workout: {workoutName}
        </CardTitle>
        <CardDescription>
          Complete your workout and track your progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {exercises.map((exercise, i) => (
            <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0">
              <div>
                <p className="font-medium">{exercise.name}</p>
                <p className="text-sm text-muted-foreground">
                  {exercise.sets} sets × {exercise.reps} reps · {exercise.weight}
                </p>
              </div>
              <Button 
                variant={exerciseStatus[i] ? "default" : "secondary"}
                className={`flex items-center gap-2 ${exerciseStatus[i] ? 'bg-green-500 hover:bg-green-600' : ''}`}
                onClick={() => onExerciseLog(i)}
                disabled={exerciseStatus[i]}
              >
                {exerciseStatus[i] ? (
                  <>
                    <SquareCheck className="h-4 w-4" />
                    Completed
                  </>
                ) : (
                  "Mark Done"
                )}
              </Button>
            </div>
          ))}

          {exercises.length === 0 && (
            <div className="text-center p-4 bg-muted/30 rounded-md">
              <p className="text-muted-foreground">No exercises planned for today.</p>
              <Button variant="outline" className="mt-2" onClick={onChangeWorkout}>
                Add Workout
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onChangeWorkout}>
          Change Workout
        </Button>
        <Button 
          onClick={() => {
            if (allExercisesDone) {
              onComplete();
            } else {
              toast({
                title: "Finish all exercises before completing the workout.",
                description: "Mark every exercise done to complete.",
              });
            }
          }}
          disabled={allExercisesDone || exercises.length === 0}
        >
          {allExercisesDone ? "Workout Complete" : "Complete Workout"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExerciseTracker;
