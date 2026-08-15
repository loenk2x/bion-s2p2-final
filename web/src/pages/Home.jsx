// Home / beranda: greeting, daily rings, search + filters, content grid.

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@shared/AuthProvider";
import { firstName } from "@shared/format";
import { CATEGORY_SLUGS, CONTENT_TYPE_SLUGS, categoryLabel, contentTypeLabel } from "@shared/categories";
import Icon from "../components/Icon";
import { CardSkeleton } from "../components/Loading";
import ContentCard from "../components/ContentCard";
import DailyRings from "../components/DailyRings";
import { api } from "../lib/api";
import { useEntryAddedListener } from "../lib/entryEvents";

const SEARCH_DEBOUNCE_MS = 400;

export default function Home() {
  const { user } = useAuth();

  const [summary, setSummary] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");

  const [contents, setContents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const loadSummary = useCallback(() => {
    api.summary().then(setSummary).catch(() => {});
  }, []);

  useEffect(() => { loadSummary(); }, [loadSummary]);
  useEntryAddedListener(loadSummary);

  // Debounce the search box so every keystroke doesn't trigger a request.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    api.contents({
      category: category === "all" ? undefined : category,
      type: type === "all" ? undefined : type,
      search: search || undefined,
      page: 1
    })
      .then((data) => {
        if (cancelled) return;
        setContents(data.konten);
        setPage(data.halaman);
        setTotalPages(data.totalHalaman);
      })
      .catch((err) => { if (!cancelled) setError(err.message || "Konten gagal dimuat."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [category, type, search]);

  function loadMore() {
    setLoadingMore(true);
    api.contents({
      category: category === "all" ? undefined : category,
      type: type === "all" ? undefined : type,
      search: search || undefined,
      page: page + 1
    })
      .then((data) => {
        setContents((prev) => [...prev, ...data.konten]);
        setPage(data.halaman);
        setTotalPages(data.totalHalaman);
      })
      .finally(() => setLoadingMore(false));
  }

  return (
    <div>
      <div className="beranda-atas">
        <div>
          <h1 className="judul-hal" style={{ marginBottom: 20 }}>Halo, {firstName(user?.name)}</h1>

          <div className="cari" style={{ maxWidth: 420, marginBottom: 18 }}>
            <Icon name="search" size={20} />
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Cari artikel, video, infografis"
            />
          </div>

          <div className="deret-chip" style={{ marginBottom: 14 }}>
            <span className={`chip${category === "all" ? " on" : ""}`} role="button" tabIndex={0} onClick={() => setCategory("all")}>
              Semua
            </span>
            {CATEGORY_SLUGS.map((slug) => (
              <span
                key={slug}
                className={`chip${category === slug ? " on" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => setCategory(slug)}
              >
                {categoryLabel(slug)}
              </span>
            ))}
          </div>

          <div className="tab-garis">
            <a className={type === "all" ? "on" : undefined} onClick={() => setType("all")}>Semua</a>
            {CONTENT_TYPE_SLUGS.map((slug) => (
              <a key={slug} className={type === slug ? "on" : undefined} onClick={() => setType(slug)}>
                {contentTypeLabel(slug)}
              </a>
            ))}
          </div>
        </div>

        {summary && <DailyRings rings={summary.cincin} />}
      </div>

      {error && <div className="kotak-galat">{error}</div>}

      {loading && <CardSkeleton count={6} />}

      {!loading && contents.length === 0 && (
        <div className="kosong">
          <Icon name="search" size={48} />
          <h4>Tidak ditemukan</h4>
          <p>Coba kata kunci atau filter lain.</p>
        </div>
      )}

      {!loading && contents.length > 0 && (
        <>
          <div className="grid-konten">
            {contents.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
          {page < totalPages && (
            <div style={{ textAlign: "center", marginTop: "var(--jarak-24)" }}>
              <button type="button" className="tombol t-netral" onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? "Memuat…" : "Muat lebih banyak"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
