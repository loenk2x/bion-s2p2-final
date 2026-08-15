// Initials avatar. No file upload anywhere in the app, so a name is all we have.

const AVATAR_COLORS = ["#128A5B", "#F2762E", "#2D7FF9", "#7A5AF8", "#0E9DA8"];

// "Wiguno" → "W"  |  "Pengguna Demo" → "PD"
export function initialsOf(fullName) {
  const words = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

// Deterministic, so one person always gets the same colour on both platforms.
export function avatarColor(fullName) {
  const name = String(fullName || "");
  let sum = 0;
  for (let i = 0; i < name.length; i += 1) sum += name.charCodeAt(i);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

export { AVATAR_COLORS };
