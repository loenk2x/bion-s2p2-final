// React Native twin of web/src/components/ActivityCard.jsx. `entry` is one
// item from the `catatan` array returned by GET /api/logs (see
// shared/api.js / api.entries).

import { StyleSheet, Text, View } from "react-native";
import { ACTIVITIES, moodByValue } from "@shared/activities";
import { formatActivityValue, formatTime } from "@shared/format";
import { activityColorHex } from "@shared/activityColors";
import Icon, { ACTIVITY_ICONS } from "./Icon";
import { colors, radius, spacing } from "../theme/colors";

export default function ActivityCard({ entry }) {
  const activity = ACTIVITIES[entry.type];
  const color = activityColorHex(entry.type);
  const mood = entry.type === "breathing" ? moodByValue(entry.mood) : null;

  return (
    <View style={styles.card}>
      <View style={[styles.cap, { backgroundColor: color }]} />
      <View style={styles.watermark}>
        <Icon name={ACTIVITY_ICONS[entry.type]} size={72} color={color} />
      </View>
      <Text style={styles.time}>{formatTime(entry.loggedAt)}</Text>
      <Text style={styles.value}>
        {formatActivityValue(entry.value, activity?.decimal)} <Text style={styles.unit}>{entry.satuan}</Text>
      </Text>
      <Text style={[styles.type, { color }]}>{entry.namaJenis}</Text>
      {mood ? (
        <Text style={styles.note}>Perasaan setelah sesi: {mood.emoji} {mood.label}</Text>
      ) : entry.note ? (
        <Text style={styles.note}>{entry.note}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: colors.putih,
    borderWidth: 1,
    borderColor: colors.garis,
    borderRadius: radius.md,
    padding: spacing.s12,
    overflow: "hidden"
  },
  cap: { position: "absolute", top: 0, left: 0, right: 0, height: 4 },
  watermark: { position: "absolute", right: -6, bottom: -6, opacity: 0.12 },
  time: { fontSize: 11, color: colors.tinta400, marginTop: spacing.s4 },
  value: { fontSize: 20, fontWeight: "700", color: colors.tinta900, marginTop: 4 },
  unit: { fontSize: 12, fontWeight: "400", color: colors.tinta400 },
  type: { fontSize: 12, fontWeight: "700", marginTop: 2 },
  note: { fontSize: 12, color: colors.tinta600, marginTop: 6 }
});
