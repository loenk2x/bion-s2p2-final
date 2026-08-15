// Mobile wiring for the shared API client. Kembaran (twin) of web/src/lib/api.js:
// everything platform-specific lives here, the request/response logic lives in
// @shared/api.
//
// Two differences from the web twin:
//   - the base URL comes from Expo's public env var, not Vite's
//   - the token is persisted in the device keystore via expo-secure-store,
//     not localStorage
//
// A physical device cannot reach "localhost" - that resolves to the device
// itself, not the computer running the server. EXPO_PUBLIC_API_URL must be
// set to that computer's LAN IP address (e.g. http://192.168.1.23:4000) for
// a physical device or Android emulator. See mobile/.env.example.

import * as SecureStore from "expo-secure-store";
import { createApi } from "@shared/api";

const TOKEN_KEY = "healthylife.token";

export const tokenStorage = {
  read: () => SecureStore.getItemAsync(TOKEN_KEY),
  write: (token) => SecureStore.setItemAsync(TOKEN_KEY, token),
  clear: () => SecureStore.deleteItemAsync(TOKEN_KEY)
};

const { api, setToken, getToken } = createApi({
  baseUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000",
  // The server rejected the token, so drop the stored copy as well.
  onUnauthorized: () => tokenStorage.clear()
});

export { api, setToken, getToken };
export { ApiError } from "@shared/api";
