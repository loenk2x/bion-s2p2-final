// Saved content. On touch widths each row can be swiped left to reveal a
// delete button, matching design/mockups.html screen "9 · Favorit, satu
// baris digeser" (.geser-luar / .geser-hapus / .geser-isi, already generated
// into komponen.css). On desktop the mockup uses a separate screen
// ("6 · Favorit — baris kedua dalam keadaan disorot kursor") that never
// shows the swipe panel and instead reveals the delete button on hover —
// kept below as .baris-favorit/.hapus-favorit, unchanged from before.

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { categoryLabel, contentTypeLabel } from "@shared/categories";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import { api } from "../lib/api";

// Matches .geser-hapus's width, generated from the mockup into komponen.css.
const REVEAL_WIDTH = 84;
const OPEN_THRESHOLD = REVEAL_WIDTH / 2;
const DIRECTION_LOCK = 8; // px of movement before a gesture commits to an axis

export default function Favorites() {
  const [favorites, setFavorites] = useState(null);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [openFavId, setOpenFavId] = useState(null);

  const listRef = useRef(null);
  const rowElsRef = useRef(new Map()); // fav id (string) -> .geser-isi element
  const gestureRef = useRef(null);

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
      setOpenFavId((prev) => (prev === String(item.id) ? null : prev));
    } catch (err) {
      setError(err.message || "Gagal menghapus favorit.");
    } finally {
      setRemovingId(null);
    }
  }

  // Touch-driven swipe-to-delete, delegated on the list container so it keeps
  // working as rows are added or removed. touchmove is registered as a
  // native, non-passive listener because React's synthetic touch handlers
  // are passive by default and can't preventDefault to stop the page from
  // scrolling once a horizontal drag is recognised.
  useEffect(() => {
    const container = listRef.current;
    if (!container) return;

    function closeElement(el) {
      el.style.transition = "transform .18s ease";
      el.style.transform = "translateX(0)";
    }
    function openElement(el) {
      el.style.transition = "transform .18s ease";
      el.style.transform = `translateX(-${REVEAL_WIDTH}px)`;
    }

    function onTouchStart(event) {
      const row = event.target.closest ? event.target.closest(".geser-luar") : null;
      if (!row || !container.contains(row)) return;
      const id = row.dataset.favId;
      const el = rowElsRef.current.get(id);
      if (!el) return;

      // Swiping a different row closes whichever one was open.
      if (openFavId && openFavId !== id) {
        const prevEl = rowElsRef.current.get(openFavId);
        if (prevEl) closeElement(prevEl);
        setOpenFavId(null);
      }

      const touch = event.touches[0];
      const startedOpen = openFavId === id;
      gestureRef.current = {
        id,
        el,
        startX: touch.clientX,
        startY: touch.clientY,
        dir: null,
        baseOffset: startedOpen ? -REVEAL_WIDTH : 0,
        lastOffset: startedOpen ? -REVEAL_WIDTH : 0,
      };
      el.style.transition = "none";
    }

    function onTouchMove(event) {
      const g = gestureRef.current;
      if (!g) return;
      const touch = event.touches[0];
      const dx = touch.clientX - g.startX;
      const dy = touch.clientY - g.startY;

      if (!g.dir) {
        if (Math.abs(dx) < DIRECTION_LOCK && Math.abs(dy) < DIRECTION_LOCK) return;
        g.dir = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
      if (g.dir !== "x") return; // vertical drag: let the page scroll normally

      event.preventDefault();
      const next = Math.min(0, Math.max(-REVEAL_WIDTH, g.baseOffset + dx));
      g.lastOffset = next;
      g.el.style.transform = `translateX(${next}px)`;
    }

    function onTouchEnd() {
      const g = gestureRef.current;
      gestureRef.current = null;
      if (!g || g.dir !== "x") return;
      const shouldOpen = g.lastOffset <= -OPEN_THRESHOLD;
      if (shouldOpen) openElement(g.el); else closeElement(g.el);
      setOpenFavId(shouldOpen ? g.id : null);
    }

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });
    container.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [openFavId]);

  function handleRowClick(event, id) {
    if (openFavId === id) {
      // A tap on an already-open row closes it instead of navigating away.
      event.preventDefault();
      const el = rowElsRef.current.get(id);
      if (el) { el.style.transition = "transform .18s ease"; el.style.transform = "translateX(0)"; }
      setOpenFavId(null);
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
        <div ref={listRef} style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 760 }}>
          {favorites.map((item) => {
            const id = String(item.id);
            return (
              <div key={id} className={`geser-luar${openFavId === id ? " aktif" : ""}`} data-fav-id={id}>
                <div
                  className="geser-hapus"
                  role="button"
                  tabIndex={0}
                  aria-label="Hapus dari favorit"
                  onClick={() => { if (removingId !== item.id) remove(item); }}
                >
                  <Icon name="trash" size={22} />
                  Hapus
                </div>
                <Link
                  to={`/konten/${item.slug}`}
                  className="geser-isi baris-konten baris-favorit"
                  style={{ textDecoration: "none", color: "inherit" }}
                  ref={(el) => { if (el) rowElsRef.current.set(id, el); else rowElsRef.current.delete(id); }}
                  onClick={(event) => handleRowClick(event, id)}
                >
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
