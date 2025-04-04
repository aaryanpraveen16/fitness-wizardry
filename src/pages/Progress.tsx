
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Camera, Check, Plus } from "lucide-react";

const Progress = () => {
  const [activeTab, setActiveTab] = useState("weight");

  // Sample data for charts
  const weightData = [
    { date: '1/1', weight: 85 },
    { date: '1/8', weight: 84.2 },
    { date: '1/15', weight: 83.5 },
    { date: '1/22', weight: 82.8 },
    { date: '1/29', weight: 82.3 },
    { date: '2/5', weight: 81.5 },
    { date: '2/12', weight: 81.1 },
    { date: '2/19', weight: 80.7 },
  ];

  const workoutData = [
    { month: 'Jan', completed: 12 },
    { month: 'Feb', completed: 15 },
    { month: 'Mar', completed: 18 },
    { month: 'Apr', completed: 14 },
    { month: 'May', completed: 21 },
    { month: 'Jun', completed: 24 },
    { month: 'Jul', completed: 20 },
  ];

  const measurementData = {
    current: {
      chest: 104,
      waist: 86,
      hips: 102,
      thighs: 60,
      arms: 36,
    },
    previous: {
      chest: 108,
      waist: 90,
      hips: 105,
      thighs: 62,
      arms: 35,
    }
  };

  const milestones = [
    { name: "First Workout", date: "Jan 1, 2023", completed: true },
    { name: "Lost 5kg", date: "Feb 15, 2023", completed: true },
    { name: "Completed 30-Day Challenge", date: "Mar 10, 2023", completed: true },
    { name: "First Pull-up", date: "Apr 5, 2023", completed: true },
    { name: "Run 5K", date: "May 20, 2023", completed: true },
    { name: "Lost 10kg", date: "Jun 30, 2023", completed: false },
    { name: "Bench Press Body Weight", date: "", completed: false }
  ];

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl">
      <div className="flex flex-col items-start space-y-4">
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground mb-6">
          Track your fitness journey and see how far you've come.
        </p>

        <Tabs defaultValue="weight" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="weight">Weight</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
            <TabsTrigger value="photos">Progress Photos</TabsTrigger>
          </TabsList>

          <TabsContent value="weight" className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Weight Tracking</CardTitle>
                <CardDescription>Monitor your weight changes over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weightData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Starting Weight</p>
                    <p className="text-xl font-bold">85 kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Weight</p>
                    <p className="text-xl font-bold">80.7 kg</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Lost</p>
                    <p className="text-xl font-bold text-green-600">-4.3 kg</p>
                  </div>
                </div>
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" /> Log New Weight
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workouts" className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Workout Consistency</CardTitle>
                <CardDescription>Track your completed workouts over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={workoutData} margin={{ top: 5, right: 30, bottom: 5, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" name="Workouts Completed" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Total Workouts Completed</p>
                  <p className="text-xl font-bold">124</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="measurements" className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Body Measurements</CardTitle>
                <CardDescription>Track changes in your body measurements (in cm)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(measurementData.current).map(([part, value]) => {
                    const prevValue = measurementData.previous[part];
                    const diff = prevValue - value;
                    
                    return (
                      <div key={part} className="flex items-center">
                        <div className="flex-1">
                          <p className="capitalize">{part}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Previous</p>
                            <p>{prevValue} cm</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Current</p>
                            <p className="font-medium">{value} cm</p>
                          </div>
                          <div className="w-16">
                            <p className="text-sm text-muted-foreground">Change</p>
                            <p className={diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : ""}>
                              {diff > 0 ? `-${diff}` : diff < 0 ? `+${Math.abs(diff)}` : "0"} cm
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <Button className="w-full sm:w-auto mt-4">
                    <Plus className="mr-2 h-4 w-4" /> Update Measurements
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones" className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Fitness Milestones</CardTitle>
                <CardDescription>Track your fitness achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((milestone, i) => (
                    <div key={i} className="flex items-center p-2 border-b last:border-0">
                      <div className={`size-8 rounded-full flex items-center justify-center mr-3 ${milestone.completed ? 'bg-primary text-primary-foreground' : 'border border-muted-foreground text-muted-foreground'}`}>
                        {milestone.completed && <Check className="size-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{milestone.name}</p>
                        {milestone.date && <p className="text-sm text-muted-foreground">{milestone.date}</p>}
                      </div>
                      {!milestone.completed && (
                        <Button size="sm" variant="outline">Mark Complete</Button>
                      )}
                    </div>
                  ))}
                  <Button className="w-full sm:w-auto mt-2">
                    <Plus className="mr-2 h-4 w-4" /> Add New Milestone
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos" className="w-full">
            <Card>
              <CardHeader>
                <CardTitle>Progress Photos</CardTitle>
                <CardDescription>Visual record of your transformation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="border-2 border-dashed flex flex-col items-center justify-center p-6 text-center h-48">
                    <Camera className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="font-medium">Add New Photo</p>
                    <p className="text-sm text-muted-foreground">Track your progress visually</p>
                  </Card>
                  <div className="relative group h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1580261450046-d0a30080dc9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                      alt="Progress" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                      <p className="text-sm">January 5</p>
                    </div>
                  </div>
                  <div className="relative group h-48 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
                      alt="Progress" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                      <p className="text-sm">February 15</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Progress;
