// Transcribed from web/src/styles/tokens.css. React Native has no CSS custom
// properties, so the values are copied here as plain JS constants instead of
// being re-derived. Keep this file's values identical to tokens.css - if a
// color changes there, it must change here too.
//
// Per-activity-type and ring colors are NOT duplicated here: those come from
// @shared/activityColors (activityColorHex) and @shared/rings (axis.hex).

export const colors = {
  // warna utama dan aksen
  hijau700: "#0E6E49",
  hijau600: "#128A5B",
  hijau500: "#19A96F",
  hijau100: "#DCF3E8",
  hijau50: "#F1FAF5",
  jingga500: "#F2762E",
  jingga100: "#FDE8DA",

  // netral dan status
  tinta900: "#12211B",
  tinta600: "#4B5B54",
  tinta400: "#84968D",
  garis: "#E2EBE6",
  putih: "#FFFFFF",
  latar: "#F6FBF8",
  bahaya: "#D2453C",
  bahaya100: "#FBE4E2",
  peringatan: "#C9820A",

  // lencana tipe konten
  lenArtikelTeks: "#0E6E49",
  lenArtikelLatar: "#DCF3E8",
  lenVideoTeks: "#9A3F0B",
  lenVideoLatar: "#FDE8DA",
  lenInfografisTeks: "#1A4E8A",
  lenInfografisLatar: "#DDEAFB"
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999
};

export const spacing = {
  s4: 4,
  s8: 8,
  s12: 12,
  s16: 16,
  s20: 20,
  s24: 24,
  s32: 32,
  s40: 40,
  s48: 48
};

// react-native's `shadow*` style props (iOS) and `elevation` (Android) don't
// map cleanly from CSS box-shadow, so these are approximations of --bayang-1/2/3.
export const shadow = {
  card: {
    shadowColor: colors.tinta900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2
  },
  sheet: {
    shadowColor: colors.tinta900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8
  }
};
