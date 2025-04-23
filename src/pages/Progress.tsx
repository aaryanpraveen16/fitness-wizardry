import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressForm from "@/components/progress/ProgressForm";
import { getAllProgress } from "@/services/progressService";
import type { Progress } from "@/services/progressService";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Use the Progress type from the service
type ProgressEntry = Progress;

const Progress = () => {
  const [progressHistory, setProgressHistory] = useState<ProgressEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!isLoggedIn || !user) {
        navigate('/login');
        return;
      }

      try {
        const data = await getAllProgress();
        // Ensure data is an array before setting it
        setProgressHistory(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch progress:", error);
        // Set empty array on error
        setProgressHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [isLoggedIn, user, navigate]);

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Please log in to view your progress</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="log" className="space-y-4">
        <TabsList>
          <TabsTrigger value="log">Log Progress</TabsTrigger>
          <TabsTrigger value="history">Progress History</TabsTrigger>
        </TabsList>

        <TabsContent value="log">
          <ProgressForm />
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Progress History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading progress history...</div>
              ) : progressHistory && progressHistory.length > 0 ? (
                <div className="space-y-4">
                  {progressHistory.map((entry) => (
                    <Card key={entry.id || `entry-${entry.currentInputDate}`}>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Date</p>
                            <p className="text-lg font-semibold">
                              {format(new Date(entry.currentInputDate), "MMM d, yyyy")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Workout Streak</p>
                            <p className="text-lg font-semibold">{entry.workoutDaysStreak} days</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Calories</p>
                            <p className="text-lg font-semibold">{entry.dailyCalorieIntake} kcal</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Weight</p>
                            <p className="text-lg font-semibold">{entry.userWeight} kg</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No progress entries found. Start tracking your progress!
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Progress;
