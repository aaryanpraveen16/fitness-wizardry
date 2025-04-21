
// Local storage key for user profiles
const USER_PROFILES_KEY = 'fitnessApp_userProfiles';

// Define profile types
export interface UserProfile {
  id: number;
  userId: number; // Links to the authenticated user
  name: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  fitnessGoal?: string;
  targetWeight?: number;
  calorieGoal?: number;
  workoutDaysPerWeek?: number;
  createdAt: string;
  updatedAt: string;
  isPrimary: boolean;
}

// Get all profiles for a user
export const getUserProfiles = (userId: number): UserProfile[] => {
  const storedProfiles = localStorage.getItem(USER_PROFILES_KEY);
  if (!storedProfiles) return [];
  
  const allProfiles = JSON.parse(storedProfiles) as UserProfile[];
  return allProfiles.filter(profile => profile.userId === userId);
};

// Get a profile by its ID
export const getProfileById = (profileId: number): UserProfile | null => {
  const storedProfiles = localStorage.getItem(USER_PROFILES_KEY);
  if (!storedProfiles) return null;
  
  const allProfiles = JSON.parse(storedProfiles) as UserProfile[];
  return allProfiles.find(profile => profile.id === profileId) || null;
};

// Get the primary profile for a user
export const getPrimaryProfile = (userId: number): UserProfile | null => {
  const profiles = getUserProfiles(userId);
  return profiles.find(profile => profile.isPrimary) || profiles[0] || null;
};

// Create or update a profile
export const saveProfile = (profile: UserProfile): UserProfile => {
  const existingProfiles = JSON.parse(localStorage.getItem(USER_PROFILES_KEY) || '[]') as UserProfile[];
  
  // Set created/updated timestamps
  const now = new Date().toISOString();
  
  // If updating an existing profile
  if (profile.id) {
    const index = existingProfiles.findIndex(p => p.id === profile.id);
    if (index >= 0) {
      profile.updatedAt = now;
      existingProfiles[index] = profile;
      
      // If this profile is set to primary, update others
      if (profile.isPrimary) {
        existingProfiles.forEach((p, i) => {
          if (i !== index && p.userId === profile.userId) {
            p.isPrimary = false;
          }
        });
      }
    }
  } 
  // If creating a new profile
  else {
    profile.id = Date.now();
    profile.createdAt = now;
    profile.updatedAt = now;
    
    // If it's the first profile or set as primary
    if (profile.isPrimary) {
      existingProfiles.forEach(p => {
        if (p.userId === profile.userId) {
          p.isPrimary = false;
        }
      });
    }
    
    // If it's the first profile for this user, set it as primary
    const userProfiles = existingProfiles.filter(p => p.userId === profile.userId);
    if (userProfiles.length === 0) {
      profile.isPrimary = true;
    }
    
    existingProfiles.push(profile);
  }
  
  localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(existingProfiles));
  return profile;
};

// Delete a profile
export const deleteProfile = (profileId: number): boolean => {
  const existingProfiles = JSON.parse(localStorage.getItem(USER_PROFILES_KEY) || '[]') as UserProfile[];
  
  // Find the profile to delete
  const profileIndex = existingProfiles.findIndex(p => p.id === profileId);
  if (profileIndex < 0) return false;
  
  const profileToDelete = existingProfiles[profileIndex];
  
  // Check if this is the primary profile
  if (profileToDelete.isPrimary) {
    // Find another profile for this user to make primary
    const userProfiles = existingProfiles.filter(
      p => p.userId === profileToDelete.userId && p.id !== profileId
    );
    
    if (userProfiles.length > 0) {
      // Make the first one primary
      const newPrimaryIndex = existingProfiles.findIndex(p => p.id === userProfiles[0].id);
      existingProfiles[newPrimaryIndex].isPrimary = true;
    }
  }
  
  // Remove the profile
  existingProfiles.splice(profileIndex, 1);
  localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(existingProfiles));
  
  return true;
};

// Set a profile as primary
export const setPrimaryProfile = (profileId: number): boolean => {
  const existingProfiles = JSON.parse(localStorage.getItem(USER_PROFILES_KEY) || '[]') as UserProfile[];
  
  // Find the profile to make primary
  const profileIndex = existingProfiles.findIndex(p => p.id === profileId);
  if (profileIndex < 0) return false;
  
  const userId = existingProfiles[profileIndex].userId;
  
  // Update all profiles for this user
  existingProfiles.forEach((profile, index) => {
    if (profile.userId === userId) {
      profile.isPrimary = (index === profileIndex);
    }
  });
  
  localStorage.setItem(USER_PROFILES_KEY, JSON.stringify(existingProfiles));
  return true;
};
