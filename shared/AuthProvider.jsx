// Authentication state shared by both apps. Only React is used here — no DOM,
// no navigation — so React Native can mount the very same provider.
//
// Two things are injected because they differ per platform:
//   api      the client returned by createApi()
//   storage  { read(), write(token), clear() }, may be sync or async
//            web  → localStorage
//            RN   → expo-secure-store

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ api, setToken, storage, children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On start-up the stored token is verified against the server. An expired one
  // is discarded so the user is treated as signed out rather than half signed in.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await storage.read();
        if (!stored) return;
        setToken(stored);
        const { user: current } = await api.me();
        if (!cancelled) setUser(current);
      } catch {
        setToken(null);
        await storage.clear();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    signedIn: Boolean(user),

    async signIn(email, password) {
      const { token, user: current } = await api.login({ email, password });
      setToken(token);
      await storage.write(token);
      setUser(current);
      return current;
    },

    async signUp(name, email, password) {
      const { token, user: current } = await api.register({ name, email, password });
      setToken(token);
      await storage.write(token);
      setUser(current);
      return current;
    },

    async updateProfile(data) {
      const { user: current } = await api.updateProfile(data);
      setUser(current);
      return current;
    },

    async signOut() {
      setToken(null);
      await storage.clear();
      setUser(null);
    }
  }), [user, loading, api, setToken, storage]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
