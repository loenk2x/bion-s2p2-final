// Renders the block structure from shared/markdown.js as HTML elements.

import { parseMarkdown } from "@shared/markdown";

export default function Markdown({ text }) {
  const blocks = parseMarkdown(text);
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
