import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import ContentDetail from "./pages/ContentDetail";
import Favorites from "./pages/Favorites";
import DailyLog from "./pages/DailyLog";
import Profile from "./pages/Profile";

// Route paths stay Indonesian because they are user-visible; component names are English.
export default function App() {
  return (
    <Routes>
      {/* public */}
      <Route path="/" element={<Landing />} />
      <Route path="/daftar" element={<Register />} />
      <Route path="/masuk" element={<SignIn />} />

      {/* everything below requires a token and shares the app shell */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/beranda" element={<Home />} />
        <Route path="/konten/:slug" element={<ContentDetail />} />
        <Route path="/favorit" element={<Favorites />} />
        <Route path="/catatan" element={<DailyLog />} />
        <Route path="/profil" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
