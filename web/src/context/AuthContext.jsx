import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, ambilToken, simpanToken, hapusToken } from "../lib/api";

const KonteksAuth = createContext(null);

export function PenyediaAuth({ children }) {
  const [pengguna, setPengguna] = useState(null);
  const [sedangMemuat, setSedangMemuat] = useState(true);

  // Saat halaman dibuka, token yang tersimpan diperiksa ke server. Kalau sudah
  // kedaluwarsa, tokennya dibuang dan pengguna dianggap belum masuk.
  useEffect(() => {
    let batal = false;
    (async () => {
      if (!ambilToken()) {
        setSedangMemuat(false);
        return;
      }
      try {
        const { user } = await api.saya();
        if (!batal) setPengguna(user);
      } catch {
        hapusToken();
      } finally {
        if (!batal) setSedangMemuat(false);
      }
    })();
    return () => { batal = true; };
  }, []);

  const nilai = useMemo(() => ({
    pengguna,
    sedangMemuat,
    sudahMasuk: Boolean(pengguna),

    async masuk(email, password) {
      const { token, user } = await api.masuk({ email, password });
      simpanToken(token);
      setPengguna(user);
      return user;
    },

    async daftar(name, email, password) {
      const { token, user } = await api.daftar({ name, email, password });
      simpanToken(token);
      setPengguna(user);
      return user;
    },

    async perbaruiProfil(data) {
      const { user } = await api.ubahProfil(data);
      setPengguna(user);
      return user;
    },

    keluar() {
      hapusToken();
      setPengguna(null);
    }
  }), [pengguna, sedangMemuat]);

  return <KonteksAuth.Provider value={nilai}>{children}</KonteksAuth.Provider>;
}

export function useAuth() {
  const isi = useContext(KonteksAuth);
  if (!isi) throw new Error("useAuth harus dipakai di dalam PenyediaAuth.");
  return isi;
}
