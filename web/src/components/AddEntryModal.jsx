// Opened from the "Tambah catatan" button in the header and from the FAB.
// Walks through: pick a type -> enter a value (or, for breathing, pick a
// duration and hand off to BreathingSession) -> save.

import { useEffect, useRef, useState } from "react";
import {
  ACTIVITIES,
  ADD_MENU_ORDER,
  BREATHING_DURATIONS,
  keypadFor,
  validateValue
} from "@shared/activities";
import { formatInteger, formatLongDate, formatTime } from "@shared/format";
import Icon, { ACTIVITY_ICONS } from "./Icon";
import BreathingSession from "./BreathingSession";
import { activityColorVar } from "../lib/activityColors";
import { notifyEntryAdded } from "../lib/entryEvents";
import { api } from "../lib/api";

export default function AddEntryModal({ onClose, onSaved }) {
  const [step, setStep] = useState("menu"); // menu | value | duration | session
  const [type, setType] = useState(null);
  const [value, setValue] = useState("");
  const [note, setNote] = useState("");
  const [duration, setDuration] = useState(BREATHING_DURATIONS[0]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);
  const [openedAt] = useState(() => new Date());

  useEffect(() => {
    if (step === "value" && inputRef.current) inputRef.current.focus();
  }, [step]);

  function pickType(nextType) {
    setType(nextType);
    setValue("");
    setNote("");
    setError("");
    setStep(nextType === "breathing" ? "duration" : "value");
  }

  function handleValueChange(event) {
    const raw = event.target.value;
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
      notifyEntryAdded();
      onSaved();
    } catch (err) {
      setError(err.message || "Catatan gagal disimpan.");
    } finally {
      setSaving(false);
    }
  }

  if (step === "session") {
    return (
      <BreathingSession
        duration={duration}
        onClose={onClose}
        onFinished={onSaved}
      />
    );
  }

  const activity = type ? ACTIVITIES[type] : null;
  const colorVar = type ? activityColorVar(type) : "--ak-langkah";

  return (
    <div className="lembar-lapis">
      <div className="tirai" onClick={onClose} />
      <div className="lembar" role="dialog" aria-modal="true">
        <div className="pegangan" />

        {step === "menu" && (
          <>
            <h3>Tambah catatan</h3>
            <p className="sub">Pilih jenis aktivitas yang ingin dicatat.</p>
            <div className="kolom">
              {ADD_MENU_ORDER.map((menuType) => (
                <button
                  key={menuType}
                  type="button"
                  className="baris-tombol"
                  onClick={() => pickType(menuType)}
                >
                  <span
                    className="ikon-bulat"
                    style={{
                      color: `var(${activityColorVar(menuType)})`,
                      background: `color-mix(in srgb, var(${activityColorVar(menuType)}) 12%, var(--putih))`,
                      borderColor: `color-mix(in srgb, var(${activityColorVar(menuType)}) 30%, var(--putih))`
                    }}
                  >
                    <Icon name={ACTIVITY_ICONS[menuType]} size={20} />
                  </span>
                  <span className="judul-2">{ACTIVITIES[menuType].label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "value" && activity && (
          <>
            <div className="baris" style={{ gap: 10, marginBottom: 6 }}>
              <span
                className="ikon-bulat"
                style={{
                  color: `var(${colorVar})`,
                  background: `color-mix(in srgb, var(${colorVar}) 12%, var(--putih))`,
                  borderColor: `color-mix(in srgb, var(${colorVar}) 30%, var(--putih))`
                }}
              >
                <Icon name={ACTIVITY_ICONS[type]} size={22} />
              </span>
              <div>
                <h3>{activity.label}</h3>
                <p className="sub" style={{ margin: 0 }}>{formatLongDate(openedAt)} · {formatTime(openedAt)}</p>
              </div>
            </div>

            <div className="angka-inp">
              <input
                ref={inputRef}
                type="text"
                inputMode={keypadFor(type) === "decimal" ? "decimal" : "numeric"}
                value={value}
                onChange={handleValueChange}
                placeholder="0"
                aria-label={`Nilai ${activity.label}`}
              />
              <span>{activity.unit}</span>
            </div>

            {activity.quickAdd && (
              <div className="pintasan">
                {activity.quickAdd.map((amount) => (
                  <span key={amount} role="button" tabIndex={0} onClick={() => setValue(String(amount))}>
                    {formatInteger(amount)}
                  </span>
                ))}
              </div>
            )}

            {error && <p className="pesan-galat">{error}</p>}

            <div className="kolom" style={{ marginBottom: 14 }}>
              <span className="inp-label">Catatan, opsional</span>
              <input
                className="inp"
                type="text"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Ceritakan sedikit, kalau perlu"
              />
            </div>

            <button type="button" className="tombol t-primer t-blok" disabled={saving} onClick={submitValue}>
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          </>
        )}

        {step === "duration" && activity && (
          <>
            <h3>{activity.label}</h3>
            <p className="sub">Pilih lama sesi latihan pernapasan.</p>
            <div className="durasi">
              {BREATHING_DURATIONS.map((minutes) => (
                <span
                  key={minutes}
                  className={duration === minutes ? "on" : undefined}
                  role="button"
                  tabIndex={0}
                  onClick={() => setDuration(minutes)}
                >
                  {minutes}
                  <i>menit</i>
                </span>
              ))}
            </div>
            <button type="button" className="tombol t-primer t-blok" onClick={() => setStep("session")}>
              Mulai sesi
            </button>
          </>
        )}
      </div>
    </div>
  );
}
