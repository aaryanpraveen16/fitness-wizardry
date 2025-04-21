
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { UserProfile, saveProfile } from "@/services/profileService";
import { useToast } from "@/hooks/use-toast";

interface ProfileFormProps {
  userId: number;
  profileId?: number;
  initialProfile?: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  userId,
  profileId,
  initialProfile,
  onSave,
  onCancel
}) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    name: "",
    age: 30,
    gender: "male",
    height: 175,
    weight: 70,
    fitnessGoal: "lose-weight",
    targetWeight: 65,
    calorieGoal: 2000,
    workoutDaysPerWeek: 4,
    isPrimary: false,
    ...initialProfile
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setProfile(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setProfile(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProfile: UserProfile = {
      id: profileId || 0, // Will be set by saveProfile if 0
      userId,
      createdAt: initialProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPrimary: profile.isPrimary || false,
      ...profile
    } as UserProfile;
    
    try {
      const savedProfile = saveProfile(newProfile);
      
      toast({
        title: "Profile saved",
        description: "Your profile has been successfully saved.",
      });
      
      onSave(savedProfile);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your profile.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{profileId ? "Edit Profile" : "Create New Profile"}</CardTitle>
        <CardDescription>
          {profileId 
            ? "Update your existing profile information" 
            : "Create a new profile to track fitness for yourself or someone else"
          }
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Profile Name</Label>
            <Input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="e.g., John's Fitness Profile"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="1"
                max="120"
                value={profile.age}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select 
                value={profile.gender} 
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                min="50"
                max="250"
                value={profile.height}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                min="20"
                max="300"
                step="0.1"
                value={profile.weight}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fitnessGoal">Fitness Goal</Label>
            <Select 
              value={profile.fitnessGoal} 
              onValueChange={(value) => handleSelectChange("fitnessGoal", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose-weight">Lose Weight</SelectItem>
                <SelectItem value="gain-muscle">Gain Muscle</SelectItem>
                <SelectItem value="maintain">Maintain Fitness</SelectItem>
                <SelectItem value="build-endurance">Build Endurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetWeight">Target Weight (kg)</Label>
            <Input
              id="targetWeight"
              name="targetWeight"
              type="number"
              min="20"
              max="300"
              step="0.1"
              value={profile.targetWeight}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="calorieGoal">Daily Calorie Goal</Label>
            <Input
              id="calorieGoal"
              name="calorieGoal"
              type="number"
              min="500"
              max="5000"
              value={profile.calorieGoal}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="workoutDaysPerWeek">Workout Days per Week</Label>
              <span>{profile.workoutDaysPerWeek} days</span>
            </div>
            <Slider
              value={[profile.workoutDaysPerWeek || 4]}
              min={1}
              max={7}
              step={1}
              onValueChange={(value) => handleSliderChange("workoutDaysPerWeek", value)}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1 day</span>
              <span>7 days</span>
            </div>
          </div>
          
          {!initialProfile?.isPrimary && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPrimary"
                checked={profile.isPrimary}
                onChange={() => setProfile(prev => ({ ...prev, isPrimary: !prev.isPrimary }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isPrimary">Set as primary profile</Label>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between pt-6">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {profileId ? "Update Profile" : "Create Profile"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProfileForm;
