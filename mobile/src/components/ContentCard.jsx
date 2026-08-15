// React Native twin of web/src/components/ContentCard.jsx. Same optimistic
// save/unsave behaviour: the card flips immediately, the request follows,
// and a failed request reverts the flip.

import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CONTENT_TYPES, contentTypeLabel, contentCardMeta } from "@shared/categories";
import Icon from "./Icon";
import { api } from "../lib/api";
import { colors, radius, spacing } from "../theme/colors";

const BADGE_COLORS = {
  article: { text: colors.lenArtikelTeks, bg: colors.lenArtikelLatar },
  video: { text: colors.lenVideoTeks, bg: colors.lenVideoLatar },
  infographic: { text: colors.lenInfografisTeks, bg: colors.lenInfografisLatar }
};

export default function ContentCard({ content, onPress, onToggleFavorite, style }) {
  const [saved, setSaved] = useState(content.disimpan);
  const [busy, setBusy] = useState(false);
  const badge = BADGE_COLORS[content.type] || BADGE_COLORS.article;

  async function toggleSave() {
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
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cover}>
        <Image source={{ uri: content.imageUrl }} style={styles.image} />
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.text }]}>{contentTypeLabel(content.type)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.saveButton, saved && styles.saveButtonOn]}
          onPress={toggleSave}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Icon name={saved ? "bookmarkFilled" : "bookmark"} size={16} color={saved ? colors.putih : colors.tinta900} />
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{content.title}</Text>
        <Text style={styles.excerpt} numberOfLines={2}>{content.excerpt}</Text>
        <Text style={styles.meta}>{contentCardMeta(content)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.putih,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.garis,
    overflow: "hidden"
  },
  cover: { aspectRatio: 4 / 3, backgroundColor: colors.garis },
  image: { width: "100%", height: "100%" },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3
  },
  badgeText: { fontSize: 10, fontWeight: "700" },
  saveButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center"
  },
  saveButtonOn: { backgroundColor: colors.hijau600 },
  body: { padding: spacing.s12, gap: 4 },
  title: { fontSize: 13, fontWeight: "700", color: colors.tinta900 },
  excerpt: { fontSize: 12, color: colors.tinta600 },
  meta: { fontSize: 11, color: colors.tinta400, marginTop: 2 }
});
