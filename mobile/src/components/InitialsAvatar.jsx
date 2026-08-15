// React Native twin of web/src/components/InitialsAvatar.jsx. Same shared
// logic (initialsOf, avatarColor from @shared/avatar), just a View+Text
// instead of a styled div.

import { StyleSheet, Text, View } from "react-native";
import { initialsOf, avatarColor } from "@shared/avatar";
import { colors } from "../theme/colors";

export default function InitialsAvatar({ name, size = 40, style }) {
  return (
    <View
      style={[
        styles.base,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: avatarColor(name) },
        style
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.4 }]}>{initialsOf(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: colors.putih,
    fontWeight: "700"
  }
});
