// Saved content. Each row shows a delete button once the pointer is over it.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryLabel, contentTypeLabel } from "@shared/categories";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import { api } from "../lib/api";

export default function Favorites() {
  const [favorites, setFavorites] = useState(null);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.favorites()
      .then((data) => { if (!cancelled) setFavorites(data.favorit); })
      .catch((err) => { if (!cancelled) setError(err.message || "Favorit gagal dimuat."); });
    return () => { cancelled = true; };
  }, []);

  async function remove(item) {
    setRemovingId(item.id);
    try {
      await api.removeFavorite(item.id);
      setFavorites((prev) => prev.filter((f) => f.id !== item.id));
    } catch (err) {
      setError(err.message || "Gagal menghapus favorit.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div>
      <h1 className="judul-hal" style={{ marginBottom: 24 }}>Favorit</h1>

      {error && <div className="kotak-galat">{error}</div>}
      {!favorites && !error && <Loading message="Memuat favorit…" />}

      {favorites && favorites.length === 0 && (
        <div className="kosong">
          <Icon name="bookmark" size={48} />
          <h4>Belum ada favorit</h4>
          <p>Simpan artikel, video, atau infografis yang ingin dibaca lagi nanti.</p>
        </div>
      )}

      {favorites && favorites.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 760 }}>
          {favorites.map((item) => (
            <Link key={item.id} to={`/konten/${item.slug}`} className="baris-konten baris-favorit" style={{ textDecoration: "none", color: "inherit" }}>
              <img className="thumb" src={item.imageUrl} alt="" />
              <div style={{ flex: 1 }}>
                <h4>{item.title}</h4>
                <div className="meta">{categoryLabel(item.category)} · {contentTypeLabel(item.type)} · {item.readingMinutes} menit</div>
              </div>
              <span
                role="button"
                tabIndex={0}
                className="ikon-bulat hapus-favorit"
                aria-label="Hapus dari favorit"
                style={{ color: "var(--bahaya)", borderColor: "var(--bahaya-100)", background: "var(--bahaya-100)" }}
                onClick={(event) => { event.preventDefault(); if (removingId !== item.id) remove(item); }}
              >
                <Icon name="trash" size={20} />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
