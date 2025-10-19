import { createContext, useContext, useState, ReactNode } from 'react';
import React from "react";
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  occupation?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string, 
    email: string, 
    password: string, 
    phone: string, 
    occupation: string, 
    address: string, 
    city: string, 
    state: string
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name: string; phone: string; address: string; occupation: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser({
      id: '1',
      name: 'John Doe',
      email: email,
    });
  };

  const signup = async (
    name: string, 
    email: string, 
    password: string, 
    phone: string, 
    occupation: string, 
    address: string, 
    city: string, 
    state: string
  ) => {
    // Mock signup - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Combine address fields
    const fullAddress = `${address}, ${city}, ${state}`;
    
    setUser({
      id: '1',
      name: name,
      email: email,
      phone: phone,
      occupation: occupation,
      address: fullAddress,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (data: { name: string; phone: string; address: string; occupation: string }) => {
    if (user) {
      setUser({
        ...user,
        name: data.name,
        phone: data.phone,
        address: data.address,
        occupation: data.occupation,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
