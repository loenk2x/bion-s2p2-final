// Mirrors server/src/utils/aktivitas.js. Shared by the web and mobile apps.
// If a rule changes on the server, it must change here too.
//
// Note on language: identifiers and comments are English; user-facing strings
// stay Indonesian because the app's interface language is Indonesian.

export const ACTIVITIES = {
  steps: {
    label: "Langkah", unit: "langkah", decimal: false,
    quickAdd: [500, 1000, 2000]
  },
  exercise: {
    label: "Olahraga", unit: "menit", decimal: false,
    quickAdd: [5, 15, 30]
  },
  water: {
    label: "Air minum", unit: "gelas", decimal: false
  },
  sleep: {
    label: "Tidur", unit: "jam", decimal: true
  },
  breathing: {
    label: "Latihan pernapasan", unit: "menit", decimal: false,
    allowedValues: [1, 3, 5], usesMood: true
  },
  weight: {
    label: "Berat badan", unit: "kg", decimal: true
  }
};

export const ACTIVITY_TYPES = Object.keys(ACTIVITIES);

// Order shown in the add-entry menu, top to bottom.
export const ADD_MENU_ORDER = ["steps", "exercise", "water", "sleep", "breathing", "weight"];

export const BREATHING_DURATIONS = ACTIVITIES.breathing.allowedValues;

export const MOODS = [
  { value: 1, emoji: "😞", label: "Buruk" },
  { value: 2, emoji: "😐", label: "Kurang" },
  { value: 3, emoji: "🙂", label: "Biasa saja" },
  { value: 4, emoji: "😄", label: "Senang" }
];

export const moodByValue = (value) => MOODS.find((m) => m.value === value) || null;

// Which numeric keypad to show. Web maps this to inputMode, mobile to keyboardType.
export const keypadFor = (type) => (ACTIVITIES[type]?.decimal ? "decimal" : "integer");

// Client-side validation, deliberately identical to the server's so the user does
// not have to wait for a round trip to learn the value is wrong.
// Returns { value } when accepted, or { message } when rejected.
export function validateValue(type, rawValue) {
  const activity = ACTIVITIES[type];
  if (!activity) return { message: `Jenis catatan "${type}" tidak dikenal.` };

  const text = String(rawValue).trim().replace(",", ".");
  if (text === "") return { message: "Isi angkanya dulu." };

  const value = Number(text);
  if (!Number.isFinite(value) || value < 0) return { message: "Nilai catatan harus angka nol atau lebih." };
  if (!activity.decimal && !Number.isInteger(value)) return { message: `${activity.label} harus berupa angka bulat.` };
  if (activity.allowedValues && !activity.allowedValues.includes(value)) {
    return { message: `${activity.label} hanya menerima nilai ${activity.allowedValues.join(", ")} ${activity.unit}.` };
  }
  return { value };
}
