// Content categories and types. The server stores slugs; the interface shows labels.

export const CATEGORIES = {
  "pola-hidup-sehat": "Pola Hidup Sehat",
  "gizi-seimbang": "Gizi Seimbang",
  "olahraga": "Olahraga",
  "kesehatan-mental": "Kesehatan Mental",
  "pencegahan-penyakit": "Pencegahan Penyakit"
};

export const CATEGORY_SLUGS = Object.keys(CATEGORIES);

export const categoryLabel = (slug) => CATEGORIES[slug] || slug;

// Content types and how their badge is labelled and styled.
// `className` refers to a class already defined in komponen.css.
export const CONTENT_TYPES = {
  article: { label: "Artikel", className: "l-art" },
  video: { label: "Video", className: "l-vid" },
  infographic: { label: "Infografis", className: "l-inf" }
};

export const CONTENT_TYPE_SLUGS = Object.keys(CONTENT_TYPES);

export const contentTypeLabel = (type) => CONTENT_TYPES[type]?.label || type;

// Meta line on a content card: "Olahraga · 5 menit baca"
export function contentCardMeta(content) {
  const parts = [categoryLabel(content.category)];
  if (content.readingMinutes) {
    parts.push(content.type === "article" ? `${content.readingMinutes} menit baca` : `${content.readingMinutes} menit`);
  }
  return parts.join(" · ");
}
