// Account page: avatar/summary card, editable name+bio, change password, sign out.

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@shared/AuthProvider";
import Icon from "../components/Icon";
import InitialsAvatar from "../components/InitialsAvatar";
import { api } from "../lib/api";

const MIN_PASSWORD_LENGTH = 8;

export default function Profile() {
  const { user, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  async function saveProfile(event) {
    event.preventDefault();
    setProfileMessage("");
    setProfileError("");
    setProfileSaving(true);
    try {
      await updateProfile({ name: name.trim(), bio: bio.trim() });
      setProfileMessage("Perubahan tersimpan.");
    } catch (err) {
      setProfileError(err.message || "Gagal menyimpan perubahan.");
    } finally {
      setProfileSaving(false);
    }
  }

  async function savePassword(event) {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");
    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setPasswordError(`Password baru minimal ${MIN_PASSWORD_LENGTH} karakter.`);
      return;
    }
    setPasswordSaving(true);
    try {
      await api.changePassword({ passwordLama: oldPassword, passwordBaru: newPassword });
      setPasswordMessage("Password berhasil diperbarui.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setPasswordError(err.message || "Gagal memperbarui password.");
    } finally {
      setPasswordSaving(false);
    }
  }

  function handleSignOut() {
    signOut();
    navigate("/", { replace: true });
  }

  return (
    <div>
      <h1 className="judul-hal">Profil</h1>
      <p className="redup" style={{ margin: "6px 0 24px" }}>Data akun Anda.</p>

      <div className="profil-layout">
        <div className="kartu-panel" style={{ textAlign: "center" }}>
          <InitialsAvatar name={user?.name} size={80} className="profil-avatar" />
          <p style={{ font: "700 22px/28px var(--font)", margin: "14px 0 2px" }}>{user?.name}</p>
          <p className="kecil redup" style={{ margin: "0 0 20px" }}>{user?.email}</p>
          <button type="button" className="tombol t-bahaya t-blok" onClick={handleSignOut}>
            <Icon name="signOut" size={18} /> Keluar
          </button>
        </div>

        <div>
          <form className="kartu-panel" style={{ marginBottom: 20 }} onSubmit={saveProfile}>
            <p className="judul-2" style={{ marginBottom: 16 }}>Data diri</p>
            <div className="g2">
              <div className="kolom">
                <span className="inp-label">Nama</span>
                <input className="inp" type="text" value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="kolom">
                <span className="inp-label">Email</span>
                <div className="inp ph" style={{ background: "var(--latar)" }}>{user?.email}</div>
              </div>
            </div>
            <div className="kolom" style={{ marginTop: 16 }}>
              <span className="inp-label">Bio</span>
              <input
                className="inp"
                type="text"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Ceritakan sedikit tentang Anda"
              />
            </div>
            {profileError && <p className="pesan-galat">{profileError}</p>}
            {profileMessage && <div className="kotak-berhasil" style={{ marginTop: 12, marginBottom: 0 }}>{profileMessage}</div>}
            <button type="submit" className="tombol t-primer" style={{ marginTop: 20 }} disabled={profileSaving}>
              {profileSaving ? "Menyimpan…" : "Simpan perubahan"}
            </button>
          </form>

          <form className="kartu-panel" onSubmit={savePassword}>
            <p className="judul-2" style={{ marginBottom: 16 }}>Ganti password</p>
            <div className="g2">
              <div className="kolom">
                <span className="inp-label">Password lama</span>
                <input className="inp" type="password" value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} />
              </div>
              <div className="kolom">
                <span className="inp-label">Password baru</span>
                <input className="inp" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
              </div>
            </div>
            {passwordError && <p className="pesan-galat">{passwordError}</p>}
            {passwordMessage && <div className="kotak-berhasil" style={{ marginTop: 12, marginBottom: 0 }}>{passwordMessage}</div>}
            <button type="submit" className="tombol t-netral" style={{ marginTop: 20 }} disabled={passwordSaving}>
              {passwordSaving ? "Memperbarui…" : "Perbarui password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
