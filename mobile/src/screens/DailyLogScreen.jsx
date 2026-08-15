// Catatan Harian. Mirrors web/src/pages/DailyLog.jsx: seven-day summary
// tiles, then the full entry history grouped by date, plus the "tambah
// catatan" flow (AddEntryModal, including the breathing session) via a
// floating action button.

import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatDecimal, formatInteger, formatDateGroupHeading } from "@shared/format";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import ActivityCard from "../components/ActivityCard";
import AddEntryModal from "../components/AddEntryModal";
import Fab from "../components/Fab";
import { api } from "../lib/api";
import { colors, radius, spacing } from "../theme/colors";

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

export default function DailyLogScreen() {
  const [summary, setSummary] = useState(null);
  const [groups, setGroups] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [addOpen, setAddOpen] = useState(false);

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

  useFocusEffect(useCallback(() => { load(); }, [load]));

  function loadMore() {
    setLoadingMore(true);
    api.entries({ page: page + 1 })
      .then((data) => {
        setGroups((prev) => mergeGroups(prev, data.kelompok));
        setPage(data.halaman);
      })
      .finally(() => setLoadingMore(false));
  }

  function handleSaved() {
    setAddOpen(false);
    load();
  }

  const sevenDaySummary = summary?.tujuhHari;

  const header = (
    <View>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Catatan Harian</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setAddOpen(true)}>
          <Icon name="add" size={16} color={colors.putih} />
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.tileGrid}>
        <SummaryTile label="Langkah 7 hari" value={sevenDaySummary ? formatInteger(sevenDaySummary.totalLangkah) : "—"} />
        <SummaryTile label="Rata-rata tidur" value={sevenDaySummary ? formatDecimal(sevenDaySummary.rataTidur) : "—"} unit="jam" />
        <SummaryTile label="Total olahraga" value={sevenDaySummary ? formatInteger(sevenDaySummary.totalOlahraga) : "—"} unit="menit" />
        <SummaryTile label="Rata-rata air" value={sevenDaySummary ? formatDecimal(sevenDaySummary.rataAir) : "—"} unit="gelas" />
      </View>

      {!groups && !error ? <Loading message="Memuat catatan…" /> : null}

      {groups && groups.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="notes" size={40} color={colors.tinta400} />
          <Text style={styles.emptyTitle}>Belum ada catatan</Text>
          <Text style={styles.emptyText}>Ketuk "Tambah" untuk mulai mencatat aktivitas hari ini.</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={groups || []}
        keyExtractor={(group) => group.date}
        contentContainerStyle={styles.list}
        ListHeaderComponent={header}
        renderItem={({ item: group }) => (
          <View style={styles.group}>
            <Text style={styles.groupHeading}>{formatDateGroupHeading(group.date)}</Text>
            <View style={styles.entryGrid}>
              {group.catatan.map((entry) => (
                <ActivityCard key={entry.id} entry={entry} />
              ))}
            </View>
          </View>
        )}
        ListFooterComponent={
          groups && page < totalPages ? (
            <TouchableOpacity style={styles.moreButton} onPress={loadMore} disabled={loadingMore}>
              <Text style={styles.moreButtonText}>{loadingMore ? "Memuat…" : "Muat lebih banyak"}</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <Fab onPress={() => setAddOpen(true)} />
      <AddEntryModal visible={addOpen} onClose={() => setAddOpen(false)} onSaved={handleSaved} />
    </SafeAreaView>
  );
}

function SummaryTile({ label, value, unit }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={styles.tileValue}>
        {value} {unit ? <Text style={styles.tileUnit}>{unit}</Text> : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.latar },
  list: { padding: spacing.s16, paddingBottom: spacing.s40 },
  // marginBottom used to live on the subtitle sentence below the title; now
  // that the sentence is gone, titleRow carries the gap itself so the title
  // doesn't sit flush against the summary tiles (see FavoritesScreen.jsx for
  // the same fix applied when its subtitle line was removed).
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.s16 },
  title: { fontSize: 22, fontWeight: "700", color: colors.tinta900 },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.hijau600,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  addButtonText: { color: colors.putih, fontWeight: "700", fontSize: 13 },
  errorText: { color: colors.bahaya, marginBottom: spacing.s12 },
  tileGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.s12, marginBottom: spacing.s20 },
  tile: {
    flexBasis: "47%",
    flexGrow: 1,
    backgroundColor: colors.putih,
    borderWidth: 1,
    borderColor: colors.garis,
    borderRadius: radius.md,
    padding: spacing.s12
  },
  tileLabel: { fontSize: 12, color: colors.tinta600 },
  tileValue: { fontSize: 20, fontWeight: "700", color: colors.tinta900, marginTop: 4 },
  tileUnit: { fontSize: 12, fontWeight: "400", color: colors.tinta400 },
  empty: { alignItems: "center", paddingVertical: spacing.s40, gap: 6 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: colors.tinta900 },
  emptyText: { fontSize: 13, color: colors.tinta600, textAlign: "center" },
  group: { marginBottom: spacing.s16 },
  groupHeading: { fontSize: 11, fontWeight: "700", color: colors.tinta400, letterSpacing: 0.5, marginBottom: spacing.s8 },
  entryGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.s12 },
  moreButton: {
    alignSelf: "center",
    borderWidth: 1,
    borderColor: colors.garis,
    borderRadius: radius.sm,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: spacing.s8
  },
  moreButtonText: { fontSize: 13, fontWeight: "600", color: colors.tinta900 }
});
