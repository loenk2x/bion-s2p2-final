// React Native twin of web/src/components/Markdown.jsx. Same block structure
// from parseMarkdown() (@shared/markdown) - only the elements differ: Text
// and View instead of HTML headings/paragraphs/lists. The parser itself
// (heading "## ", list "- ", paragraph) is not reimplemented here.

import { StyleSheet, Text, View } from "react-native";
import { parseMarkdown } from "@shared/markdown";
import { colors, spacing } from "../theme/colors";

export default function Markdown({ text }) {
  const blocks = parseMarkdown(text);
  return (
    <View style={styles.wrap}>
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return <Text key={index} style={styles.heading}>{block.text}</Text>;
        }
        if (block.type === "list") {
          return (
            <View key={index} style={styles.list}>
              {block.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.listRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          );
        }
        return <Text key={index} style={styles.paragraph}>{block.text}</Text>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.s12 },
  heading: { fontSize: 18, fontWeight: "700", color: colors.tinta900, marginTop: spacing.s8 },
  paragraph: { fontSize: 15, lineHeight: 24, color: colors.tinta600 },
  list: { gap: 6 },
  listRow: { flexDirection: "row", gap: 8 },
  bullet: { fontSize: 15, color: colors.hijau600, lineHeight: 24 },
  listText: { flex: 1, fontSize: 15, lineHeight: 24, color: colors.tinta600 }
});
