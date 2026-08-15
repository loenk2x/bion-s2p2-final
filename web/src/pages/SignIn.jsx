// Sign-in. Returns the visitor to wherever ProtectedRoute sent them from
// (location.state.from), or /beranda when they arrived here directly.

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@shared/AuthProvider";
import Icon from "../components/Icon";

const DEMO_EMAIL = "demo@healthylife.id";
const DEMO_PASSWORD = "demo12345";

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(nextEmail, nextPassword) {
    setFormError("");
    setSubmitting(true);
    try {
      await signIn(nextEmail, nextPassword);
      navigate(location.state?.from || "/beranda", { replace: true });
    } catch (err) {
      setFormError(err.message || "Masuk gagal. Periksa email dan password Anda.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    submit(email.trim(), password);
  }

  function fillDemoAccount() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  }

  return (
    <div className="auth">
      <div className="auth-panel">
        <div className="logo">
          <i><Icon name="leaf" size={18} /></i> Healthy Life
        </div>
        <h1>Selamat datang kembali.</h1>
        <p>Favorit dan catatan harian Anda tersimpan dan hanya bisa dilihat oleh Anda sendiri.</p>
      </div>

      <div className="auth-isi">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h1 className="judul-besar">Masuk</h1>
          <p className="redup" style={{ margin: "6px 0 28px" }}>Gunakan email dan password Anda.</p>

          {formError && <div className="kotak-galat">{formError}</div>}

          <div className="kolom" style={{ marginBottom: 16 }}>
            <span className="inp-label">Email</span>
            <input
              className="inp"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@email.com"
            />
          </div>

          <div className="kolom" style={{ marginBottom: 8 }}>
            <span className="inp-label">Password</span>
            <input
              className="inp"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div style={{ textAlign: "right", marginBottom: 24 }}>
            <span className="tombol t-teks t-kecil">Lupa password?</span>
          </div>

          <button type="submit" className="tombol t-primer t-blok" style={{ marginBottom: 12 }} disabled={submitting}>
            {submitting ? "Memeriksa…" : "Masuk"}
          </button>
          <button type="button" className="tombol t-sekunder t-blok" onClick={fillDemoAccount} disabled={submitting}>
            Isi akun demo
          </button>

          <p className="kecil redup" style={{ textAlign: "center", marginTop: 20 }}>
            Belum punya akun? <Link to="/daftar" style={{ fontWeight: 600 }}>Daftar</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
