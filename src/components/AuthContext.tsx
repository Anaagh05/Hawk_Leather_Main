// src/components/AuthContext.tsx

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  loginUser,
  registerUser,
  getUserDetails,
  updateUserDetails,
  getAuthToken,
  removeAuthToken,
  getStoredUser,
  removeStoredUser,
  User,
} from "../services/api";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    phone: string,
    occupation: string,
    address: string,
    city: string,
    state: string,
    pincode: string
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    occupation: string;
    pincode: string;
  }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      const storedUser = getStoredUser();

      if (token && storedUser) {
        try {
          // Fetch fresh user data from backend
          const response = await getUserDetails();
          setUser(response.data);
        } catch (error) {
          console.error("Failed to refresh user data:", error);
          // Use stored user data as fallback
          setUser(storedUser);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser({
        userEmail: email,
        userPassword: password,
      });

      setUser(response.data.user);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    phone: string,
    occupation: string,
    address: string,
    city: string,
    state: string,
    pincode: string
  ) => {
    try {
      const response = await registerUser({
        userName: name,
        userEmail: email,
        userPassword: password,
        phoneNumber: parseInt(phone),
        occupation,
        streetAddress: address,
        city,
        state,
        pincode: parseInt(pincode),
      });

      setUser(response.data.user);
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.message || "Signup failed");
      throw error;
    }
  };

  const logout = () => {
    removeAuthToken();
    removeStoredUser();
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateProfile = async (data: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    occupation: string;
    pincode: string;
  }) => {
    try {
      const response = await updateUserDetails({
        userName: data.name,
        phoneNumber: parseInt(data.phone),
        streetAddress: data.address,
        city: data.city,
        state: data.state,
        occupation: data.occupation,
        pincode: parseInt(data.pincode),
      });

      setUser(response.data);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await getUserDetails();
      setUser(response.data);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
