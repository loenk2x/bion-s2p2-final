// Favorit. Mirrors web/src/pages/Favorites.jsx: saved content that can be
// swiped left to reveal a delete panel behind the row, instead of a
// permanently visible trash button. Same numbers as the web version -
// REVEAL_WIDTH/OPEN_THRESHOLD/DIRECTION_LOCK below - so the gesture feels
// identical on both apps. Built with PanResponder + Animated (React Native
// core, no new native module) rather than react-native-gesture-handler,
// mirroring how web/src/pages/Favorites.jsx itself hand-rolls the touch
// listeners instead of pulling in a swipe library.

import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Animated, FlatList, Image, PanResponder, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { categoryLabel, contentTypeLabel } from "@shared/categories";
import Icon from "../components/Icon";
import Loading from "../components/Loading";
import { api } from "../lib/api";
import { colors, radius, spacing } from "../theme/colors";

// Matches web/src/pages/Favorites.jsx's REVEAL_WIDTH/OPEN_THRESHOLD/DIRECTION_LOCK
// (which in turn matches .geser-hapus's width in web/src/styles/komponen.css).
const REVEAL_WIDTH = 84;
const OPEN_THRESHOLD = REVEAL_WIDTH / 2;
const DIRECTION_LOCK = 8; // px of movement before a gesture commits to an axis

// One favorite row: a red delete panel underneath, and a white card on top
// that slides left via PanResponder to reveal it. `isOpen` is owned by the
// parent list (only one row open at a time); the row animates itself to
// match whenever that prop changes out from under it (e.g. another row was
// swiped open) and also drives the animation directly at the end of its own
// gesture, so the snap feels immediate either way.
function FavoriteRow({ item, isOpen, onOpenRow, onCloseRow, removing, onRemove, onNavigate }) {
  const translateX = useRef(new Animated.Value(isOpen ? -REVEAL_WIDTH : 0)).current;
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const dragRef = useRef({ base: 0, last: 0 });

  useEffect(() => {
    if (!isOpen) {
      Animated.timing(translateX, { toValue: 0, duration: 180, useNativeDriver: true }).start();
    }
  }, [isOpen, translateX]);

  const panResponder = useRef(
    PanResponder.create({
      // Let taps and vertical scrolling pass through untouched at the start.
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => false,
      // Capture phase runs before the row's own TouchableOpacity or the
      // FlatList's scroll responder get the move event, so this is the only
      // place a horizontal drag can be recognised and claimed. Direction is
      // decided once, after DIRECTION_LOCK px of movement - same rule as
      // web's touchmove handler.
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > DIRECTION_LOCK && Math.abs(dx) > Math.abs(dy);
      },
      onPanResponderGrant: () => {
        translateX.stopAnimation();
        const startedOpen = isOpenRef.current;
        dragRef.current = { base: startedOpen ? -REVEAL_WIDTH : 0, last: startedOpen ? -REVEAL_WIDTH : 0 };
        // Swiping this row closes whichever other row was open.
        onOpenRow(item.id);
      },
      onPanResponderMove: (evt, gestureState) => {
        const next = Math.min(0, Math.max(-REVEAL_WIDTH, dragRef.current.base + gestureState.dx));
        dragRef.current.last = next;
        translateX.setValue(next);
      },
      onPanResponderRelease: () => {
        const shouldOpen = dragRef.current.last <= -OPEN_THRESHOLD;
        Animated.timing(translateX, { toValue: shouldOpen ? -REVEAL_WIDTH : 0, duration: 180, useNativeDriver: true }).start();
        if (shouldOpen) onOpenRow(item.id); else onCloseRow(item.id);
      },
      onPanResponderTerminate: () => {
        Animated.timing(translateX, { toValue: 0, duration: 180, useNativeDriver: true }).start();
        onCloseRow(item.id);
      },
      // Once a horizontal drag is granted, keep it - don't let the scroll
      // view steal it back mid-gesture.
      onPanResponderTerminationRequest: () => false
    })
  ).current;

  function handlePress() {
    // A tap on an already-open row closes it instead of navigating away.
    if (isOpenRef.current) {
      Animated.timing(translateX, { toValue: 0, duration: 180, useNativeDriver: true }).start();
      onCloseRow(item.id);
      return;
    }
    onNavigate(item);
  }

  return (
    <View style={styles.rowOuter}>
      <TouchableOpacity
        style={styles.deletePanel}
        onPress={() => { if (!removing) onRemove(item); }}
        disabled={removing}
        accessibilityLabel="Hapus dari favorit"
      >
        <Icon name="trash" size={22} color={colors.putih} />
        <Text style={styles.deleteLabel}>Hapus</Text>
      </TouchableOpacity>
      <Animated.View style={[styles.row, { transform: [{ translateX }] }]} {...panResponder.panHandlers}>
        <TouchableOpacity style={styles.rowTouchable} activeOpacity={0.8} onPress={handlePress}>
          <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
          <View style={styles.info}>
            <Text style={styles.rowTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.meta}>
              {categoryLabel(item.category)} · {contentTypeLabel(item.type)} · {item.readingMinutes} menit
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState(null);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);
  const [openId, setOpenId] = useState(null);

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
      setOpenId((prev) => (prev === item.id ? null : prev));
    } catch (err) {
      setError(err.message || "Gagal menghapus favorit.");
    } finally {
      setRemovingId(null);
    }
  }

  function handleOpenRow(id) {
    setOpenId(id);
  }
  function handleCloseRow(id) {
    setOpenId((prev) => (prev === id ? null : prev));
  }
  function handleNavigate(item) {
    navigation.navigate("kontenDetail", { slug: item.slug });
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorit</Text>
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
            <FavoriteRow
              item={item}
              isOpen={openId === item.id}
              onOpenRow={handleOpenRow}
              onCloseRow={handleCloseRow}
              removing={removingId === item.id}
              onRemove={remove}
              onNavigate={handleNavigate}
            />
          )}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.putih },
  header: { paddingHorizontal: spacing.s16, paddingTop: spacing.s8, paddingBottom: spacing.s16 },
  title: { fontSize: 22, fontWeight: "700", color: colors.tinta900 },
  errorText: { color: colors.bahaya, marginBottom: spacing.s12 },
  list: { paddingHorizontal: spacing.s16, paddingBottom: spacing.s24, gap: spacing.s12 },
  rowOuter: {
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: colors.bahaya
  },
  deletePanel: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: REVEAL_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    gap: 4
  },
  deleteLabel: { color: colors.putih, fontSize: 11, fontWeight: "600" },
  row: {
    backgroundColor: colors.putih,
    borderWidth: 1,
    borderColor: colors.garis,
    borderRadius: radius.md
  },
  rowTouchable: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.s12,
    padding: spacing.s8
  },
  thumb: { width: 56, height: 56, borderRadius: radius.sm, backgroundColor: colors.garis },
  info: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 14, fontWeight: "600", color: colors.tinta900 },
  meta: { fontSize: 11, color: colors.tinta400 },
  empty: { alignItems: "center", paddingVertical: spacing.s40, gap: 6 },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: colors.tinta900 },
  emptyText: { fontSize: 13, color: colors.tinta600, textAlign: "center", paddingHorizontal: spacing.s32 }
});
