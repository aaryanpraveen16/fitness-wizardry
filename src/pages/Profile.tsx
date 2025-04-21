import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile, getUserProfiles, deleteProfile, setPrimaryProfile } from "@/services/profileService";
import { User, Plus, Star, Trash2, Edit, Shield } from "lucide-react";
import ProfileForm from "@/components/profile/ProfileForm";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [userId, setUserId] = useState(1); // Default user ID for now
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("profiles");
  const [editProfileId, setEditProfileId] = useState<number | null>(null);

  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, [userId]);

  const loadProfiles = () => {
    const userProfiles = getUserProfiles(userId);
    setProfiles(userProfiles);
  };

  const handleCreateProfile = () => {
    setEditProfileId(null);
    setShowForm(true);
    setActiveTab("form");
  };

  const handleEditProfile = (profileId: number) => {
    setEditProfileId(profileId);
    setShowForm(true);
    setActiveTab("form");
  };

  const handleSaveProfile = (profile: UserProfile) => {
    loadProfiles();
    setShowForm(false);
    setEditProfileId(null);
    setActiveTab("profiles");
  };

  const handleDeleteProfile = (profileId: number) => {
    if (confirm("Are you sure you want to delete this profile? This action cannot be undone.")) {
      const success = deleteProfile(profileId);
      
      if (success) {
        toast({
          title: "Profile deleted",
          description: "The profile has been successfully deleted."
        });
        loadProfiles();
      } else {
        toast({
          title: "Error",
          description: "There was an error deleting the profile.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSetPrimary = (profileId: number) => {
    const success = setPrimaryProfile(profileId);
    
    if (success) {
      toast({
        title: "Primary profile updated",
        description: "Your primary profile has been updated."
      });
      loadProfiles();
    } else {
      toast({
        title: "Error",
        description: "There was an error updating the primary profile.",
        variant: "destructive"
      });
    }
  };

  const getEditingProfile = () => {
    if (editProfileId) {
      return profiles.find(p => p.id === editProfileId);
    }
    return undefined;
  };

  return (
    <div className="container mx-auto p-4 py-8 max-w-6xl">
      <div className="flex flex-col items-start space-y-4">
        <h1 className="text-3xl font-bold">Your Profiles</h1>
        <p className="text-muted-foreground mb-6">
          Manage profiles for yourself and your family members.
        </p>

        <div className="w-full">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="profiles">Profiles</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
              {showForm && <TabsTrigger value="form">
                {editProfileId ? "Edit Profile" : "New Profile"}
              </TabsTrigger>}
            </TabsList>

            <TabsContent value="profiles">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Add New Profile Card */}
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center h-[300px] cursor-pointer" onClick={handleCreateProfile}>
                    <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">Create New Profile</h3>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      Add a new profile for yourself or a family member
                    </p>
                  </CardContent>
                </Card>

                {/* Existing Profiles */}
                {profiles.map((profile) => (
                  <Card key={profile.id} className={profile.isPrimary ? "border-primary" : ""}>
                    <CardHeader className="relative">
                      {profile.isPrimary && (
                        <div className="absolute top-2 right-2 text-primary">
                          <Star className="h-5 w-5 fill-primary" />
                        </div>
                      )}
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        {profile.name}
                      </CardTitle>
                      <CardDescription>
                        {profile.isPrimary ? "Primary Profile" : "Secondary Profile"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Age</p>
                            <p className="font-medium">{profile.age} years</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Gender</p>
                            <p className="font-medium capitalize">{profile.gender}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Height</p>
                            <p className="font-medium">{profile.height} cm</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Weight</p>
                            <p className="font-medium">{profile.weight} kg</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-muted-foreground">Fitness Goal</p>
                            <p className="font-medium capitalize">{profile.fitnessGoal?.replace('-', ' ')}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEditProfile(profile.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!profile.isPrimary && (
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDeleteProfile(profile.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {!profile.isPrimary && (
                        <Button 
                          variant="outline"
                          onClick={() => handleSetPrimary(profile.id)}
                        >
                          Set as Primary
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Email Notifications</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="emailWorkoutReminders"
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="emailWorkoutReminders" className="text-sm">
                        Workout reminders
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="emailProgressUpdates"
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="emailProgressUpdates" className="text-sm">
                        Weekly progress updates
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Privacy</h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="shareProgress"
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor="shareProgress" className="text-sm">
                        Share my progress with trainers
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Unit Preferences</h3>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="metric"
                          name="units"
                          checked
                          className="h-4 w-4 border-gray-300"
                        />
                        <label htmlFor="metric" className="text-sm">
                          Metric (kg, cm)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="imperial"
                          name="units"
                          className="h-4 w-4 border-gray-300"
                        />
                        <label htmlFor="imperial" className="text-sm">
                          Imperial (lb, ft/in)
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="form">
              <ProfileForm
                userId={userId}
                profileId={editProfileId || undefined}
                initialProfile={getEditingProfile()}
                onSave={handleSaveProfile}
                onCancel={() => {
                  setShowForm(false);
                  setEditProfileId(null);
                  setActiveTab("profiles");
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
