// Public landing page. Signed-in visitors are sent straight to /beranda;
// everyone else sees a teaser of the content library with the last item
// blurred out to make the point that registration unlocks the rest.

import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@shared/AuthProvider";
import { CONTENT_TYPE_SLUGS, categoryLabel, contentTypeLabel } from "@shared/categories";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import { api } from "../lib/api";

export default function Landing() {
  const { signedIn, loading: authLoading } = useAuth();
  const [teaser, setTeaser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (signedIn) return;
    let cancelled = false;
    api.teaser()
      .then((data) => { if (!cancelled) setTeaser(data); })
      .catch((err) => { if (!cancelled) setError(err.message || "Konten gagal dimuat."); });
    return () => { cancelled = true; };
  }, [signedIn]);

  if (authLoading) return <Loading message="Memeriksa sesi Anda…" />;
  if (signedIn) return <Navigate to="/beranda" replace />;

  return (
    <div>
      <header className="app-head">
        <div className="wadah">
          <div className="logo">
            <i><Icon name="leaf" size={18} /></i> Healthy Life
          </div>
          <div className="aksi">
            <Link to="/masuk" className="tombol t-teks">Masuk</Link>
            <Link to="/daftar" className="tombol t-primer">Daftar gratis</Link>
          </div>
        </div>
      </header>

      <div className="wadah" style={{ paddingTop: "var(--jarak-48)", paddingBottom: "var(--jarak-48)" }}>
        <div className="landing-hero">
            <div>
              <h1 className="judul-besar" style={{ fontSize: 44, lineHeight: "52px" }}>
                Belajar hidup sehat, satu langkah tiap hari.
              </h1>
              <p className="redup" style={{ margin: "16px 0 24px", fontSize: 17, lineHeight: "26px" }}>
                20 artikel, video, dan infografis dari Kementerian Kesehatan RI, WHO, dan sumber tepercaya lain.
                Simpan yang penting, lalu catat aktivitas harian Anda sendiri.
              </p>
              <div className="baris" style={{ gap: 12, marginBottom: 28 }}>
                <Link to="/daftar" className="tombol t-primer">Daftar gratis</Link>
                <Link to="/masuk" className="tombol t-netral">Sudah punya akun</Link>
              </div>
              <div className="baris" style={{ gap: 32 }}>
                <div>
                  <div className="judul-1">{teaser ? teaser.jumlahKonten : "—"}</div>
                  <div className="label redup">KONTEN</div>
                </div>
                <div>
                  <div className="judul-1">{teaser ? teaser.jumlahKategori : "—"}</div>
                  <div className="label redup">KATEGORI</div>
                </div>
                <div>
                  <div className="judul-1">{CONTENT_TYPE_SLUGS.length}</div>
                  <div className="label redup">TIPE KONTEN</div>
                </div>
              </div>
            </div>

            <div style={{ background: "var(--hijau-50)", padding: "var(--jarak-32)", borderRadius: "var(--radius-md)" }}>
              <p className="label paling-redup" style={{ marginBottom: 14 }}>CUPLIKAN KONTEN</p>
              {error && <p className="pesan-galat">{error}</p>}
              {!teaser && !error && <Loading message="Memuat cuplikan konten…" />}
              {teaser && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {teaser.konten.map((item, index) => {
                    const locked = index >= 2;
                    return (
                      <div className="baris-konten" key={item.slug} style={locked ? { opacity: 0.6 } : undefined}>
                        <img className="thumb" src={item.imageUrl} alt="" style={locked ? { filter: "blur(3px)" } : undefined} />
                        <div style={{ flex: 1 }}>
                          <h4 style={locked ? { color: "var(--tinta-400)" } : undefined}>{item.title}</h4>
                          <div className="meta">{categoryLabel(item.category)} · {contentTypeLabel(item.type)}</div>
                        </div>
                        {locked && (
                          <span className="ikon-bulat">
                            <Icon name="lock" size={20} />
                          </span>
                        )}
                      </div>
                    );
                  })}
                  <p className="kecil redup" style={{ margin: "4px 0 0" }}>Daftar dulu untuk membuka seluruh konten.</p>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
}
