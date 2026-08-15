import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Memuat from "./Memuat";

// Membuka alamat mana pun tanpa token akan dilempar ke Login, lalu dikembalikan
// ke alamat yang tadi dituju setelah berhasil masuk.
export default function RuteTerlindungi({ children }) {
  const { sudahMasuk, sedangMemuat } = useAuth();
  const lokasi = useLocation();

  if (sedangMemuat) return <Memuat pesan="Memeriksa sesi Anda…" />;
  if (!sudahMasuk) return <Navigate to="/masuk" replace state={{ dari: lokasi.pathname + lokasi.search }} />;
  return children;
}
