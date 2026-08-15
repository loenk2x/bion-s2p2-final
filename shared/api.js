// The only place either app talks to the server.
//
// Platform-agnostic on purpose: no localStorage, no AsyncStorage, no DOM. The
// token lives in memory here; persisting it is the platform's job, because the
// web keeps it in localStorage and React Native keeps it in the device keystore.

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * @param {object} options
 * @param {string} options.baseUrl        e.g. "http://localhost:4000"
 * @param {() => void} [options.onUnauthorized]  called when the server rejects the token
 */
export function createApi({ baseUrl, onUnauthorized }) {
  let token = null;

  const setToken = (value) => { token = value || null; };
  const getToken = () => token;

  async function request(path, { method = "GET", body, skipAuth = false } = {}) {
    const headers = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (token && !skipAuth) headers.Authorization = `Bearer ${token}`;

    let response;
    try {
      response = await fetch(`${baseUrl}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body)
      });
    } catch {
      throw new ApiError("Tidak bisa menghubungi server. Pastikan servernya sudah jalan.", 0);
    }

    if (response.status === 401 && !skipAuth) {
      setToken(null);
      if (onUnauthorized) onUnauthorized();
    }

    const payload = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      throw new ApiError(payload?.pesan || "Terjadi galat di server.", response.status);
    }
    return payload;
  }

  const query = (params = {}) => {
    const search = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== "" && v !== undefined && v !== null)
    );
    return search.toString() ? `?${search}` : "";
  };

  const api = {
    // public, no token required
    teaser: () => request("/api/public/teaser", { skipAuth: true }),
    register: (data) => request("/api/auth/register", { method: "POST", body: data, skipAuth: true }),
    login: (data) => request("/api/auth/login", { method: "POST", body: data, skipAuth: true }),

    // profile
    me: () => request("/api/auth/me"),
    updateProfile: (data) => request("/api/auth/me", { method: "PUT", body: data }),
    changePassword: (data) => request("/api/auth/password", { method: "PUT", body: data }),

    // content
    contents: (params) => request(`/api/contents${query(params)}`),
    content: (slug) => request(`/api/contents/${slug}`),
    categories: () => request("/api/categories"),
    activityReference: () => request("/api/aktivitas"),

    // favourites
    favorites: () => request("/api/favorites"),
    addFavorite: (contentId) => request(`/api/favorites/${contentId}`, { method: "POST" }),
    removeFavorite: (contentId) => request(`/api/favorites/${contentId}`, { method: "DELETE" }),

    // daily entries
    entries: (params) => request(`/api/logs${query(params)}`),
    summary: () => request("/api/logs/summary"),
    addEntry: (data) => request("/api/logs", { method: "POST", body: data }),
    updateEntry: (id, data) => request(`/api/logs/${id}`, { method: "PUT", body: data }),
    removeEntry: (id) => request(`/api/logs/${id}`, { method: "DELETE" })
  };

  return { api, setToken, getToken };
}
