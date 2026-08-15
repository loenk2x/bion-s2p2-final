// Beranda / Home. Mirrors web/src/pages/Home.jsx: greeting, search box
// (debounced), category chips, content-type tabs, the daily rings card, and
// a two-column grid of content cards with a "muat lebih banyak" pagination
// button.

import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@shared/AuthProvider";
import { firstName } from "@shared/format";
import { CATEGORY_SLUGS, CONTENT_TYPE_SLUGS, categoryLabel, contentTypeLabel } from "@shared/categories";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import ContentCard from "../components/ContentCard";
import DailyRings from "../components/DailyRings";
import { api } from "../lib/api";
import { colors, radius, spacing } from "../theme/colors";

const SEARCH_DEBOUNCE_MS = 400;

export default function HomeScreen({ navigation }) {
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
  // Refreshed on focus, in place of the web app's cross-component
  // entryAdded event, so the rings stay current after entries are logged
  // from the Catatan tab.
  useEffect(() => navigation.addListener("focus", loadSummary), [navigation, loadSummary]);

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

  function openContent(content) {
    navigation.navigate("kontenDetail", { slug: content.slug });
  }

  const header = (
    <View>
      {summary ? <DailyRings rings={summary.cincin} /> : null}

      <Text style={styles.greeting}>Halo, {firstName(user?.name)}</Text>

      <View style={styles.searchBox}>
        <Icon name="search" size={18} color={colors.tinta400} />
        <TextInput
          style={styles.searchInput}
          value={searchInput}
          onChangeText={setSearchInput}
          placeholder="Cari artikel, video, infografis"
          placeholderTextColor={colors.tinta400}
        />
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
        data={["all", ...CATEGORY_SLUGS]}
        keyExtractor={(slug) => slug}
        renderItem={({ item: slug }) => (
          <TouchableOpacity
            style={[styles.chip, category === slug && styles.chipOn]}
            onPress={() => setCategory(slug)}
          >
            <Text style={[styles.chipText, category === slug && styles.chipTextOn]}>
              {slug === "all" ? "Semua" : categoryLabel(slug)}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.tabRow}>
        {["all", ...CONTENT_TYPE_SLUGS].map((slug) => (
          <TouchableOpacity key={slug} style={styles.typeTab} onPress={() => setType(slug)}>
            <Text style={[styles.typeTabText, type === slug && styles.typeTabTextOn]}>
              {slug === "all" ? "Semua" : contentTypeLabel(slug)}
            </Text>
            {type === slug ? <View style={styles.typeTabUnderline} /> : null}
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {loading ? <Loading message="Memuat konten…" /> : null}
      {!loading && contents.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="search" size={40} color={colors.tinta400} />
          <Text style={styles.emptyTitle}>Tidak ditemukan</Text>
          <Text style={styles.emptyText}>Coba kata kunci atau filter lain.</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <FlatList
        data={loading ? [] : contents}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ContentCard content={item} onPress={() => openContent(item)} style={styles.cardSpacing} />
        )}
        ListHeaderComponent={header}
        ListFooterComponent={
          !loading && contents.length > 0 && page < totalPages ? (
            <TouchableOpacity style={styles.moreButton} onPress={loadMore} disabled={loadingMore}>
              <Text style={styles.moreButtonText}>{loadingMore ? "Memuat…" : "Muat lebih banyak"}</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.latar },
  list: { padding: spacing.s16, gap: spacing.s12 },
  column: { gap: spacing.s12 },
  cardSpacing: { marginBottom: spacing.s12 },
  // Sits below the rings card now; marginTop stands in for the date line's old
  // marginBottom now that the date is gone, so the gap to the rings card above
  // doesn't collapse. No marginBottom here - searchBox's own marginTop below
  // already provides the gap down to the search box.
  greeting: { fontSize: 22, fontWeight: "700", color: colors.tinta900, marginTop: spacing.s16 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.putih,
    borderWidth: 1,
    borderColor: colors.garis,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    // Sits below the greeting now, so the gap belongs above it. The gap to the
    // category chips comes from chipRow's own marginTop.
    marginTop: spacing.s16
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.tinta900 },
  chipRow: { marginTop: spacing.s16, marginBottom: spacing.s12 },
  chip: {
    borderWidth: 1,
    borderColor: colors.garis,
    borderRadius: radius.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8
  },
  chipOn: { backgroundColor: colors.hijau600, borderColor: colors.hijau600 },
  chipText: { fontSize: 13, color: colors.tinta600 },
  chipTextOn: { color: colors.putih, fontWeight: "600" },
  tabRow: { flexDirection: "row", gap: spacing.s16, borderBottomWidth: 1, borderBottomColor: colors.garis, marginBottom: spacing.s16 },
  typeTab: { paddingBottom: 10 },
  typeTabText: { fontSize: 13, color: colors.tinta400 },
  typeTabTextOn: { color: colors.hijau600, fontWeight: "700" },
  typeTabUnderline: { height: 2, backgroundColor: colors.hijau600, marginTop: 8, borderRadius: 1 },
  errorText: { color: colors.bahaya, marginBottom: spacing.s12 },
  empty: { alignItems: "center", paddingVertical: spacing.s40, gap: 6 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: colors.tinta900 },
  emptyText: { fontSize: 13, color: colors.tinta600 },
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
