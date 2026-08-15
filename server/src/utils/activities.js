// The single place where activity types are defined.
// Their label, unit, and target are shared by validation, aggregation, and the feeder.

// Each type carries its own validation rules:
//   isDecimal     — allowed to be fractional, or must be a whole number
//   allowedValues — if present, the value must be one of this list
//   hasMood       — only this type may include a mood
//   cara          — how a day's number is computed when aggregated
const ACTIVITIES = {
  steps:     { label: "Langkah",            unit: "langkah", isDecimal: false, cara: "jumlah" },
  exercise:  { label: "Olahraga",           unit: "menit",   isDecimal: false, cara: "jumlah" },
  water:     { label: "Air minum",          unit: "gelas",   isDecimal: false, cara: "jumlah" },
  sleep:     { label: "Tidur",              unit: "jam",     isDecimal: true,  cara: "terakhir" },
  breathing: { label: "Latihan pernapasan", unit: "menit",   isDecimal: false, cara: "jumlah",
               allowedValues: [1, 3, 5], hasMood: true },
  weight:    { label: "Berat badan",        unit: "kg",      isDecimal: true,  cara: "terakhir" }
};

const ACTIVITY_TYPES = Object.keys(ACTIVITIES);

const BREATHING_SESSION_MINUTES = ACTIVITIES.breathing.allowedValues;

const DAILY_TARGETS = {
  gerak: 10000,     // langkah
  tidur: 8,         // jam
  relaksasi: 3      // sesi
};

const MOOD_LABELS = {
  1: "Buruk",
  2: "Kurang",
  3: "Biasa saja",
  4: "Senang"
};

// Local date as YYYY-MM-DD, used as the grouping key.
function dateKey(waktu = new Date()) {
  const d = new Date(waktu);
  const bulan = String(d.getMonth() + 1).padStart(2, "0");
  const hari = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${bulan}-${hari}`;
}

function daysAgo(jumlahHari) {
  const d = new Date();
  d.setDate(d.getDate() - jumlahHari);
  return d;
}

// Single validation gate for the value, for every activity type. Used both when
// creating and editing an entry, so the rules never differ between the two.
// Returns { value } on success, or { pesan } when rejected.
function validateValue(type, nilaiMentah) {
  const info = ACTIVITIES[type];
  if (!info) return { pesan: `Jenis catatan harus salah satu dari: ${ACTIVITY_TYPES.join(", ")}.` };

  const value = Number(nilaiMentah);
  if (!Number.isFinite(value) || value < 0) {
    return { pesan: "Nilai catatan harus angka nol atau lebih." };
  }
  if (!info.isDecimal && !Number.isInteger(value)) {
    return { pesan: `${info.label} harus berupa angka bulat.` };
  }
  if (info.allowedValues && !info.allowedValues.includes(value)) {
    return { pesan: `${info.label} hanya menerima nilai ${info.allowedValues.join(", ")} ${info.unit}.` };
  }
  return { value };
}

// Mood may only attach to the activity type that actually asks for it at the end
// of a session.
function validateMood(type, mood) {
  if (mood === undefined || mood === null) return { mood: null };
  if (!ACTIVITIES[type] || !ACTIVITIES[type].hasMood) {
    return { pesan: `Mood hanya dicatat pada ${ACTIVITIES.breathing.label}, tidak pada jenis lain.` };
  }
  const angka = Number(mood);
  if (![1, 2, 3, 4].includes(angka)) {
    return { pesan: "Mood harus angka 1 sampai 4, atau dikosongkan." };
  }
  return { mood: angka };
}

module.exports = {
  ACTIVITIES,
  ACTIVITY_TYPES,
  BREATHING_SESSION_MINUTES,
  validateValue,
  validateMood,
  DAILY_TARGETS,
  MOOD_LABELS,
  dateKey,
  daysAgo
};
