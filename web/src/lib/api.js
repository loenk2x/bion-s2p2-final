// Satu-satunya tempat aplikasi web menyentuh server.

const DASAR = import.meta.env.VITE_API_URL || "http://localhost:4000";
const KUNCI_TOKEN = "healthylife.token";

export const ambilToken = () => localStorage.getItem(KUNCI_TOKEN);
export const simpanToken = (token) => localStorage.setItem(KUNCI_TOKEN, token);
export const hapusToken = () => localStorage.removeItem(KUNCI_TOKEN);

export class GalatApi extends Error {
  constructor(pesan, status) {
    super(pesan);
    this.name = "GalatApi";
    this.status = status;
  }
}

async function minta(jalur, { method = "GET", body, tanpaToken = false } = {}) {
  const header = { };
  if (body !== undefined) header["Content-Type"] = "application/json";

  const token = ambilToken();
  if (token && !tanpaToken) header.Authorization = `Bearer ${token}`;

  let jawaban;
  try {
    jawaban = await fetch(`${DASAR}${jalur}`, {
      method,
      headers: header,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    throw new GalatApi("Tidak bisa menghubungi server. Pastikan servernya sudah jalan.", 0);
  }

  // Token kedaluwarsa atau tidak sah: buang tokennya supaya pengguna dilempar ke Login.
  if (jawaban.status === 401 && !tanpaToken) hapusToken();

  const isi = jawaban.status === 204 ? null : await jawaban.json().catch(() => null);
  if (!jawaban.ok) {
    throw new GalatApi(isi?.pesan || "Terjadi galat di server.", jawaban.status);
  }
  return isi;
}

export const api = {
  // tanpa login
  teaser: () => minta("/api/public/teaser", { tanpaToken: true }),
  daftar: (data) => minta("/api/auth/register", { method: "POST", body: data, tanpaToken: true }),
  masuk: (data) => minta("/api/auth/login", { method: "POST", body: data, tanpaToken: true }),

  // profil
  saya: () => minta("/api/auth/me"),
  ubahProfil: (data) => minta("/api/auth/me", { method: "PUT", body: data }),
  gantiPassword: (data) => minta("/api/auth/password", { method: "PUT", body: data }),

  // konten
  konten: (params = {}) => {
    const q = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== "" && v !== undefined && v !== null)
    );
    return minta(`/api/contents${q.toString() ? `?${q}` : ""}`);
  },
  kontenSatu: (slug) => minta(`/api/contents/${slug}`),
  kategori: () => minta("/api/categories"),
  jenisAktivitas: () => minta("/api/aktivitas"),

  // favorit
  favorit: () => minta("/api/favorites"),
  simpanFavorit: (contentId) => minta(`/api/favorites/${contentId}`, { method: "POST" }),
  hapusFavorit: (contentId) => minta(`/api/favorites/${contentId}`, { method: "DELETE" }),

  // catatan harian
  catatan: (params = {}) => {
    const q = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== "" && v !== undefined && v !== null)
    );
    return minta(`/api/logs${q.toString() ? `?${q}` : ""}`);
  },
  ringkasan: () => minta("/api/logs/summary"),
  tambahCatatan: (data) => minta("/api/logs", { method: "POST", body: data }),
  ubahCatatan: (id, data) => minta(`/api/logs/${id}`, { method: "PUT", body: data }),
  hapusCatatan: (id) => minta(`/api/logs/${id}`, { method: "DELETE" })
};
