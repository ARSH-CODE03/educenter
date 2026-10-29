import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, endpoints, getToken, setToken } from "@/services/api";

const STORAGE_KEY = "educentre.session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function restore() {
      try {
        const token = getToken();
        if (!token) {
          window.localStorage.removeItem(STORAGE_KEY);
          return;
        }
        const res = await api.get(endpoints.me);
        const sessionUser = res.data?.user || res.user;
        if (!sessionUser) throw new Error("The API returned no user for this session");
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
        setUser(sessionUser);
      } catch {
        setToken(null);
        window.localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      } finally {
        setReady(true);
      }
    }
    restore();
  }, []);

  const saveSession = useCallback((data) => {
    if (!data?.token || !data?.user) {
      throw new Error("The API returned an incomplete authentication response");
    }
    setToken(data.token);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  }, []);

  const login = useCallback(async ({ email, password, role }) => {
    const res = await api.post(endpoints.login, {
      email,
      password,
      role: String(role || "").toLowerCase(),
    });
    return saveSession(res.data || res);
  }, [saveSession]);

  const register = useCallback(async (account) => {
    const res = await api.post(endpoints.register, account);
    return saveSession(res.data || res);
  }, [saveSession]);

  const logout = useCallback(() => {
    setToken(null);
    window.localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, register, logout, isAuthenticated: Boolean(user) }),
    [user, ready, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}

export const roleHome = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
};
