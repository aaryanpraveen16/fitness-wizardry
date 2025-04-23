import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { UserProfile, getUserProfiles, saveProfile, getPrimaryProfile } from "@/services/profileService";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentUser } from '@/services/authService';
import { updateUser } from '@/services/authService';
import type { User } from '@/services/authService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    gender: "",
    fitnessGoal: "",
    targetWeight: "",
    workoutDaysPerWeek: ""
  });

  useEffect(() => {
    if (user?.userId) {
      const userProfiles = getUserProfiles(user.userId);
      const primaryProfile = userProfiles.find(p => p.isPrimary) || userProfiles[0];
      if (primaryProfile) {
        setProfile(primaryProfile);
        setFormData({
          name: primaryProfile.name || "",
          age: primaryProfile.age?.toString() || "",
          height: primaryProfile.height?.toString() || "",
          weight: primaryProfile.weight?.toString() || "",
          gender: primaryProfile.gender || "",
          fitnessGoal: primaryProfile.fitnessGoal || "",
          targetWeight: primaryProfile.targetWeight?.toString() || "",
          workoutDaysPerWeek: primaryProfile.workoutDaysPerWeek?.toString() || ""
        });
      } else {
        setFormData(prev => ({
          ...prev,
          name: `${user.firstName} ${user.lastName}`,
          height: user.height.toString(),
          weight: user.weight.toString()
        }));
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to update your profile",
        variant: "destructive"
      });
      return;
    }

    try {
      const updatedUser = await updateUser(user.userId, {
        firstName: formData.name.split(' ')[0],
        lastName: formData.name.split(' ')[1] || '',
        email: user.email,
        password: '',
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight)
      });

      const profile: UserProfile = {
        id: getPrimaryProfile(user.userId)?.id || Date.now(),
        userId: user.userId,
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : undefined,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        gender: formData.gender || undefined,
        fitnessGoal: formData.fitnessGoal || undefined,
        targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : undefined,
        workoutDaysPerWeek: formData.workoutDaysPerWeek ? parseInt(formData.workoutDaysPerWeek) : undefined,
        createdAt: getPrimaryProfile(user.userId)?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPrimary: true
      };

      saveProfile(profile);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Please log in to view your profile</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Profile" : "Your Profile"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange('gender', value)}
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
              <div>
                <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                <Select
                  value={formData.fitnessGoal}
                  onValueChange={(value) => handleSelectChange('fitnessGoal', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight-loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="endurance">Endurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="targetWeight">Target Weight (kg)</Label>
                <Input
                  id="targetWeight"
                  name="targetWeight"
                  type="number"
                  value={formData.targetWeight}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="workoutDaysPerWeek">Workout Days/Week</Label>
                <Input
                  id="workoutDaysPerWeek"
                  name="workoutDaysPerWeek"
                  type="number"
                  value={formData.workoutDaysPerWeek}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            {isEditing ? (
              <>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
