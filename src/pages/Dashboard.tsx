import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { ActivitySquare, Dumbbell, Flame, Trophy, User, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TodaySnapshot from '@/components/dashboard/TodaySnapshot';
import LogWorkoutModal from '@/components/dashboard/LogWorkoutModal';
import LogMealModal from '@/components/dashboard/LogMealModal';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState(68); // Sample progress
  
  useEffect(() => {
    const savedProfile = localStorage.getItem('fitnessProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);
  
  const weeklyWorkouts = [
    { day: 'Mon', completed: true, focus: 'Chest & Triceps' },
    { day: 'Tue', completed: true, focus: 'Back & Biceps' },
    { day: 'Wed', completed: true, focus: 'Rest Day' },
    { day: 'Thu', completed: false, focus: 'Legs & Shoulders' },
    { day: 'Fri', completed: false, focus: 'Full Body' },
    { day: 'Sat', completed: false, focus: 'Cardio' },
    { day: 'Sun', completed: false, focus: 'Rest Day' }
  ];
  
  const todaysWorkout = {
    name: "Upper Body Strength",
    exercises: [
      { name: "Bench Press", sets: "4", reps: "8-10", weight: "60kg", completed: false },
      { name: "Pull-ups", sets: "3", reps: "8-10", weight: "Bodyweight", completed: false },
      { name: "Overhead Press", sets: "3", reps: "10-12", weight: "25kg", completed: false },
      { name: "Barbell Rows", sets: "4", reps: "10-12", weight: "50kg", completed: false },
      { name: "Tricep Pushdowns", sets: "3", reps: "12-15", weight: "20kg", completed: false },
      { name: "Bicep Curls", sets: "3", reps: "12-15", weight: "15kg", completed: false }
    ]
  };
  
  const stats = [
    { name: "Workouts Completed", value: "12", icon: <Dumbbell className="h-4 w-4" /> },
    { name: "Active Calories", value: "4,320", icon: <Flame className="h-4 w-4" /> },
    { name: "Weekly Streak", value: "3 days", icon: <Trophy className="h-4 w-4" /> },
    { name: "Recovery Score", value: "85%", icon: <Heart className="h-4 w-4" /> }
  ];

  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);

  const [loggedWorkouts, setLoggedWorkouts] = useState<{name: string, duration: number}[]>([]);
  const [loggedMeals, setLoggedMeals] = useState<{name: string, calories: number}[]>([]);

  const handleStartWorkout = () => {
    setShowWorkoutModal(true);
  };

  const handleLogMeal = () => {
    setShowMealModal(true);
  };

  const handleLogWorkout = (workout: {name: string, duration: number}) => {
    setLoggedWorkouts(prev => [...prev, workout]);
    toast({
      title: "Workout Logged",
      description: `${workout.name} (${workout.duration} min)`,
    });
    setShowWorkoutModal(false);
  };

  const handleLogMealSave = (meal: {name: string, calories: number}) => {
    setLoggedMeals(prev => [...prev, meal]);
    toast({
      title: "Meal Logged",
      description: `${meal.name} (${meal.calories} kcal)`,
    });
    setShowMealModal(false);
  };

  const handleUpdateProgress = () => {
    toast({
      title: "Update progress",
      description: "Track your fitness journey",
    });
    // Show progress update modal or navigate to progress page
  };

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl">
      <div className="mb-6">
        <TodaySnapshot
          todaysWorkout={todaysWorkout.name}
          workoutDuration="45 minutes"
          caloriesRemaining={850}
          caloriesGoal={2000}
          onStartWorkout={handleStartWorkout}
          onLogMeal={handleLogMeal}
          onUpdateProgress={handleUpdateProgress}
        />
      </div>

      {(showWorkoutModal || showMealModal) && (
        <>
          <LogWorkoutModal
            isOpen={showWorkoutModal}
            onClose={() => setShowWorkoutModal(false)}
            onLog={handleLogWorkout}
          />
          <LogMealModal
            isOpen={showMealModal}
            onClose={() => setShowMealModal(false)}
            onLog={handleLogMealSave}
          />
        </>
      )}

      {(loggedWorkouts.length > 0 || loggedMeals.length > 0) && (
        <div className="my-8">
          {loggedWorkouts.length > 0 && (
            <div className="mb-4">
              <h2 className="font-semibold text-lg mb-2">Workouts Logged</h2>
              <ul>
                {loggedWorkouts.map((w, i) => (
                  <li key={i}>
                    {w.name} - {w.duration} min
                  </li>
                ))}
              </ul>
            </div>
          )}
          {loggedMeals.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg mb-2">Meals Logged</h2>
              <ul>
                {loggedMeals.map((m, i) => (
                  <li key={i}>
                    {m.name} - {m.calories} kcal
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        <div className="w-full md:w-1/3 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5" />
                My Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile ? (
                <div className="space-y-2">
                  <p className="font-medium text-lg">{profile.name}</p>
                  <div className="text-sm text-muted-foreground">
                    <p>Age: {profile.age}</p>
                    <p>Height: {profile.height} cm</p>
                    <p>Weight: {profile.weight} kg</p>
                    <p>Goal: {profile.fitnessGoal.replace('-', ' ')}</p>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  <p>Profile not completed</p>
                  <Button 
                    variant="link" 
                    className="p-0" 
                    onClick={() => navigate('/onboarding')}
                  >
                    Complete your profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <ActivitySquare className="mr-2 h-5 w-5" />
                Weekly Goal Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {weeklyWorkouts.map((day, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="font-medium">{day.day}</div>
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 
                      ${day.completed 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'}`}
                    >
                      {day.completed ? '✓' : ''}
                    </div>
                    <div className="mt-1 text-[10px] leading-tight">{day.focus}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Stats This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="flex flex-col">
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      {stat.icon}
                      <span className="ml-1">{stat.name}</span>
                    </div>
                    <p className="text-lg font-medium">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-2/3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Dumbbell className="mr-2 h-5 w-5" />
                Today's Workout: {todaysWorkout.name}
              </CardTitle>
              <CardDescription>
                Complete your workout and track your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {todaysWorkout.exercises.map((exercise, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0">
                    <div>
                      <p className="font-medium">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps} reps · {exercise.weight}
                      </p>
                    </div>
                    <Button variant={exercise.completed ? "default" : "outline"}>
                      {exercise.completed ? "Completed" : "Log"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/workouts')}>
                Change Workout
              </Button>
              <Button onClick={() => alert("Workout completed!")}>
                Complete Workout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
