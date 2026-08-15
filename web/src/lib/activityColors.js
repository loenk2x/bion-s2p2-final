// CSS custom property name per activity type (tokens.css). Web-only: React
// Native has no CSS variables and would need the hex values instead, the way
// shared/rings.js keeps both a cssVar and a hex per ring axis. Kept local to
// the web app rather than in @shared for that reason.

export const ACTIVITY_COLOR_VAR = {
  steps: "--ak-langkah",
  exercise: "--ak-olahraga",
  water: "--ak-air",
  sleep: "--ak-tidur",
  breathing: "--ak-napas",
  weight: "--ak-berat"
};

export const activityColorVar = (type) => ACTIVITY_COLOR_VAR[type] || "--ak-langkah";
