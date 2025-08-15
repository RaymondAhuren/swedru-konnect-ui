// AuthContext.js
import React, { createContext, useState, useEffect, useCallback, useRef, useContext, useMemo } from "react";
import { loginService, logoutService, getUserDetails, refreshTokenService } from "../services/userServices";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // only for initial load
  const [error, setError] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const isRefreshingRef = useRef(false);
  const hasCheckedAuthRef = useRef(false); // track if initial check done

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

  // Wrapper for calling backend services
  const authFetch = useCallback(
    async (serviceFn, ...args) => {
      try {
        let response = await serviceFn(...args);

        if (response?.status === 401 || response?.message === "Session expired") {
          await silentRefresh();
          response = await serviceFn(...args);
        }
        return response;
      } catch {
        setUser(null);
        setError(null);
        return null;
      }
    },
    [silentRefresh]
  );

  // Login
  const login = useCallback(
    async (email, password) => {
      setError(null);
      try {
        await authFetch(loginService, email, password);
        const data = await getUserDetails();
        setUser(data.data || null);
        setLastActivity(Date.now());
        return data;
      } catch {
        setUser(null);
        return null;
      }
    },
    [authFetch]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      await authFetch(logoutService);
    } finally {
      setUser(null);
    }
  }, [authFetch]);

  // Check auth
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

  // Refresh every 14 min if active
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

  // First check + tab visibility refresh
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && hasCheckedAuthRef.current) {
        checkAuth(false); // silent
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    checkAuth(true); // initial load

    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [checkAuth]);

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      logout,
      checkAuth,
      authFetch,
      isAuthenticated: !!user,
    }),
    [user, loading, error, login, logout, checkAuth, authFetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
