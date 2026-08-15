// React Native twin of web/src/components/Icon.jsx. Same path data (there is
// no shared/icons.js - the path data is presentation, not business logic -
// but the shapes and names are kept byte-for-byte identical so both apps draw
// the same icon set). Web draws with <svg>/<path>; this draws the same paths
// with react-native-svg.

import Svg, { Circle, Path, Rect, G } from "react-native-svg";
import { colors } from "../theme/colors";

const OUTLINE = {
  home: [
    <Path key="a" d="M3 10.5 12 3l9 7.5" />,
    <Path key="b" d="M5 9.5V21h14V9.5" />
  ],
  bookmark: [<Path key="a" d="M6 3h12v18l-6-4.5L6 21z" />],
  notes: [
    <Rect key="a" x="4" y="3" width="16" height="18" rx="2" />,
    <Path key="b" d="M8 8h8M8 12h8M8 16h5" />
  ],
  profile: [
    <Circle key="a" cx="12" cy="8" r="4" />,
    <Path key="b" d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
  ],
  search: [
    <Circle key="a" cx="11" cy="11" r="7" />,
    <Path key="b" d="m20 20-3.5-3.5" />
  ],
  back: [<Path key="a" d="m15 5-7 7 7 7" />],
  add: [<Path key="a" d="M12 5v14M5 12h14" />],
  share: [
    <Circle key="a" cx="18" cy="5" r="3" />,
    <Circle key="b" cx="6" cy="12" r="3" />,
    <Circle key="c" cx="18" cy="19" r="3" />,
    <Path key="d" d="m8.6 10.6 6.8-4M8.6 13.4l6.8 4" />
  ],
  trash: [
    <Path key="a" d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />,
    <Path key="b" d="M10 11v6M14 11v6" />
  ],
  signOut: [
    <Path key="a" d="M9 21H5V3h4" />,
    <Path key="b" d="m15 8 4 4-4 4M19 12H9" />
  ],
  lock: [
    <Rect key="a" x="4" y="10" width="16" height="11" rx="2" />,
    <Path key="b" d="M8 10V7a4 4 0 0 1 8 0v3" />
  ],
  leaf: [
    <Path key="a" d="M20 4c0 9-6 14-13 14" />,
    <Path key="b" d="M20 4C9 4 4 9 4 15a5 5 0 0 0 5 5c6 0 11-5 11-16Z" />
  ],
  close: [<Path key="a" d="m6 6 12 12M18 6 6 18" />],
  breathing: [
    <Circle key="a" cx="12" cy="12" r="3.2" />,
    <Circle key="b" cx="12" cy="12" r="7" />,
    <Circle key="c" cx="12" cy="12" r="10.6" />
  ]
};

const SOLID = {
  bookmarkFilled: [<Path key="a" d="M6 3h12v18l-6-4.5L6 21z" />],
  play: [<Path key="a" d="M8 5.5v13l11-6.5z" />],
  steps: [
    <Path
      key="a"
      d="M8.6 2.2c1.8 0 2.9 1.6 2.9 3.7 0 1.6-.5 3-.5 4.3 0 1 .4 1.7.4 2.7 0 1.6-1.2 2.6-2.8 2.6-1.9 0-3-1.3-3-3.2 0-1.3.4-2.3.4-3.6 0-1.4-.6-2.6-.6-4C5.4 3.4 6.7 2.2 8.6 2.2Zm.1 15.1c1.4 0 2.4.9 2.4 2.2 0 1.4-1 2.3-2.5 2.3s-2.5-.9-2.5-2.3c0-1.3 1.1-2.2 2.6-2.2ZM16.2 6.6c1.7 0 2.7 1.4 2.7 3.4 0 1.5-.5 2.8-.5 4 0 1 .4 1.6.4 2.5 0 1.5-1.1 2.4-2.6 2.4-1.8 0-2.8-1.2-2.8-3 0-1.2.4-2.1.4-3.3 0-1.3-.6-2.4-.6-3.7 0-1.4 1.2-2.3 3-2.3Z"
    />
  ],
  exercise: [
    <Path
      key="a"
      d="M15.5 4.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8.9 8.2 6 10.6l1.4 1.8 3-2.4 2 2.2-2.6 4.2L6 20.9l1.7 1.6 4.6-5.4 3 3.3v3.1h2.2v-4.2l-3.2-3.5 1.5-4 2.3 2.4h3.4v-2.2h-2.5l-3.2-3.4c-.5-.5-1.1-.8-1.8-.8-.6 0-1.1.2-1.6.5l-3.5 2.9Z"
    />
  ],
  water: [<Path key="a" d="M12 2.5c3.6 4.3 6.5 7.6 6.5 11.2A6.5 6.5 0 0 1 5.5 13.7C5.5 10.1 8.4 6.8 12 2.5Z" />],
  sleep: [<Path key="a" d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5 8.6 8.6 0 1 0 20.5 14.3Z" />],
  weight: [
    <Path
      key="a"
      d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 3a3.6 3.6 0 0 0-3.5 3.6h1.9c0-.9.7-1.7 1.6-1.7s1.6.8 1.6 1.7h1.9A3.6 3.6 0 0 0 12 6Zm-4 6.5h8v1.8H8v-1.8Z"
    />
  ]
};

// react-native-svg has no reliable "currentColor" inheritance, unlike CSS in
// the browser, so every caller passes an explicit color; this is only a
// fallback for callers that don't.
export default function Icon({ name, size = 24, color = colors.tinta900, ...rest }) {
  const solid = SOLID[name];
  const outline = OUTLINE[name];
  if (!solid && !outline) return null;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={solid ? color : "none"}
      stroke={solid ? "none" : color}
      strokeWidth={solid ? undefined : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      <G>{solid || outline}</G>
    </Svg>
  );
}

// Icon name for each activity type, so callers never hard-code the mapping.
export const ACTIVITY_ICONS = {
  steps: "steps",
  exercise: "exercise",
  water: "water",
  sleep: "sleep",
  breathing: "breathing",
  weight: "weight"
};
