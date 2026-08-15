// A deliberately small Markdown renderer for content bodies: paragraphs,
// "## " headings, and "- " lists. Nothing else, no external package — content
// bodies are hand-written and never use more than this.

function parseBlocks(text) {
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

export default function Markdown({ text }) {
  const blocks = parseBlocks(text);
  return (
    <div className="isi-teks">
      {blocks.map((block, index) => {
        if (block.type === "heading") return <h3 key={index}>{block.text}</h3>;
        if (block.type === "list") {
          return (
            <ul key={index}>
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{block.text}</p>;
      })}
    </div>
  );
}
