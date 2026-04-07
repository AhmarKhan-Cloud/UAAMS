import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, getStoredToken, setStoredToken } from "../lib/apiClient";
import {
  connectRealtimeSocket,
  disconnectRealtimeSocket,
  refreshRealtimeSocket,
} from "../lib/socketClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const token = getStoredToken();
      if (!token) {
        if (isMounted) {
          setAuthLoading(false);
        }
        return;
      }

      try {
        const response = await api.get("/auth/me", { token });
        if (!isMounted) return;
        setCurrentUser(response?.data?.user || null);
        connectRealtimeSocket();
      } catch {
        setStoredToken("");
        if (isMounted) {
          setCurrentUser(null);
        }
        disconnectRealtimeSocket();
      } finally {
        if (isMounted) {
          setAuthLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async ({ identifier, password, role }) => {
    try {
      const response = await api.post(
        "/auth/login",
        { identifier, password, role },
        { token: "" },
      );
      const token = response?.data?.token || "";
      const user = response?.data?.user || null;

      if (!token || !user) {
        return {
          ok: false,
          message: "Invalid response received from server.",
        };
      }

      setStoredToken(token);
      setCurrentUser(user);
      refreshRealtimeSocket();

      return {
        ok: true,
        message: response?.message || "Login successful.",
        user,
      };
    } catch (error) {
      return {
        ok: false,
        message: error?.message || "Unable to login right now.",
      };
    }
  };

  const register = async (payload) => {
    try {
      const response = await api.post("/auth/register", payload, { token: "" });
      return {
        ok: true,
        message: response?.message || "Account created successfully.",
      };
    } catch (error) {
      return {
        ok: false,
        message: error?.message || "Unable to register right now.",
      };
    }
  };

  const logout = () => {
    setStoredToken("");
    setCurrentUser(null);
    disconnectRealtimeSocket();
  };

  const refreshUser = async () => {
    const token = getStoredToken();
    if (!token) return null;

    try {
      const response = await api.get("/auth/me", { token });
      const user = response?.data?.user || null;
      setCurrentUser(user);
      if (user) {
        connectRealtimeSocket();
      } else {
        disconnectRealtimeSocket();
      }
      return user;
    } catch {
      disconnectRealtimeSocket();
      return null;
    }
  };

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      authLoading,
      login,
      register,
      logout,
      refreshUser,
    }),
    [currentUser, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
