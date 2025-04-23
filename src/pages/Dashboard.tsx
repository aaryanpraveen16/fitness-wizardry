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
import MealLoggedCard from '@/components/dashboard/MealLoggedCard';
import MacrosSummary from '@/components/dashboard/MacrosSummary';
import ExerciseTracker from '@/components/dashboard/ExerciseTracker';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [progress, setProgress] = useState(0); // Initialize progress at 0%
  const [weeklyWorkouts, setWeeklyWorkouts] = useState([
    { day: 'Mon', completed: false, focus: 'Chest & Triceps' },
    { day: 'Tue', completed: false, focus: 'Back & Biceps' },
    { day: 'Wed', completed: false, focus: 'Rest Day' },
    { day: 'Thu', completed: false, focus: 'Legs & Shoulders' },
    { day: 'Fri', completed: false, focus: 'Full Body' },
    { day: 'Sat', completed: false, focus: 'Cardio' },
    { day: 'Sun', completed: false, focus: 'Rest Day' }
  ]);

  useEffect(() => {
    const savedProfile = localStorage.getItem('fitnessProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Track exercise completion
  const [exerciseStatus, setExerciseStatus] = useState<boolean[]>(() =>
    Array(6).fill(false)
  );

  // Today's workout and exercise structure using exerciseStatus
  const todaysWorkout = {
    name: "Upper Body Strength",
    exercises: [
      { name: "Bench Press", sets: "4", reps: "8-10", weight: "60kg" },
      { name: "Pull-ups", sets: "3", reps: "8-10", weight: "Bodyweight" },
      { name: "Overhead Press", sets: "3", reps: "10-12", weight: "25kg" },
      { name: "Barbell Rows", sets: "4", reps: "10-12", weight: "50kg" },
      { name: "Tricep Pushdowns", sets: "3", reps: "12-15", weight: "20kg" },
      { name: "Bicep Curls", sets: "3", reps: "12-15", weight: "15kg" }
    ]
  };

  const stats = [
    { name: "Workouts Completed", value: "0", icon: <Dumbbell className="h-4 w-4" /> },
    { name: "Active Calories", value: "0", icon: <Flame className="h-4 w-4" /> },
    { name: "Weekly Streak", value: "0 days", icon: <Trophy className="h-4 w-4" /> },
    { name: "Recovery Score", value: "0%", icon: <Heart className="h-4 w-4" /> }
  ];

  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);

  const [loggedWorkouts, setLoggedWorkouts] = useState<{name: string, duration: number}[]>([]);
  const [loggedMeals, setLoggedMeals] = useState<{
    name: string, 
    calories: number,
    protein?: number,
    carbs?: number,
    fat?: number,
    mealType?: string
  }[]>([]);

  // Calculate macronutrients
  const [macros, setMacros] = useState({
    protein: 0,
    carbs: 0,
    fat: 0,
    totalCalories: 0,
    calorieGoal: 2000
  });

  // Update macros when logged meals change
  useEffect(() => {
    const totalProtein = loggedMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
    const totalCarbs = loggedMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
    const totalFat = loggedMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0);
    const totalCals = loggedMeals.reduce((sum, meal) => sum + meal.calories, 0);
    
    setMacros({
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
      totalCalories: totalCals,
      calorieGoal: 2000 // Could be dynamic based on user profile
    });
  }, [loggedMeals]);

  // Check if all exercises are completed
  const allExercisesDone = exerciseStatus.every(Boolean);

  const handleStartWorkout = () => {
    setExerciseStatus(Array(todaysWorkout.exercises.length).fill(false));
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

  const handleLogMealSave = (meal: {
    name: string, 
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    mealType: string
  }) => {
    setLoggedMeals(prev => [...prev, meal]);
    toast({
      title: "Meal Logged",
      description: `${meal.name} (${meal.calories} kcal)`,
    });
    setShowMealModal(false);
  };

  const handleUpdateProgress = () => {
    navigate('/progress');
  };

  // Handler for exercise completion, updates progress when all are done
  const handleExerciseLog = (index: number) => {
    setExerciseStatus((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };
  
  // Handler for workout completion
  const handleWorkoutComplete = () => {
    if (allExercisesDone) {
      // Update progress
      setProgress(prevProgress => {
        const newVal = Math.min(100, prevProgress + 5);
        return newVal;
      });

      // Update weekly workouts
      const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
      const adjustedIndex = today === 0 ? 6 : today - 1; // Convert to 0-6 where 0 = Monday
      
      setWeeklyWorkouts(prev => {
        const updated = [...prev];
        updated[adjustedIndex] = {
          ...updated[adjustedIndex],
          completed: true
        };
        return updated;
      });

      // Show success toast
      toast({
        title: "Workout Complete!",
        description: "Great job completing your session and all exercises.",
      });
    }
  };

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl">
      <div className="mb-6">
        <TodaySnapshot
          todaysWorkout={todaysWorkout.name}
          workoutDuration="45 minutes"
          caloriesRemaining={2000 - macros.totalCalories}
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
        <div className="my-8 space-y-6">
          {loggedMeals.length > 0 && (
            <div>
              <h2 className="font-semibold text-lg mb-4">Today's Nutrition</h2>
              <MacrosSummary 
                protein={macros.protein}
                carbs={macros.carbs}
                fat={macros.fat}
                totalCalories={macros.totalCalories}
                calorieGoal={macros.calorieGoal}
              />
              
              <h3 className="font-semibold text-md mt-6 mb-3">Meals Logged</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {loggedMeals.map((m, i) => (
                  <MealLoggedCard key={i} meal={m} />
                ))}
              </div>
            </div>
          )}
          
          {loggedWorkouts.length > 0 && (
            <div className="mt-8">
              <h2 className="font-semibold text-lg mb-2">Workouts Logged</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {loggedWorkouts.map((w, i) => (
                  <Card key={i} className="border bg-gradient-to-tr from-purple-50 via-white to-green-50 shadow-md">
                    <CardContent className="py-4 px-4 flex items-center gap-4">
                      <Dumbbell className="text-primary h-5 w-5" />
                      <div>
                        <p className="font-semibold">{w.name}</p>
                        <span className="text-xs text-muted-foreground">{w.duration} min</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
          <ExerciseTracker 
            workoutName={todaysWorkout.name}
            exercises={todaysWorkout.exercises}
            exerciseStatus={exerciseStatus}
            onExerciseLog={handleExerciseLog}
            onComplete={handleWorkoutComplete}
            onChangeWorkout={() => navigate('/workout-plans')}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
