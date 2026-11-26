"use client";

import { API_BASE_URL } from "@/config/api";

import React, { createContext, useState, useEffect } from "react";
import { JUROR_LEVELS } from "@/constants/jurorLevels";

export type AuthUser = {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
  reputationScore?: number;
  jurorLevel?: (typeof JUROR_LEVELS)[keyof typeof JUROR_LEVELS];
  correctVotes?: number;
  totalVotes?: number;
};

type LoginCredentials = { email: string; password: string };

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (creds: LoginCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { name: string }) => Promise<AuthUser>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (creds: LoginCredentials) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(creds),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.message || "Login failed");
    }

    const data = await res.json();
    await refreshUser();
    return data.user as AuthUser;
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // ignore
    }
    setUser(null);
  };

  const updateProfile = async (data: { name: string }) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(body?.message || "Failed to update profile");
    }

    setUser(body.user);
    return body.user as AuthUser;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };

export const useAuth = () => {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
