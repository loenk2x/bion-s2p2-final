// Account creation. Registration itself signs the user in, so a successful
// submit lands on the page they were originally headed to (or /beranda).

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@shared/AuthProvider";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword
} from "@shared/register";
import Icon from "../components/Icon";

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const checks = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password)
    };
    const errors = {};
    for (const [field, result] of Object.entries(checks)) {
      if (result.message) errors[field] = result.message;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await signUp(name.trim(), email.trim(), password);
      navigate(location.state?.from || "/beranda", { replace: true });
    } catch (err) {
      setFormError(err.message || "Registrasi gagal. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth-panel">
        <div className="logo">
          <i><Icon name="leaf" size={18} /></i> Healthy Life
        </div>
        <h1>Belajar hidup sehat, satu langkah tiap hari.</h1>
        <p>20 artikel, video, dan infografis dari sumber tepercaya. Simpan yang penting, catat aktivitas harian Anda.</p>
      </div>

      <div className="auth-isi">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h1 className="judul-besar">Buat akun</h1>
          <p className="redup" style={{ margin: "6px 0 28px" }}>Registrasi wajib sebelum membuka konten.</p>

          {formError && <div className="kotak-galat">{formError}</div>}

          <div className="kolom" style={{ marginBottom: 16 }}>
            <span className="inp-label">Nama lengkap</span>
            <input
              className={`inp${fieldErrors.name ? " inp-galat" : ""}`}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nama Anda"
            />
            {fieldErrors.name && <p className="pesan-galat">{fieldErrors.name}</p>}
          </div>

          <div className="kolom" style={{ marginBottom: 16 }}>
            <span className="inp-label">Email</span>
            <input
              className={`inp${fieldErrors.email ? " inp-galat" : ""}`}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@email.com"
            />
            {fieldErrors.email && <p className="pesan-galat">{fieldErrors.email}</p>}
          </div>

          <div className="kolom" style={{ marginBottom: 16 }}>
            <span className="inp-label">Password</span>
            <input
              className={`inp${fieldErrors.password ? " inp-galat" : ""}`}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimal 8 karakter"
            />
            {fieldErrors.password && <p className="pesan-galat">{fieldErrors.password}</p>}
          </div>

          <div className="kolom" style={{ marginBottom: 24 }}>
            <span className="inp-label">Konfirmasi password</span>
            <input
              className={`inp${fieldErrors.confirmPassword ? " inp-galat" : ""}`}
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Ulangi password"
            />
            {fieldErrors.confirmPassword && <p className="pesan-galat">{fieldErrors.confirmPassword}</p>}
          </div>

          <button type="submit" className="tombol t-primer t-blok" disabled={submitting}>
            {submitting ? "Mendaftarkan…" : "Daftar"}
          </button>

          <p className="kecil redup" style={{ textAlign: "center", marginTop: 20 }}>
            Sudah punya akun? <Link to="/masuk" style={{ fontWeight: 600 }}>Masuk</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
