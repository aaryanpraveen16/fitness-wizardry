
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Clock, Target, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkoutPlans = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("strength");

  const workoutCategories = [
    { id: "strength", name: "Strength", icon: <Dumbbell className="h-5 w-5" /> },
    { id: "cardio", name: "Cardio", icon: <Clock className="h-5 w-5" /> },
    { id: "flexibility", name: "Flexibility", icon: <Target className="h-5 w-5" /> },
  ];

  const workoutPlans = {
    strength: [
      {
        id: 1,
        title: "Beginner Strength",
        description: "Perfect for those new to strength training",
        duration: "4 weeks",
        frequency: "3x per week",
        difficulty: "Beginner",
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 2,
        title: "Advanced Hypertrophy",
        description: "Build muscle mass with this intensive program",
        duration: "6 weeks",
        frequency: "5x per week",
        difficulty: "Advanced",
        image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 3,
        title: "Power Builder",
        description: "Increase strength and power with compound movements",
        duration: "8 weeks",
        frequency: "4x per week",
        difficulty: "Intermediate",
        image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
    ],
    cardio: [
      {
        id: 4,
        title: "HIIT Challenge",
        description: "High intensity interval training for maximum calorie burn",
        duration: "4 weeks",
        frequency: "4x per week",
        difficulty: "Intermediate",
        image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 5,
        title: "Endurance Builder",
        description: "Improve your stamina and cardiovascular health",
        duration: "6 weeks",
        frequency: "3x per week",
        difficulty: "Beginner",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
    ],
    flexibility: [
      {
        id: 6,
        title: "Yoga Flow",
        description: "Enhance flexibility and mindfulness",
        duration: "Ongoing",
        frequency: "Daily",
        difficulty: "All levels",
        image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 7,
        title: "Mobility Master",
        description: "Focus on joint health and range of motion",
        duration: "4 weeks",
        frequency: "3x per week",
        difficulty: "Intermediate",
        image: "https://images.unsplash.com/photo-1616699002776-33391ba0c5f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
    ]
  };

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl">
      <div className="flex flex-col items-start space-y-4">
        <h1 className="text-3xl font-bold">Workout Plans</h1>
        <p className="text-muted-foreground mb-6">
          Find the perfect workout plan to help you achieve your fitness goals.
        </p>
        
        <Tabs defaultValue="strength" className="w-full" onValueChange={setSelectedCategory}>
          <TabsList className="mb-6">
            {workoutCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                {category.icon}
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.keys(workoutPlans).map((category) => (
            <TabsContent key={category} value={category} className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workoutPlans[category].map((plan) => (
                  <Card key={plan.id} className="overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={plan.image} 
                        alt={plan.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105" 
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{plan.title}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Duration</p>
                          <p className="font-medium">{plan.duration}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Frequency</p>
                          <p className="font-medium">{plan.frequency}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Difficulty</p>
                          <p className="font-medium">{plan.difficulty}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full" onClick={() => navigate(`/workout-plan/${plan.id}`)}>
                        View Plan <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default WorkoutPlans;
