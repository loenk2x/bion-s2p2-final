// Geometry and copy for the daily rings shown on the home screen.
//
// Each axis draws two circles at the same centre: a target ring that never
// changes size, and an achievement circle on top of it. The gap between their
// edges is what is left to reach the target.
//
// Colours are given twice on purpose. The web app uses the CSS custom property
// so it stays bound to tokens.css; React Native has no CSS variables and uses
// the hex directly. Both refer to the same value.

export const RING_CANVAS = { width: 240, height: 480 / 3 };

export const RING_AXES = [
  {
    key: "gerak",
    label: "Gerak",
    cx: 120, cy: 54, targetRadius: 46,
    cssVar: "--ak-langkah", hex: "#F2762E",
    icon: "exercise",
    unit: "langkah"
  },
  {
    key: "tidur",
    label: "Tidur",
    cx: 82, cy: 106, targetRadius: 40,
    cssVar: "--ak-tidur", hex: "#7A5AF8",
    icon: "sleep",
    unit: "jam"
  },
  {
    key: "relaksasi",
    label: "Relaksasi",
    cx: 158, cy: 106, targetRadius: 33,
    cssVar: "--ak-napas", hex: "#0E9DA8",
    icon: "breathing",
    unit: "sesi"
  }
];

// Smallest the achievement circle may get, so a zero day still reads as a dot
// rather than disappearing.
export const MIN_RADIUS_RATIO = 0.18;

// Radius is derived from area, not width: r = rTarget * sqrt(ratio).
// Scaling the radius linearly would make a half-finished day look a quarter
// finished, because a circle's area grows with the square of its radius.
export function achievementRadius(targetRadius, ratio) {
  const clamped = Math.max(0, Math.min(1, Number(ratio) || 0));
  return targetRadius * Math.max(MIN_RADIUS_RATIO, Math.sqrt(clamped));
}

// Staggered so the three circles do not pulse in lockstep like one object.
export const PULSE_DELAYS = ["0s", "-1.2s", "-2.4s"];

// Turns the server's summary payload into everything a ring component needs.
// Expects the `cincin` object from GET /api/logs/summary.
export function buildRings(summaryRings) {
  return RING_AXES.map((axis, index) => {
    const data = summaryRings?.[axis.key] || { capaian: 0, target: 1, persen: 0 };
    const ratio = Number(data.persen) || 0;
    return {
      ...axis,
      achieved: data.capaian,
      target: data.target,
      ratio,
      radius: achievementRadius(axis.targetRadius, ratio),
      reached: ratio >= 1,
      pulseDelay: PULSE_DELAYS[index]
    };
  });
}
