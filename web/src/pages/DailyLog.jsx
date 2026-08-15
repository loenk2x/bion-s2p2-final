// Daily log: seven-day summary tiles, then the full entry history grouped by
// date. Listens for entries added from the shell-level AddEntryModal so the
// history and the summary tiles stay current without a full page reload.

import { useCallback, useEffect, useState } from "react";
import { formatDecimal, formatInteger, formatDateGroupHeading } from "@shared/format";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import ActivityCard from "../components/ActivityCard";
import { api } from "../lib/api";
import { useEntryAddedListener } from "../lib/entryEvents";

export default function DailyLog() {
  const [summary, setSummary] = useState(null);
  const [groups, setGroups] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setError("");
    Promise.all([api.summary(), api.entries({ page: 1 })])
      .then(([summaryData, entriesData]) => {
        setSummary(summaryData);
        setGroups(entriesData.kelompok);
        setPage(entriesData.halaman);
        setTotalPages(Math.ceil(entriesData.total / entriesData.perHalaman) || 1);
      })
      .catch((err) => setError(err.message || "Catatan gagal dimuat."));
  }, []);

  useEffect(() => { load(); }, [load]);
  useEntryAddedListener(load);

  function loadMore() {
    setLoadingMore(true);
    api.entries({ page: page + 1 })
      .then((data) => {
        setGroups((prev) => mergeGroups(prev, data.kelompok));
        setPage(data.halaman);
      })
      .finally(() => setLoadingMore(false));
  }

  const sevenDaySummary = summary?.tujuhHari;

  return (
    <div>
      <h1 className="judul-hal" style={{ marginBottom: 20 }}>Catatan Harian</h1>

      {error && <div className="kotak-galat">{error}</div>}

      <div className="g4" style={{ marginBottom: 24 }}>
        <div className="ringkas">
          <div className="l">Langkah 7 hari</div>
          <div className="n">{sevenDaySummary ? formatInteger(sevenDaySummary.totalLangkah) : "—"}</div>
        </div>
        <div className="ringkas">
          <div className="l">Rata-rata tidur</div>
          <div className="n">{sevenDaySummary ? formatDecimal(sevenDaySummary.rataTidur) : "—"} <span>jam</span></div>
        </div>
        <div className="ringkas">
          <div className="l">Total olahraga</div>
          <div className="n">{sevenDaySummary ? formatInteger(sevenDaySummary.totalOlahraga) : "—"} <span>menit</span></div>
        </div>
        <div className="ringkas">
          <div className="l">Rata-rata air</div>
          <div className="n">{sevenDaySummary ? formatDecimal(sevenDaySummary.rataAir) : "—"} <span>gelas</span></div>
        </div>
      </div>

      {!groups && !error && <Loading message="Memuat catatan…" />}

      {groups && groups.length === 0 && (
        <div className="kosong">
          <Icon name="notes" size={48} />
          <h4>Belum ada catatan</h4>
          <p>Ketuk "Tambah catatan" untuk mulai mencatat aktivitas hari ini.</p>
        </div>
      )}

      {groups && groups.map((group) => (
        <div key={group.date}>
          <p className="kel-tanggal" style={{ marginTop: 0 }}>{formatDateGroupHeading(group.date)}</p>
          <div className="g3" style={{ gap: 12, marginBottom: 8 }}>
            {group.catatan.map((entry) => (
              <ActivityCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      ))}

      {groups && page < totalPages && (
        <div style={{ textAlign: "center", marginTop: "var(--jarak-16)" }}>
          <button type="button" className="tombol t-netral" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? "Memuat…" : "Muat lebih banyak"}
          </button>
        </div>
      )}
    </div>
  );
}

// Appends a fresh page of grouped entries onto what is already on screen,
// merging into an existing date group rather than creating a duplicate one.
function mergeGroups(existing, incoming) {
  const merged = existing.map((group) => ({ ...group, catatan: [...group.catatan] }));
  for (const group of incoming) {
    const target = merged.find((g) => g.date === group.date);
    if (target) target.catatan.push(...group.catatan);
    else merged.push(group);
  }
  return merged;
}
