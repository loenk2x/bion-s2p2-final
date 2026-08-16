// React Native twin of web/src/components/AddEntryModal.jsx. Same flow: pick
// a type -> enter a value (or, for breathing, pick a duration and hand off
// to BreathingSession) -> save.
//
// keypadFor(type) from @shared/activities returns "decimal" or "integer" -
// web maps that to inputMode, this maps it to React Native's keyboardType
// ("decimal-pad" / "number-pad"). That mapping is platform presentation, so
// it lives here rather than in shared/activities.js.

import { useEffect, useRef, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import {
  ACTIVITIES,
  ADD_MENU_ORDER,
  BREATHING_DURATIONS,
  keypadFor,
  validateValue
} from "@shared/activities";
import { formatInteger, formatLongDate, formatTime } from "@shared/format";
import { activityColorHex } from "@shared/activityColors";
import Icon, { ACTIVITY_ICONS } from "./Icon";
import BreathingSession from "./BreathingSession";
import { api } from "../lib/api";
import { colors, radius, spacing } from "../theme/colors";

const KEYBOARD_TYPES = { decimal: "decimal-pad", integer: "number-pad" };

export default function AddEntryModal({ visible, onClose, onSaved }) {
  const [step, setStep] = useState("menu"); // menu | value | duration | session
  const [type, setType] = useState(null);
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [duration, setDuration] = useState(BREATHING_DURATIONS[0]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [openedAt, setOpenedAt] = useState(() => new Date());
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setStep("menu");
      setType(null);
      setValue("");
      setNote("");
      setError("");
      setOpenedAt(new Date());
    }
  }, [visible]);

  useEffect(() => {
    if (step === "value" && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [step]);

  function pickType(nextType) {
    setType(nextType);
    setValue("");
    setNote("");
    setError("");
    setStep(nextType === "breathing" ? "duration" : "value");
  }

  function handleValueChange(raw) {
    const decimal = keypadFor(type) === "decimal";
    const pattern = decimal ? /^[0-9]*[.,]?[0-9]*$/ : /^[0-9]*$/;
    if (pattern.test(raw)) setValue(raw);
  }

  async function submitValue() {
    const result = validateValue(type, value);
    if (result.message) {
      setError(result.message);
      return;
    }
    setSaving(true);
    setError("");
    try {
      await api.addEntry({ type, value: result.value, note: note.trim() || undefined });
      onSaved();
    } catch (err) {
      setError(err.message || "Catatan gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  if (!visible) return null;

  if (step === "session") {
    return (
      <Modal visible animationType="slide" onRequestClose={onClose} statusBarTranslucent>
        <BreathingSession duration={duration} onClose={onClose} onFinished={onSaved} />
      </Modal>
    );
  }

  const activity = type ? ACTIVITIES[type] : null;
  const color = type ? activityColorHex(type) : activityColorHex("steps");

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          {step === "menu" ? (
            <ScrollView>
              <Text style={styles.title}>Tambah catatan</Text>
              <Text style={styles.subtitle}>Pilih jenis aktivitas yang ingin dicatat.</Text>
              <View style={styles.menuList}>
                {ADD_MENU_ORDER.map((menuType) => {
                  const menuColor = activityColorHex(menuType);
                  return (
                    <TouchableOpacity key={menuType} style={styles.menuRow} onPress={() => pickType(menuType)}>
                      <View style={[styles.menuIcon, { borderColor: menuColor, backgroundColor: `${menuColor}1F` }]}>
                        <Icon name={ACTIVITY_ICONS[menuType]} size={18} color={menuColor} />
                      </View>
                      <Text style={styles.menuLabel}>{ACTIVITIES[menuType].label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          ) : null}

          {step === "value" && activity ? (
            <ScrollView>
              <View style={styles.valueHeader}>
                <View style={[styles.menuIcon, { borderColor: color, backgroundColor: `${color}1F` }]}>
                  <Icon name={ACTIVITY_ICONS[type]} size={20} color={color} />
                </View>
                <View>
                  <Text style={styles.title}>{activity.label}</Text>
                  <Text style={styles.timestamp}>{formatLongDate(openedAt)} · {formatTime(openedAt)}</Text>
                </View>
              </View>

              <View style={styles.valueInputRow}>
                <TextInput
                  ref={inputRef}
                  style={styles.valueInput}
                  keyboardType={KEYBOARD_TYPES[keypadFor(type)]}
                  value={value}
                  onChangeText={handleValueChange}
                  placeholder="0"
                  placeholderTextColor={colors.tinta400}
                />
                <Text style={styles.valueUnit}>{activity.unit}</Text>
              </View>

              {activity.quickAdd ? (
                <View style={styles.quickAddRow}>
                  {activity.quickAdd.map((amount) => (
                    <TouchableOpacity key={amount} style={styles.quickAddChip} onPress={() => setValue(String(amount))}>
                      <Text style={styles.quickAddText}>{formatInteger(amount)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.noteField}>
                <Text style={styles.noteLabel}>Catatan, opsional</Text>
                <TextInput
                  style={styles.noteInput}
                  value={note}
                  onChangeText={setNote}
                  placeholder="Ceritakan sedikit, kalau perlu"
                  placeholderTextColor={colors.tinta400}
                />
              </View>

              <TouchableOpacity style={[styles.primaryButton, saving && styles.disabled]} disabled={saving} onPress={submitValue}>
                <Text style={styles.primaryButtonText}>{saving ? "Menyimpan…" : "Simpan"}</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : null}

          {step === "duration" && activity ? (
            <View>
              <Text style={styles.title}>{activity.label}</Text>
              <Text style={styles.subtitle}>Pilih lama sesi latihan pernapasan.</Text>
              <View style={styles.durationRow}>
                {BREATHING_DURATIONS.map((minutes) => (
                  <TouchableOpacity
                    key={minutes}
                    style={[styles.durationChip, duration === minutes && styles.durationChipOn]}
                    onPress={() => setDuration(minutes)}
                  >
                    <Text style={[styles.durationValue, duration === minutes && styles.durationValueOn]}>{minutes}</Text>
                    <Text style={[styles.durationUnit, duration === minutes && styles.durationValueOn]}>menit</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.primaryButton} onPress={() => setStep("session")}>
                <Text style={styles.primaryButtonText}>Mulai sesi</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(18,33,27,0.4)" },
  sheet: {
    backgroundColor: colors.putih,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.s20,
    maxHeight: "85%"
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.garis, alignSelf: "center", marginBottom: spacing.s16 },
  title: { fontSize: 18, fontWeight: "700", color: colors.tinta900 },
  subtitle: { fontSize: 13, color: colors.tinta600, marginTop: 4, marginBottom: spacing.s16 },
  menuList: { gap: spacing.s8 },
  menuRow: { flexDirection: "row", alignItems: "center", gap: spacing.s12, paddingVertical: spacing.s8 },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  menuLabel: { fontSize: 15, fontWeight: "600", color: colors.tinta900 },
  valueHeader: { flexDirection: "row", alignItems: "center", gap: spacing.s12, marginBottom: spacing.s12 },
  timestamp: { fontSize: 12, color: colors.tinta600, marginTop: 2 },
  valueInputRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    gap: 8,
    paddingVertical: spacing.s24
  },
  valueInput: { fontSize: 44, fontWeight: "700", color: colors.tinta900, minWidth: 80, textAlign: "right" },
  valueUnit: { fontSize: 16, color: colors.tinta600 },
  quickAddRow: { flexDirection: "row", gap: spacing.s8, justifyContent: "center", marginBottom: spacing.s16 },
  quickAddChip: { borderWidth: 1, borderColor: colors.garis, borderRadius: radius.full, paddingHorizontal: 16, paddingVertical: 8 },
  quickAddText: { fontSize: 13, fontWeight: "600", color: colors.tinta900 },
  errorText: { color: colors.bahaya, fontSize: 13, marginBottom: spacing.s8, textAlign: "center" },
  noteField: { marginBottom: spacing.s16 },
  noteLabel: { fontSize: 13, fontWeight: "600", color: colors.tinta900, marginBottom: 6 },
  noteInput: {
    borderWidth: 1,
    borderColor: colors.garis,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.tinta900
  },
  primaryButton: { backgroundColor: colors.hijau600, borderRadius: radius.sm, paddingVertical: 14, alignItems: "center" },
  disabled: { opacity: 0.6 },
  primaryButtonText: { color: colors.putih, fontWeight: "700", fontSize: 15 },
  durationRow: { flexDirection: "row", gap: spacing.s12, marginBottom: spacing.s20 },
  durationChip: {
    flex: 1,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.garis,
    borderRadius: radius.sm,
    paddingVertical: 14
  },
  durationChipOn: { borderColor: colors.hijau600, backgroundColor: colors.hijau50 },
  durationValue: { fontSize: 20, fontWeight: "700", color: colors.tinta900 },
  durationUnit: { fontSize: 11, color: colors.tinta600 },
  durationValueOn: { color: colors.hijau700 }
});
