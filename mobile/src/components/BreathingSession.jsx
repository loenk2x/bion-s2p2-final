// React Native twin of web/src/components/BreathingSession.jsx. Guided
// breathing session opened from AddEntryModal once a duration is picked.
// Saves the entry itself once the mood step is resolved (mood chosen or
// skipped) - mood is a field on the breathing entry, not a separate
// activity type. The server rejects a mood on any other type.

import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MOODS } from "@shared/activities";
import Icon from "./Icon";
import { api } from "../lib/api";
import { colors, radius, spacing } from "../theme/colors";

const PHASES = [
  { key: "in", label: "Tarik napas", seconds: 4 },
  { key: "out", label: "Buang napas", seconds: 4 }
];

const pad = (n) => String(n).padStart(2, "0");

export default function BreathingSession({ duration, onClose, onFinished }) {
  const totalSeconds = duration * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [step, setStep] = useState("running"); // "running" | "mood"
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseCount, setPhaseCount] = useState(PHASES[0].seconds);
  const [mood, setMood] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (step !== "running") return undefined;
    if (remaining <= 0) {
      setStep("mood");
      return undefined;
    }
    const timer = setTimeout(() => {
      setRemaining((value) => value - 1);
      setPhaseCount((value) => {
        if (value > 1) return value - 1;
        setPhaseIndex((index) => (index + 1) % PHASES.length);
        return PHASES[(phaseIndex + 1) % PHASES.length].seconds;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [remaining, step, phaseIndex]);

  async function finish(chosenMood) {
    if (saving) return;
    setSaving(true);
    try {
      await api.addEntry({ type: "breathing", value: duration, mood: chosenMood || undefined });
      onFinished();
    } finally {
      setSaving(false);
    }
  }

  if (step === "mood") {
    return (
      <View style={styles.moodWrap}>
        <View style={styles.moodIconWrap}>
          <Icon name="breathing" size={26} color={colors.hijau600} />
        </View>
        <Text style={styles.moodTitle}>Sesi selesai</Text>
        <Text style={styles.moodSubtitle}>{duration} menit latihan pernapasan tercatat.</Text>

        <Text style={styles.moodLabel}>Bagaimana perasaan Anda sekarang?</Text>
        <View style={styles.moodRow}>
          {MOODS.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[styles.moodButton, mood === item.value && styles.moodButtonOn]}
              onPress={() => setMood(item.value)}
            >
              <Text style={styles.moodEmoji}>{item.emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, (!mood || saving) && styles.disabled]}
          disabled={!mood || saving}
          onPress={() => finish(mood)}
        >
          <Text style={styles.primaryButtonText}>Simpan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.textButton} disabled={saving} onPress={() => finish(null)}>
          <Text style={styles.textButtonText}>Lewati pencatatan mood</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const phase = PHASES[phaseIndex];
  const progressPercent = Math.min(100, Math.round(((totalSeconds - remaining) / totalSeconds) * 100));
  const minutesLeft = Math.floor(remaining / 60);
  const secondsLeft = remaining % 60;

  return (
    <View style={styles.sessionWrap}>
      <View style={styles.sessionTop}>
        <Text style={styles.sessionTopText}>Latihan pernapasan</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Icon name="close" size={18} color={colors.putih} />
        </TouchableOpacity>
      </View>

      <View style={styles.sessionCenter}>
        <View style={styles.ringWrap}>
          <View style={[styles.ring, { width: 260, height: 260, opacity: 0.14 }]} />
          <View style={[styles.ring, { width: 210, height: 210, opacity: 0.22 }]} />
          <View style={[styles.ring, { width: 160, height: 160, opacity: 0.34 }]} />
          <View style={styles.ringCore}>
            <Text style={styles.phaseLabel}>{phase.label}</Text>
            <Text style={styles.phaseCount}>{phaseCount}</Text>
          </View>
        </View>
        <Text style={styles.sessionHint}>Ikuti lingkarannya. Tarik napas saat membesar, buang napas saat mengecil.</Text>
      </View>

      <View style={styles.sessionBottom}>
        <View style={styles.track}>
          <View style={[styles.trackFill, { width: `${progressPercent}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeMuted}>Sesi {duration} menit</Text>
          <Text style={styles.timeValue}>{pad(minutesLeft)}.{pad(secondsLeft)} tersisa</Text>
        </View>
        <TouchableOpacity style={styles.endEarlyButton} onPress={() => setStep("mood")}>
          <Text style={styles.endEarlyText}>Selesai lebih awal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sessionWrap: { flex: 1, backgroundColor: colors.tinta900, padding: spacing.s20, justifyContent: "space-between" },
  sessionTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  sessionTopText: { color: colors.putih, fontWeight: "600", fontSize: 15 },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center"
  },
  sessionCenter: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.s24 },
  ringWrap: { alignItems: "center", justifyContent: "center", width: 260, height: 260 },
  ring: { position: "absolute", borderRadius: 999, backgroundColor: colors.hijau500 },
  ringCore: { alignItems: "center", gap: 4 },
  phaseLabel: { color: colors.putih, fontSize: 14, fontWeight: "600", opacity: 0.85 },
  phaseCount: { color: colors.putih, fontSize: 46, fontWeight: "700" },
  sessionHint: { color: "rgba(255,255,255,0.7)", fontSize: 13, textAlign: "center", paddingHorizontal: spacing.s24 },
  sessionBottom: { gap: spacing.s12 },
  track: { height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.15)", overflow: "hidden" },
  trackFill: { height: 6, borderRadius: 3, backgroundColor: colors.hijau500 },
  timeRow: { flexDirection: "row", justifyContent: "space-between" },
  timeMuted: { color: "rgba(255,255,255,0.6)", fontSize: 12 },
  timeValue: { color: colors.putih, fontSize: 12, fontWeight: "600" },
  endEarlyButton: { alignItems: "center", paddingVertical: 14, borderRadius: radius.sm, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  endEarlyText: { color: colors.putih, fontWeight: "600", fontSize: 14 },

  moodWrap: { flex: 1, backgroundColor: colors.putih, padding: spacing.s24, alignItems: "center", paddingTop: spacing.s48 },
  moodIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.hijau50,
    borderWidth: 1,
    borderColor: colors.hijau100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.s12
  },
  moodTitle: { fontSize: 20, fontWeight: "700", color: colors.tinta900 },
  moodSubtitle: { fontSize: 13, color: colors.tinta600, marginTop: 2, marginBottom: spacing.s24 },
  moodLabel: { fontSize: 13, fontWeight: "600", color: colors.tinta900, alignSelf: "flex-start", marginBottom: spacing.s12 },
  moodRow: { flexDirection: "row", gap: spacing.s12, marginBottom: spacing.s24 },
  moodButton: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.garis,
    alignItems: "center",
    justifyContent: "center"
  },
  moodButtonOn: { borderColor: colors.hijau600, backgroundColor: colors.hijau50 },
  moodEmoji: { fontSize: 24 },
  primaryButton: { width: "100%", backgroundColor: colors.hijau600, borderRadius: radius.sm, paddingVertical: 14, alignItems: "center", marginBottom: spacing.s8 },
  disabled: { opacity: 0.5 },
  primaryButtonText: { color: colors.putih, fontWeight: "700", fontSize: 15 },
  textButton: { paddingVertical: 10 },
  textButtonText: { color: colors.tinta600, fontSize: 13, fontWeight: "600" }
});
