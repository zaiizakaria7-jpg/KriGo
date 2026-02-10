"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { AdminUser, AdminRole } from "./admin-types";
import { adminUsers } from "./admin-mock-data";

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  hasRole: (role: AdminRole) => boolean;
  isSuperAdmin: boolean;
  isAgencyAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "krigo_admin_auth";

function getStoredAuth(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return adminUsers.find((u) => u._id === parsed._id) || null;
    }
  } catch {
    // ignore
  }
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => getStoredAuth());

  const login = useCallback(
    (email: string, password: string): { success: boolean; error?: string } => {
      const found = adminUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!found) {
        return { success: false, error: "Invalid email or password." };
      }

      if (found.status === "suspended") {
        return {
          success: false,
          error: "This account has been suspended. Contact support.",
        };
      }

      setUser(found);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ _id: found._id }));
      return { success: true };
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasRole = useCallback(
    (role: AdminRole) => {
      if (!user) return false;
      if (user.role === "super_admin") return true; // super admin has all roles
      return user.role === role;
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
        isSuperAdmin: user?.role === "super_admin",
        isAgencyAdmin: user?.role === "admin_agency",
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
