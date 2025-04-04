
import { toast } from "sonner";

// Define auth types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Store token key
const TOKEN_KEY = 'jwt';

// Mock login function - in real app this would call your API
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  // Simulate API request
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulating validation
      if (email === "test@example.com" && password === "password") {
        const response: AuthResponse = {
          user: {
            id: "user-123",
            name: "Test User",
            email: "test@example.com",
            role: "user"
          },
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsIm5hbWUiOiJUZXN0IFVzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciJ9.eRkK1F0G8_nXBhr9gmgI9lUavj9qL0vvQ_9ZkkXaYJQ"
        };
        
        // Store token
        localStorage.setItem(TOKEN_KEY, response.token);
        
        resolve(response);
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 1000);
  });
};

// Mock signup function
export const signup = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  // Simulate API request
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const response: AuthResponse = {
        user: {
          id: "user-" + Math.floor(Math.random() * 1000),
          name,
          email,
          role: "user"
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsIm5hbWUiOiJUZXN0IFVzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoidXNlciJ9.eRkK1F0G8_nXBhr9gmgI9lUavj9qL0vvQ_9ZkkXaYJQ"
      };
      
      // Store token
      localStorage.setItem(TOKEN_KEY, response.token);
      
      resolve(response);
    }, 1000);
  });
};

// Get current user's token
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  toast("Logged out successfully");
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token;
};

// Parse JWT to get user information
export const getUserFromToken = (): User | null => {
  const token = getToken();
  
  if (!token) return null;
  
  try {
    // This is a simplified JWT parsing for the mock token
    // In a real app, use a proper JWT library
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    return {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      role: payload.role
    };
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};
