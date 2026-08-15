// Favorit. Mirrors web/src/pages/Favorites.jsx: saved content with a delete
// button on each row.

import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { categoryLabel, contentTypeLabel } from "@shared/categories";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import { api } from "../lib/api";
import { colors, radius, spacing } from "../theme/colors";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState(null);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      api.favorites()
        .then((data) => { if (!cancelled) setFavorites(data.favorit); })
        .catch((err) => { if (!cancelled) setError(err.message || "Favorit gagal dimuat."); });
      return () => { cancelled = true; };
    }, [])
  );

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
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorit</Text>
        <Text style={styles.subtitle}>
          {favorites ? `${favorites.length} konten disimpan. ` : ""}Hanya Anda yang bisa melihat daftar ini.
        </Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {!favorites && !error ? <Loading message="Memuat favorit…" /> : null}

      {favorites && favorites.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="bookmark" size={40} color={colors.tinta400} />
          <Text style={styles.emptyTitle}>Belum ada favorit</Text>
          <Text style={styles.emptyText}>Simpan artikel, video, atau infografis yang ingin dibaca lagi nanti.</Text>
        </View>
      ) : null}

      {favorites && favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate("kontenDetail", { slug: item.slug })}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
              <View style={styles.info}>
                <Text style={styles.rowTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.meta}>
                  {categoryLabel(item.category)} · {contentTypeLabel(item.type)} · {item.readingMinutes} menit
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => { if (removingId !== item.id) remove(item); }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="trash" size={18} color={colors.bahaya} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.putih },
  header: { paddingHorizontal: spacing.s16, paddingTop: spacing.s8 },
  title: { fontSize: 22, fontWeight: "700", color: colors.tinta900 },
  subtitle: { fontSize: 13, color: colors.tinta600, marginTop: 4, marginBottom: spacing.s16 },
  errorText: { color: colors.bahaya, marginBottom: spacing.s12 },
  list: { paddingHorizontal: spacing.s16, paddingBottom: spacing.s24, gap: spacing.s12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s12,
    backgroundColor: colors.putih,
    borderWidth: 1,
    borderColor: colors.garis,
    borderRadius: radius.md,
    padding: spacing.s8
  },
  thumb: { width: 56, height: 56, borderRadius: radius.sm, backgroundColor: colors.garis },
  info: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 14, fontWeight: "600", color: colors.tinta900 },
  meta: { fontSize: 11, color: colors.tinta400 },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: colors.bahaya100,
    alignItems: "center",
    justifyContent: "center"
  },
  empty: { alignItems: "center", paddingVertical: spacing.s40, gap: 6 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: colors.tinta900 },
  emptyText: { fontSize: 13, color: colors.tinta600, textAlign: "center", paddingHorizontal: spacing.s32 }
});
