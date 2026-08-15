// Indonesian number and date formatting.
//
// Written by hand instead of using Intl, because locale support in Hermes — the
// JavaScript engine React Native runs on — cannot be relied upon. Doing it this
// way guarantees web and mobile render exactly the same text.

const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// 6240 → "6.240"
export function formatInteger(n) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "0";
  const whole = Math.trunc(Math.abs(Number(n)));
  const sign = Number(n) < 0 ? "-" : "";
  return sign + String(whole).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// 7.1 → "7,1"  |  8 → "8"  |  68.42 → "68,4"
export function formatDecimal(n, digits = 1) {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return "0";
  const value = Number(n);
  if (Number.isInteger(value)) return formatInteger(value);
  const [whole, fraction] = value.toFixed(digits).split(".");
  const trimmed = fraction.replace(/0+$/, "");
  return trimmed ? `${formatInteger(whole)},${trimmed}` : formatInteger(whole);
}

// Formats an entry value according to whether its activity type allows decimals.
export function formatActivityValue(value, allowsDecimal) {
  return allowsDecimal ? formatDecimal(value) : formatInteger(value);
}

const toDate = (input) => (input instanceof Date ? input : new Date(input));

// "Sabtu, 15 Agustus 2026"
export function formatLongDate(input) {
  const d = toDate(input);
  return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

// "15 Agustus"
export function formatShortDate(input) {
  const d = toDate(input);
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

// "07.10" — Indonesian convention uses a dot, not a colon.
export function formatTime(input) {
  const d = toDate(input);
  return `${String(d.getHours()).padStart(2, "0")}.${String(d.getMinutes()).padStart(2, "0")}`;
}

// Heading for a day group in the entry history: "HARI INI · 15 AGUSTUS".
export function formatDateGroupHeading(dateKey) {
  const d = new Date(dateKey + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysAgo = Math.round((today - d) / 86400000);

  const date = formatShortDate(d).toUpperCase();
  if (daysAgo === 0) return `HARI INI · ${date}`;
  if (daysAgo === 1) return `KEMARIN · ${date}`;
  return `${DAY_NAMES[d.getDay()].toUpperCase()} · ${date}`;
}

// First name only, used for the greeting on the home screen.
export const firstName = (fullName) => String(fullName || "").trim().split(/\s+/)[0] || "";
