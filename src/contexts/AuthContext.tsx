
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  joinDate: Date;
  interests: string[];
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        ...parsedUser,
        joinDate: new Date(parsedUser.joinDate),
      });
      setIsAuthenticated(true);
    }
  }, []);

  // Mock user database in localStorage
  const ensureUserDatabase = () => {
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify([]));
    }
    return JSON.parse(localStorage.getItem("users") || "[]");
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = ensureUserDatabase();
    
    // Find user by email
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      // Remove password from stored user
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser({
        ...userWithoutPassword,
        joinDate: new Date(userWithoutPassword.joinDate),
      });
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    const users = ensureUserDatabase();
    
    // Check if email already exists
    if (users.some((u: any) => u.email === email)) {
      return false;
    }
    
    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      username,
      email,
      password, // In a real app, this would be hashed
      joinDate: new Date(),
      interests: [],
      joinedCommunities: [],
    };
    
    // Save to mock database
    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    
    // Log in the new user
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    
    // Update in localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    // Update in users array
    const users = ensureUserDatabase();
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    
    if (userIndex !== -1) {
      const { password } = users[userIndex]; // Keep the password
      users[userIndex] = { ...updatedUser, password };
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
