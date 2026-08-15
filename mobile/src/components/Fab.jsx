// React Native twin of the web app's floating "+" button - the `.fab` inside
// `.fab-tempel` rendered by web/src/components/AppShell.jsx on every routed
// page. Web positions it 16px from the right edge and 102px from the bottom
// edge of the full viewport (coordinates from design/mockups.html), because
// .fab-tempel is `position: fixed; inset: 0`, spanning the whole screen
// including the space behind the fixed bottom tab bar.
//
// Mobile has no such single full-screen wrapper: each tab screen (Home,
// DailyLog, ...) is laid out by the bottom tab navigator as a plain flex
// child *above* the tab bar, so a screen's own bottom edge already lines up
// with the tab bar's top edge - the navigator, not this component, is what
// keeps the button clear of both the tab bar and the device's bottom safe
// area (it sizes the tab bar to include the safe-area inset itself). So
// there's no tab-bar height or inset to re-add here; this component is
// mounted as a plain sibling inside each screen and only needs the same
// 16px/16px gap the web version keeps above its tab bar (102px from the
// viewport bottom minus the web tab bar's own ~86px height).
import { StyleSheet, TouchableOpacity } from "react-native";
import Icon from "./Icon";
import { colors, radius, shadow } from "../theme/colors";

const GAP = 16;

export default function Fab({ onPress }) {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Tambah catatan"
    >
      <Icon name="add" size={26} color={colors.putih} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: GAP,
    bottom: GAP,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.hijau600,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.sheet
  }
});
