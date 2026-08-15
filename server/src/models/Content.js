const mongoose = require("mongoose");

const CATEGORIES = [
  "pola-hidup-sehat",
  "gizi-seimbang",
  "olahraga",
  "kesehatan-mental",
  "pencegahan-penyakit"
];

const CONTENT_TYPES = ["article", "video", "infographic"];

const contentSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: CONTENT_TYPES },
    category: { type: String, required: true, enum: CATEGORIES },
    excerpt: { type: String, required: true },
    body: { type: String, required: true },
    imageUrl: { type: String, required: true },
    videoId: { type: String, default: null },
    videoUrl: { type: String, default: null },
    author: { type: String, default: "Tim Healthy Life" },
    source: {
      name: { type: String, default: "" },
      url: { type: String, default: "" }
    },
    readingMinutes: { type: Number, default: 3 },
    tags: { type: [String], default: [] },
    publishedAt: { type: Date, required: true }
  },
  { timestamps: true }
);

// Supports searching by title and excerpt on the Home page.
contentSchema.index({ title: "text", excerpt: "text" });
contentSchema.index({ category: 1, type: 1, publishedAt: -1 });

// Compact shape for cards in a list — no body, so list responses stay small.
contentSchema.methods.toCard = function () {
  return {
    id: this._id,
    slug: this.slug,
    title: this.title,
    type: this.type,
    category: this.category,
    excerpt: this.excerpt,
    imageUrl: this.imageUrl,
    readingMinutes: this.readingMinutes,
    publishedAt: this.publishedAt
  };
};

module.exports = mongoose.model("Content", contentSchema);
module.exports.CATEGORIES = CATEGORIES;
module.exports.CONTENT_TYPES = CONTENT_TYPES;
