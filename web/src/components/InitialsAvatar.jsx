// Small wrapper around the shared initials/colour logic so pages never touch
// initialsOf/avatarColor directly.

import { initialsOf, avatarColor } from "@shared/avatar";

const SIZE_CLASS = { 40: "a-40", 56: "a-56", 80: "a-80" };

export default function InitialsAvatar({ name, size = 40, className = "" }) {
  const sizeClass = SIZE_CLASS[size] || SIZE_CLASS[40];
  return (
    <div
      className={`avatar ${sizeClass} ${className}`.trim()}
      style={{ background: avatarColor(name) }}
    >
      {initialsOf(name)}
    </div>
  );
}
