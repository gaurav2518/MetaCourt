import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

// Configure default local server endpoint (use your computer's local IP on Wi-Fi)
const API_URL = "http://10.196.60.68:8081/api";
axios.defaults.baseURL = API_URL;

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "juror" | "admin" | "opposite_party";
  isBanned: boolean;
};

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (credentials: { email: string; password?: string; role?: string }) => Promise<void>;
  logout: () => Promise<void>;
  setMockRole: (role: AuthUser["role"]) => void; // helper for easy local debugging
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if token exists on boot
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const savedUser = await AsyncStorage.getItem("userInfo");
        if (token && savedUser) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.warn("Failed to retrieve stored auth state:", err);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  const login = async (credentials: { email: string; password?: string; role?: string }) => {
    setLoading(true);
    try {
      // Attempt real login request
      const res = await axios.post("/auth/login", credentials).catch(() => null);
      
      if (res && res.data) {
        const { token, user: userData } = res.data;
        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("userInfo", JSON.stringify(userData));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(userData);
      } else {
        // Fallback to Mock Auth if server is offline (for easy Expo Go standalone testing)
        console.log("⚠️ Backend server unreachable. Logging in with Mock credentials.");
        const mockUser: AuthUser = {
          id: "mock-id-123",
          name: credentials.email.split("@")[0] || "Gaurav",
          email: credentials.email,
          role: (credentials.role as any) || "user",
          isBanned: false,
        };
        await AsyncStorage.setItem("userToken", "mock-jwt-token");
        await AsyncStorage.setItem("userInfo", JSON.stringify(mockUser));
        setUser(mockUser);
      }

      router.replace("/(tabs)/complainant");
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userInfo");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      router.replace("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const setMockRole = async (role: AuthUser["role"]) => {
    if (!user) return;
    const updated = { ...user, role };
    setUser(updated);
    await AsyncStorage.setItem("userInfo", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setMockRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
