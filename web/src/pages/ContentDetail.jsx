// Content detail page. Layout depends on the content's `type`: article gets
// a plain cover photo, video gets a real embedded player, infographic gets a
// tall framed image with a "view full size" link.

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { categoryLabel, contentTypeLabel } from "@shared/categories";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import Markdown from "../components/Markdown";
import { api } from "../lib/api";

export default function ContentDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [saved, setSaved] = useState(false);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    api.content(slug)
      .then((result) => {
        if (cancelled) return;
        setContent(result.konten);
        setSaved(result.disimpan);
        return api.contents({ category: result.konten.category, perPage: 4 }).then((data) => {
          if (cancelled) return;
          setRelated(data.konten.filter((item) => item.slug !== result.konten.slug).slice(0, 3));
        });
      })
      .catch((err) => { if (!cancelled) setError(err.message || "Konten tidak ditemukan."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  async function toggleSave() {
    const next = !saved;
    setSaved(next);
    try {
      if (next) await api.addFavorite(content.id);
      else await api.removeFavorite(content.id);
    } catch {
      setSaved(!next);
    }
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: content?.title, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  }

  if (loading) return <Loading message="Memuat konten…" />;
  if (error || !content) return <div className="kotak-galat">{error || "Konten tidak ditemukan."}</div>;

  return (
    <div>
      <div className="baris" style={{ justifyContent: "space-between", marginBottom: 16 }}>
        <button type="button" className="tombol t-teks" onClick={() => navigate("/beranda")} style={{ padding: 0 }}>
          <Icon name="back" size={18} /> Kembali ke Beranda
        </button>
        <div className="baris" style={{ gap: 8 }}>
          <span role="button" tabIndex={0} className="ikon-bulat" aria-label="Bagikan" onClick={share}>
            <Icon name="share" size={20} />
          </span>
          <span
            role="button"
            tabIndex={0}
            className={`ikon-bulat${saved ? " on" : ""}`}
            aria-label={saved ? "Hapus dari favorit" : "Simpan ke favorit"}
            onClick={toggleSave}
          >
            <Icon name={saved ? "bookmarkFilled" : "bookmark"} size={20} />
          </span>
        </div>
      </div>

      <div className="detail-layout">
        <div>
          {content.type === "video" && (
            <div className="pemutar" style={{ marginBottom: 20, borderRadius: "var(--radius-md)" }}>
              <iframe
                title={content.title}
                src={`https://www.youtube.com/embed/${content.videoId}`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {content.type === "infographic" && (
            <div className="infografis-bingkai" style={{ marginBottom: 20 }}>
              <img src={content.imageUrl} alt="" />
              <a className="perbesar" href={content.imageUrl} target="_blank" rel="noreferrer">
                <Icon name="add" size={16} /> Perbesar
              </a>
            </div>
          )}

          {content.type === "article" && (
            <img
              src={content.imageUrl}
              alt=""
              style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: "var(--radius-md)", marginBottom: 20 }}
            />
          )}

          <span className={`lencana ${content.type === "article" ? "l-art" : content.type === "video" ? "l-vid" : "l-inf"}`}>
            {contentTypeLabel(content.type)}
          </span>
          <h1 style={{ font: "700 34px/40px var(--font)", margin: "12px 0 8px" }}>{content.title}</h1>
          <p className="label paling-redup" style={{ marginBottom: 20 }}>
            {categoryLabel(content.category)} · {content.readingMinutes} menit · {content.author}
          </p>

          <Markdown text={content.body} />
        </div>

        <div>
          {content.source?.name && (
            <div className="sumber" style={{ marginBottom: 16 }}>
              <div className="l">SUMBER</div>
              <a className="v" href={content.source.url} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                {content.source.name}
              </a>
            </div>
          )}

          {related.length > 0 && (
            <>
              <p className="label paling-redup" style={{ marginBottom: 10 }}>
                KONTEN LAIN DI {categoryLabel(content.category).toUpperCase()}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {related.map((item) => (
                  <Link key={item.slug} to={`/konten/${item.slug}`} className="baris-konten" style={{ textDecoration: "none", color: "inherit" }}>
                    <img className="thumb" src={item.imageUrl} alt="" />
                    <div style={{ flex: 1 }}>
                      <h4>{item.title}</h4>
                      <div className="meta">{contentTypeLabel(item.type)} · {item.readingMinutes} menit</div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
