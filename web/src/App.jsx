import { Navigate, Route, Routes } from "react-router-dom";
import RuteTerlindungi from "./components/RuteTerlindungi";
import Kerangka from "./components/Kerangka";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Beranda from "./pages/Beranda";
import DetailKonten from "./pages/DetailKonten";
import Favorit from "./pages/Favorit";
import CatatanHarian from "./pages/CatatanHarian";
import Profil from "./pages/Profil";

export default function App() {
  return (
    <Routes>
      {/* tanpa login */}
      <Route path="/" element={<Landing />} />
      <Route path="/daftar" element={<Register />} />
      <Route path="/masuk" element={<Login />} />

      {/* wajib login — semuanya dibungkus RuteTerlindungi dan memakai kerangka bersama */}
      <Route
        element={
          <RuteTerlindungi>
            <Kerangka />
          </RuteTerlindungi>
        }
      >
        <Route path="/beranda" element={<Beranda />} />
        <Route path="/konten/:slug" element={<DetailKonten />} />
        <Route path="/favorit" element={<Favorit />} />
        <Route path="/catatan" element={<CatatanHarian />} />
        <Route path="/profil" element={<Profil />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
