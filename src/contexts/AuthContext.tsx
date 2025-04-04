
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, isAuthenticated, getUserFromToken, logout } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  refreshUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const refreshUser = () => {
    if (isAuthenticated()) {
      const userData = getUserFromToken();
      setUser(userData);
      return true;
    } else {
      setUser(null);
      return false;
    }
  };
  
  useEffect(() => {
    // Check if user is authenticated on initial load
    refreshUser();
    setIsLoading(false);
  }, []);
  
  const login = (userData: User) => {
    setUser(userData);
  };
  
  const handleLogout = () => {
    logout();
    setUser(null);
  };
  
  const value = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    logout: handleLogout,
    refreshUser,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
