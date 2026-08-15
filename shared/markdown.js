// A deliberately small Markdown parser for content bodies: paragraphs,
// "## " headings, and "- " lists. Nothing else, no external package — content
// bodies are hand-written and never use more than this.
//
// Pure logic only, no rendering. Returns a list of blocks; each platform maps
// them to its own elements (web: HTML tags, React Native: its own components).

export function parseMarkdown(text) {
  const lines = String(text || "").split("\n");
  const blocks = [];
  let openList = null;
  let openParagraph = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === "") {
      openList = null;
      openParagraph = null;
      continue;
    }

    if (line.startsWith("## ")) {
      openList = null;
      openParagraph = null;
      blocks.push({ type: "heading", text: line.slice(3) });
      continue;
    }

    if (line.startsWith("- ")) {
      if (!openList) {
        openList = { type: "list", items: [] };
        blocks.push(openList);
      }
      openParagraph = null;
      openList.items.push(line.slice(2));
      continue;
    }

    openList = null;
    if (openParagraph) {
      openParagraph.text += ` ${line}`;
    } else {
      openParagraph = { type: "paragraph", text: line };
      blocks.push(openParagraph);
    }
  }

  return blocks;
}
