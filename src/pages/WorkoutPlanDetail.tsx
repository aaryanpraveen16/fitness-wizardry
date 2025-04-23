import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Clock, Target, ChevronRight, ArrowLeft, Play } from "lucide-react";
import { getWorkoutPlanById, assignWorkoutPlan } from "@/services/workoutService";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const WorkoutPlanDetail = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchPlan = async () => {
      if (!planId) return;
      
      try {
        const planData = getWorkoutPlanById(parseInt(planId));
        if (planData) {
          setPlan(planData);
        } else {
          toast.error("Workout plan not found");
          navigate("/workout-plans");
        }
      } catch (error) {
        console.error("Error fetching workout plan:", error);
        toast.error("Failed to load workout plan");
        navigate("/workout-plans");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [planId, navigate]);

  const handleStartPlan = () => {
    if (!user || !plan) return;
    
    try {
      toast.success("Workout plan assigned successfully!");
      
      const success = assignWorkoutPlan(user.userId, plan.id);
      if (success) {
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else {
        toast.error("Failed to assign workout plan");
      }
    } catch (error) {
      console.error("Error assigning workout plan:", error);
      toast.error("Failed to assign workout plan");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 py-8">
        <div className="flex items-center justify-center h-64">
          <p>Loading workout plan...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate("/workout-plans")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Workout Plans
        </Button>
        
        <div className="h-64 overflow-hidden rounded-lg mb-6">
          <img 
            src={plan.image} 
            alt={plan.title}
            className="w-full h-full object-cover" 
          />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{plan.title}</h1>
        <p className="text-muted-foreground mb-6">{plan.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{plan.duration}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Dumbbell className="mr-2 h-5 w-5" />
                Frequency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{plan.frequency}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{plan.difficulty}</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Plan Overview</CardTitle>
                <CardDescription>
                  Learn more about this workout plan and what to expect
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">What's Included</h3>
                    <p>
                      This {plan.duration} program is designed for {plan.difficulty.toLowerCase()} fitness enthusiasts 
                      who want to {plan.category === "strength" ? "build strength and muscle" : 
                      plan.category === "cardio" ? "improve cardiovascular health" : 
                      "enhance flexibility and mobility"}.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">How It Works</h3>
                    <p>
                      You'll perform workouts {plan.frequency.toLowerCase()}, with each session focusing on 
                      {plan.category === "strength" ? " progressive overload and compound movements" : 
                      plan.category === "cardio" ? " high-intensity intervals and endurance training" : 
                      " stretching and mobility exercises"}.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Equipment Needed</h3>
                    <p>
                      {plan.category === "strength" ? "Dumbbells, resistance bands, and a mat" : 
                      plan.category === "cardio" ? "No equipment required, but a timer is helpful" : 
                      "Yoga mat and comfortable space"}.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleStartPlan}>
                  <Play className="mr-2 h-4 w-4" /> Start This Plan
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="workouts">
            <div className="space-y-6">
              {plan.workouts && plan.workouts.length > 0 ? (
                plan.workouts.map((workout: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Dumbbell className="mr-2 h-5 w-5" />
                        {workout.name}
                      </CardTitle>
                      <CardDescription>
                        {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)} workout
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {workout.exercises && workout.exercises.map((exercise: any, exIndex: number) => (
                          <div key={exIndex} className="border rounded-md p-4">
                            <h3 className="font-medium">{exercise.name}</h3>
                            <div className="mt-2 text-sm text-muted-foreground">
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
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">No workouts available for this plan.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WorkoutPlanDetail; 