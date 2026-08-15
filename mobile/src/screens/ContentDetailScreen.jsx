// Content detail. Mirrors web/src/pages/ContentDetail.jsx: layout depends on
// content.type - article gets a cover photo, video gets an embedded player,
// infographic gets a tall framed image. Body is rendered through
// @shared/markdown via the Markdown component (Langkah 6).

import { useEffect, useState } from "react";
import { Image, Linking, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { categoryLabel, contentTypeLabel } from "@shared/categories";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import Markdown from "../components/Markdown";
import { api } from "../lib/api";
import { colors, radius, spacing } from "../theme/colors";

export default function ContentDetailScreen({ route, navigation }) {
  const { slug } = route.params;

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

  function share() {
    Share.share({ message: content?.title, url: content?.source?.url }).catch(() => {});
  }

  function goHome() {
    navigation.navigate("tabs", { screen: "beranda" });
  }

  function openContent(item) {
    navigation.push("kontenDetail", { slug: item.slug });
  }

  if (loading) return <Loading message="Memuat konten…" />;
  if (error || !content) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <Text style={styles.errorText}>{error || "Konten tidak ditemukan."}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backRow} onPress={goHome}>
            <Icon name="back" size={16} color={colors.tinta900} />
            <Text style={styles.backText}>Kembali ke Beranda</Text>
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.roundButton} onPress={share}>
              <Icon name="share" size={18} color={colors.tinta900} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.roundButton, saved && styles.roundButtonOn]} onPress={toggleSave}>
              <Icon name={saved ? "bookmarkFilled" : "bookmark"} size={18} color={saved ? colors.putih : colors.tinta900} />
            </TouchableOpacity>
          </View>
        </View>

        {content.type === "video" ? (
          <View style={styles.player}>
            <WebView
              source={{
                html: `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /><style>html,body{margin:0;padding:0;background:#000;height:100%;}iframe{position:absolute;top:0;left:0;width:100%;height:100%;border:0;}</style></head><body><iframe src="https://www.youtube.com/embed/${content.videoId}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></body></html>`,
                baseUrl: "https://www.youtube.com"
              }}
              originWhitelist={["*"]}
              javaScriptEnabled
              domStorageEnabled
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              allowsFullscreenVideo
              style={styles.playerWebview}
            />
          </View>
        ) : null}

        {content.type === "video" ? (
          <TouchableOpacity
            style={styles.youtubeFallback}
            onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${content.videoId}`)}
          >
            <Text style={styles.youtubeFallbackText}>Buka di YouTube</Text>
          </TouchableOpacity>
        ) : null}

        {content.type === "infographic" ? (
          <TouchableOpacity
            style={styles.infographicFrame}
            onPress={() => Linking.openURL(content.imageUrl)}
          >
            <Image source={{ uri: content.imageUrl }} style={styles.infographicImage} resizeMode="contain" />
            <View style={styles.enlargeBadge}>
              <Icon name="add" size={14} color={colors.tinta900} />
              <Text style={styles.enlargeText}>Perbesar</Text>
            </View>
          </TouchableOpacity>
        ) : null}

        {content.type === "article" ? (
          <Image source={{ uri: content.imageUrl }} style={styles.articleImage} />
        ) : null}

        <View style={[styles.badge, { backgroundColor: colors.hijau100 }]}>
          <Text style={[styles.badgeText, { color: colors.hijau700 }]}>{contentTypeLabel(content.type)}</Text>
        </View>
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.meta}>
          {categoryLabel(content.category)} · {content.readingMinutes} menit · {content.author}
        </Text>

        <Markdown text={content.body} />

        {content.source?.name ? (
          <TouchableOpacity style={styles.sourceBox} onPress={() => Linking.openURL(content.source.url)}>
            <Text style={styles.sourceLabel}>SUMBER</Text>
            <Text style={styles.sourceValue}>{content.source.name}</Text>
          </TouchableOpacity>
        ) : null}

        {related.length > 0 ? (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedHeading}>
              KONTEN LAIN DI {categoryLabel(content.category).toUpperCase()}
            </Text>
            {related.map((item) => (
              <TouchableOpacity key={item.slug} style={styles.relatedRow} onPress={() => openContent(item)}>
                <Image source={{ uri: item.imageUrl }} style={styles.relatedThumb} />
                <View style={styles.relatedInfo}>
                  <Text style={styles.relatedTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.relatedMeta}>{contentTypeLabel(item.type)} · {item.readingMinutes} menit</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.putih },
  scroll: { padding: spacing.s16, gap: spacing.s12, paddingBottom: spacing.s40 },
  errorText: { color: colors.bahaya, padding: spacing.s16 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.s8 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  backText: { fontSize: 13, fontWeight: "600", color: colors.tinta900 },
  topActions: { flexDirection: "row", gap: 8 },
  roundButton: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.garis,
    alignItems: "center",
    justifyContent: "center"
  },
  roundButtonOn: { backgroundColor: colors.hijau600, borderColor: colors.hijau600 },
  player: { aspectRatio: 16 / 9, borderRadius: radius.md, overflow: "hidden", backgroundColor: "#000" },
  playerWebview: { flex: 1 },
  youtubeFallback: { alignSelf: "flex-start", marginTop: 6 },
  youtubeFallbackText: { fontSize: 12, fontWeight: "600", color: colors.hijau700 },
  infographicFrame: { borderRadius: radius.md, overflow: "hidden", backgroundColor: colors.latar },
  infographicImage: { width: "100%", height: 420 },
  enlargeBadge: {
    position: "absolute",
    right: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.putih,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  enlargeText: { fontSize: 12, fontWeight: "600", color: colors.tinta900 },
  articleImage: { width: "100%", aspectRatio: 16 / 9, borderRadius: radius.md },
  badge: { alignSelf: "flex-start", borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 4, marginTop: spacing.s8 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  title: { fontSize: 24, fontWeight: "700", color: colors.tinta900, marginTop: 8 },
  meta: { fontSize: 12, color: colors.tinta400, marginBottom: spacing.s8 },
  sourceBox: { backgroundColor: colors.latar, borderRadius: radius.sm, padding: spacing.s12, gap: 2 },
  sourceLabel: { fontSize: 10, fontWeight: "700", color: colors.tinta400, letterSpacing: 0.5 },
  sourceValue: { fontSize: 14, fontWeight: "600", color: colors.hijau700 },
  relatedSection: { gap: spacing.s8, marginTop: spacing.s8 },
  relatedHeading: { fontSize: 11, fontWeight: "700", color: colors.tinta400, letterSpacing: 0.5, marginBottom: 4 },
  relatedRow: { flexDirection: "row", alignItems: "center", gap: spacing.s12 },
  relatedThumb: { width: 56, height: 56, borderRadius: radius.sm, backgroundColor: colors.garis },
  relatedInfo: { flex: 1, gap: 2 },
  relatedTitle: { fontSize: 13, fontWeight: "600", color: colors.tinta900 },
  relatedMeta: { fontSize: 11, color: colors.tinta400 }
});
