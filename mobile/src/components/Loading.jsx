// React Native twin of web/src/components/Loading.jsx. Web uses a CSS
// spin animation on a span; RN uses the built-in ActivityIndicator.

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function Loading({ message = "Memuat…" }) {
  return (
    <View style={styles.wrap} accessibilityRole="progressbar">
      <ActivityIndicator size="large" color={colors.hijau600} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12
  },
  text: {
    color: colors.tinta600,
    fontSize: 14
  }
});
