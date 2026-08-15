// Public landing screen. Mirrors web/src/pages/Landing.jsx: a teaser of the
// content library is fetched from the public endpoint, with everything past
// the second item shown locked to make the point that registering unlocks
// the rest.

import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CONTENT_TYPE_SLUGS, categoryLabel, contentTypeLabel } from "@shared/categories";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import { api } from "../lib/api";
import { colors, radius, spacing } from "../theme/colors";

export default function LandingScreen({ navigation }) {
  const [teaser, setTeaser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api.teaser()
      .then((data) => { if (!cancelled) setTeaser(data); })
      .catch((err) => { if (!cancelled) setError(err.message || "Konten gagal dimuat."); });
    return () => { cancelled = true; };
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.logoRow}>
          <Icon name="leaf" size={20} color={colors.hijau600} />
          <Text style={styles.logoText}>Healthy Life</Text>
        </View>

        <Text style={styles.heroTitle}>Belajar hidup sehat, satu langkah tiap hari.</Text>
        <Text style={styles.heroSubtitle}>
          20 artikel, video, dan infografis dari Kementerian Kesehatan RI, WHO, dan sumber tepercaya
          lain. Simpan yang penting, lalu catat aktivitas harian Anda sendiri.
        </Text>

        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.navigate("daftar")}>
            <Text style={styles.primaryButtonText}>Daftar gratis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.neutralButton} onPress={() => navigation.navigate("masuk")}>
            <Text style={styles.neutralButtonText}>Sudah punya akun</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statNumber}>{teaser ? teaser.jumlahKonten : "—"}</Text>
            <Text style={styles.statLabel}>KONTEN</Text>
          </View>
          <View>
            <Text style={styles.statNumber}>{teaser ? teaser.jumlahKategori : "—"}</Text>
            <Text style={styles.statLabel}>KATEGORI</Text>
          </View>
          <View>
            <Text style={styles.statNumber}>{CONTENT_TYPE_SLUGS.length}</Text>
            <Text style={styles.statLabel}>TIPE KONTEN</Text>
          </View>
        </View>

        <View style={styles.teaserPanel}>
          <Text style={styles.teaserHeading}>CUPLIKAN KONTEN</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {!teaser && !error ? <Loading message="Memuat cuplikan konten…" /> : null}
          {teaser && teaser.konten.map((item, index) => {
            const locked = index >= 2;
            return (
              <View key={item.slug} style={[styles.teaserRow, locked && styles.teaserRowLocked]}>
                <Image source={{ uri: item.imageUrl }} style={[styles.thumb, locked && styles.thumbLocked]} />
                <View style={styles.teaserInfo}>
                  <Text style={[styles.teaserTitle, locked && styles.teaserTitleLocked]} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.teaserMeta}>
                    {categoryLabel(item.category)} · {contentTypeLabel(item.type)}
                  </Text>
                </View>
                {locked ? (
                  <View style={styles.lockBadge}>
                    <Icon name="lock" size={18} color={colors.tinta600} />
                  </View>
                ) : null}
              </View>
            );
          })}
          {teaser ? <Text style={styles.teaserFootnote}>Daftar dulu untuk membuka seluruh konten.</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.putih },
  scroll: { padding: spacing.s20, gap: spacing.s16 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: spacing.s12 },
  logoText: { fontSize: 18, fontWeight: "700", color: colors.tinta900 },
  heroTitle: { fontSize: 30, lineHeight: 36, fontWeight: "700", color: colors.tinta900 },
  heroSubtitle: { fontSize: 15, lineHeight: 22, color: colors.tinta600 },
  ctaRow: { flexDirection: "row", gap: spacing.s12, flexWrap: "wrap" },
  primaryButton: {
    backgroundColor: colors.hijau600,
    borderRadius: radius.sm,
    paddingVertical: 12,
    paddingHorizontal: 20
  },
  primaryButtonText: { color: colors.putih, fontWeight: "600", fontSize: 15 },
  neutralButton: {
    backgroundColor: colors.putih,
    borderColor: colors.garis,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingVertical: 12,
    paddingHorizontal: 20
  },
  neutralButtonText: { color: colors.tinta900, fontWeight: "600", fontSize: 15 },
  statsRow: { flexDirection: "row", gap: spacing.s32, marginVertical: spacing.s8 },
  statNumber: { fontSize: 24, fontWeight: "700", color: colors.tinta900 },
  statLabel: { fontSize: 11, color: colors.tinta400, letterSpacing: 0.5, marginTop: 2 },
  teaserPanel: {
    backgroundColor: colors.hijau50,
    borderRadius: radius.md,
    padding: spacing.s20,
    gap: spacing.s12
  },
  teaserHeading: { fontSize: 11, fontWeight: "700", color: colors.tinta400, letterSpacing: 0.5 },
  errorText: { color: colors.bahaya },
  teaserRow: { flexDirection: "row", alignItems: "center", gap: spacing.s12 },
  teaserRowLocked: { opacity: 0.6 },
  thumb: { width: 56, height: 56, borderRadius: radius.sm, backgroundColor: colors.garis },
  thumbLocked: { opacity: 0.7 },
  teaserInfo: { flex: 1, gap: 2 },
  teaserTitle: { fontSize: 14, fontWeight: "600", color: colors.tinta900 },
  teaserTitleLocked: { color: colors.tinta400 },
  teaserMeta: { fontSize: 12, color: colors.tinta400 },
  lockBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.garis,
    backgroundColor: colors.putih,
    alignItems: "center",
    justifyContent: "center"
  },
  teaserFootnote: { fontSize: 12, color: colors.tinta600 }
});
