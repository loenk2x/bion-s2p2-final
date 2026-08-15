// Full-screen guided breathing session, opened from AddEntryModal once a
// duration has been picked. Saves the entry itself once the mood step is
// resolved (either a mood is chosen or the user skips it).

import { useEffect, useState } from "react";
import { MOODS } from "@shared/activities";
import Icon from "./Icon";
import { api } from "../lib/api";
import { notifyEntryAdded } from "../lib/entryEvents";

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
      notifyEntryAdded();
      onFinished();
    } finally {
      setSaving(false);
    }
  }

  if (step === "mood") {
    return (
      <div className="lembar-lapis">
        <div className="tirai" />
        <div className="lembar">
          <div className="pegangan" />
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <span className="ikon-bulat" style={{ width: 56, height: 56, color: "var(--ak-napas)", borderColor: "var(--hijau-100)", background: "var(--hijau-50)", margin: "0 auto" }}>
              <Icon name="breathing" size={28} />
            </span>
            <h3 style={{ font: "700 22px/28px var(--font)", margin: "12px 0 2px" }}>Sesi selesai</h3>
            <p className="sub" style={{ margin: 0 }}>{duration} menit latihan pernapasan tercatat.</p>
          </div>
          <span className="inp-label">Bagaimana perasaan Anda sekarang?</span>
          <div className="mood" style={{ marginBottom: 16 }}>
            {MOODS.map((item) => (
              <a
                key={item.value}
                className={mood === item.value ? "on" : undefined}
                onClick={() => setMood(item.value)}
              >
                {item.emoji}
              </a>
            ))}
          </div>
          <button
            type="button"
            className="tombol t-primer t-blok"
            style={{ marginBottom: 10 }}
            disabled={!mood || saving}
            onClick={() => finish(mood)}
          >
            Simpan
          </button>
          <button type="button" className="tombol t-teks t-blok" disabled={saving} onClick={() => finish(null)}>
            Lewati pencatatan mood
          </button>
        </div>
      </div>
    );
  }

  const phase = PHASES[phaseIndex];
  const progressPercent = Math.min(100, Math.round(((totalSeconds - remaining) / totalSeconds) * 100));
  const minutesLeft = Math.floor(remaining / 60);
  const secondsLeft = remaining % 60;

  return (
    <div className="sesi-napas">
      <div className="atas">
        <span style={{ font: "600 15px/20px var(--font)" }}>Latihan pernapasan</span>
        <span className="ikon-bulat" role="button" tabIndex={0} aria-label="Tutup" onClick={onClose}>
          <Icon name="close" size={18} />
        </span>
      </div>
      <div className="tengah">
        <div className="napas-bungkus">
          <span className="napas-cincin" style={{ width: 260, height: 260, opacity: 0.14 }} />
          <span className="napas-cincin" style={{ width: 210, height: 210, opacity: 0.22 }} />
          <span className="napas-cincin" style={{ width: 160, height: 160, opacity: 0.34 }} />
          <div className="napas-inti">
            <span style={{ font: "600 14px/18px var(--font)", opacity: 0.85 }}>{phase.label}</span>
            <span style={{ font: "700 46px/52px var(--font)" }}>{phaseCount}</span>
          </div>
        </div>
        <p className="ket">Ikuti lingkarannya. Tarik napas saat membesar, buang napas saat mengecil.</p>
      </div>
      <div className="bawah">
        <div className="trek"><i style={{ width: `${progressPercent}%` }} /></div>
        <div className="waktu">
          <span className="redup">Sesi {duration} menit</span>
          <span>{pad(minutesLeft)}.{pad(secondsLeft)} tersisa</span>
        </div>
        <button type="button" className="tombol t-blok" style={{ marginTop: 18 }} onClick={() => setStep("mood")}>
          Selesai lebih awal
        </button>
      </div>
    </div>
  );
}
