
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [profiles, setProfiles] = useState<{ name: string, age: string, height: string, weight: string }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfiles([...profiles, { name, age, height, weight }]);
    setName("");
    setAge("");
    setHeight("");
    setWeight("");
    toast({
      title: "Profile Created",
      description: `Name: ${name}`,
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New User Profile</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" value={age} onChange={e => setAge(e.target.value)} type="number" placeholder="Your age" required />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input id="height" value={height} onChange={e => setHeight(e.target.value)} type="number" placeholder="Your height" required />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input id="weight" value={weight} onChange={e => setWeight(e.target.value)} type="number" placeholder="Your weight" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Add Profile</Button>
          </CardFooter>
        </form>
      </Card>

      {profiles.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Saved Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {profiles.map((p, i) => (
                <li key={i}>
                  {p.name}, Age: {p.age}, Height: {p.height} cm, Weight: {p.weight} kg
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;
