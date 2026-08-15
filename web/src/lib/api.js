// Web wiring for the shared API client. Everything platform-specific lives here:
// the base URL comes from Vite's env, and the token is persisted in localStorage.

import { createApi } from "@shared/api";

const TOKEN_KEY = "healthylife.token";

export const tokenStorage = {
  read: () => localStorage.getItem(TOKEN_KEY),
  write: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY)
};

const { api, setToken, getToken } = createApi({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:4000",
  // The server rejected the token, so drop the stored copy as well.
  onUnauthorized: () => tokenStorage.clear()
});

export { api, setToken, getToken };
export { ApiError } from "@shared/api";
