// Grid card used on the home screen. Saving is optimistic: the card flips
// immediately, then the request is sent; a failed request reverts the flip.

import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import { api } from "../lib/api";
import { CONTENT_TYPES, contentTypeLabel, contentCardMeta } from "@shared/categories";

export default function ContentCard({ content, onToggleFavorite }) {
  const [saved, setSaved] = useState(content.disimpan);
  const [busy, setBusy] = useState(false);
  const badge = CONTENT_TYPES[content.type];

  async function toggleSave(event) {
    event.preventDefault();
    if (busy) return;
    const next = !saved;
    setSaved(next);
    setBusy(true);
    try {
      if (next) await api.addFavorite(content.id);
      else await api.removeFavorite(content.id);
      onToggleFavorite?.(content.id, next);
    } catch {
      setSaved(!next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Link to={`/konten/${content.slug}`} className="kartu">
      <div className="sampul">
        <img src={content.imageUrl} alt="" />
        <span className={`lencana ${badge?.className || ""}`}>{contentTypeLabel(content.type)}</span>
        <span
          role="button"
          tabIndex={0}
          aria-label={saved ? "Hapus dari favorit" : "Simpan ke favorit"}
          className={`simpan${saved ? " on" : ""}`}
          onClick={toggleSave}
          onKeyDown={(event) => (event.key === "Enter" ? toggleSave(event) : null)}
        >
          <Icon name={saved ? "bookmarkFilled" : "bookmark"} size={18} />
        </span>
      </div>
      <div className="kartu-isi">
        <p className="kartu-judul">{content.title}</p>
        <p className="kartu-kutip">{content.excerpt}</p>
        <p className="kartu-meta">{contentCardMeta(content)}</p>
      </div>
    </Link>
  );
}
