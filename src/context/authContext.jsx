import React, { createContext, useState, useEffect, useCallback, useRef, useContext, useMemo } from "react";
import { loginService, logoutService, getUserDetails, refreshTokenService } from "../services/userServices";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const isRefreshingRef = useRef(false);
  const hasCheckedAuthRef = useRef(false);

  // Track user activity
  useEffect(() => {
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    const updateActivity = () => setLastActivity(Date.now());
    events.forEach((event) => window.addEventListener(event, updateActivity));
    return () => events.forEach((event) => window.removeEventListener(event, updateActivity));
  }, []);

  // Silent refresh
  const silentRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;

    try {
      await refreshTokenService();
      const data = await getUserDetails();
      setUser(data.data || null);
    } catch {
      setUser(null);
    } finally {
      isRefreshingRef.current = false;
    }
  }, []);

  // Auth fetch wrapper
  const authFetch = useCallback(async (serviceFn, ...args) => {
    try {
      let response = await serviceFn(...args);

      if (response?.status === 401 || response?.message === "Session expired") {
        await silentRefresh();
        response = await serviceFn(...args);
      }

      if (!response) throw new Error("Request failed");
      return response;
    } catch (err) {
      if (serviceFn !== loginService) setUser(null);
      throw err;
    }
  }, [silentRefresh]);

  // Login function
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const loginResponse = await authFetch(loginService, email, password);
      if (!loginResponse) throw new Error("Login failed");
      
      const userData = await getUserDetails();
      if (!userData?.data) throw new Error("Failed to fetch user details");
      
      setUser(userData.data);
      setLastActivity(Date.now());
      return true;
    } catch (err) {
      setUser(null);
      setError(err.message || "Invalid credentials");
      return false;
    }
  }, [authFetch]);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authFetch(logoutService);
    } finally {
      setUser(null);
    }
  }, [authFetch]);

  // Check auth status
  const checkAuth = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    setError(null);

    try {
      const data = await getUserDetails();
      setUser(data.data || null);
    } catch {
      try {
        await silentRefresh();
        const retryData = await getUserDetails();
        setUser(retryData.data || null);
      } catch {
        setUser(null);
      }
    } finally {
      if (isInitial) {
        setLoading(false);
        hasCheckedAuthRef.current = true;
      }
    }
  }, [silentRefresh]);

  // Auto-refresh logic
  useEffect(() => {
    if (!user) return;
    const MAX_INACTIVITY_TIME = 60 * 60 * 1000;
    const REFRESH_INTERVAL = 14 * 60 * 1000;

    const interval = setInterval(async () => {
      const inactive = Date.now() - lastActivity > MAX_INACTIVITY_TIME;
      if (!inactive) await silentRefresh();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [user, lastActivity, silentRefresh]);

  // Initial check + visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && hasCheckedAuthRef.current) {
        checkAuth(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    checkAuth(true);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [checkAuth]);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    logout,
    checkAuth,
    authFetch,
    isAuthenticated: !!user,
  }), [user, loading, error, login, logout, checkAuth, authFetch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};