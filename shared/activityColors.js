// CSS custom property and hex colour per activity type. Colours are given
// twice on purpose, the same reason shared/rings.js does it: the web app uses
// the CSS custom property so it stays bound to tokens.css; React Native has
// no CSS variables and uses the hex directly. Both refer to the same value.

export const ACTIVITY_COLORS = {
  steps: { cssVar: "--ak-langkah", hex: "#F2762E" },
  exercise: { cssVar: "--ak-olahraga", hex: "#19A96F" },
  water: { cssVar: "--ak-air", hex: "#2D7FF9" },
  sleep: { cssVar: "--ak-tidur", hex: "#7A5AF8" },
  breathing: { cssVar: "--ak-napas", hex: "#0E9DA8" },
  weight: { cssVar: "--ak-berat", hex: "#C9820A" }
};

export const activityColorVar = (type) => ACTIVITY_COLORS[type]?.cssVar || ACTIVITY_COLORS.steps.cssVar;

export const activityColorHex = (type) => ACTIVITY_COLORS[type]?.hex || ACTIVITY_COLORS.steps.hex;
