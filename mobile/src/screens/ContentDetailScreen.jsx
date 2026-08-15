// Stub for Langkah 3 (navigation skeleton). Filled in during Langkah 6 with
// the real article/video/infographic layout, mirroring
// web/src/pages/ContentDetail.jsx.

import { StyleSheet, Text, View } from "react-native";

export default function ContentDetailScreen({ route }) {
  return (
    <View style={styles.wrap}>
      <Text>Detail konten: {route?.params?.slug}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center" }
});
