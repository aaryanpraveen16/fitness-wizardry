
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const Progress = () => {
  const [mood, setMood] = useState("");
  const [weight, setWeight] = useState("");
  const [log, setLog] = useState<{ date: string; weight: string; mood: string }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const date = new Date().toISOString().split("T")[0];
    setLog(prev => [...prev, { date, weight, mood }]);
    setMood("");
    setWeight("");
    toast({
      title: "Progress Logged",
      description: `Weight: ${weight} kg, Mood: ${mood}`,
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Log Daily Progress</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-2">
            <div>
              <Label htmlFor="weight">Weight (kg):</Label>
              <Input id="weight" value={weight} onChange={e => setWeight(e.target.value)} type="number" placeholder="Enter your weight" />
            </div>
            <div>
              <Label htmlFor="mood">Mood:</Label>
              <Input id="mood" value={mood} onChange={e => setMood(e.target.value)} placeholder="How do you feel?" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Log Progress</Button>
          </CardFooter>
        </form>
      </Card>

      {log.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {log.map((entry, idx) => (
                <li key={idx}>
                  {entry.date}: {entry.weight} kg - {entry.mood}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Progress;
