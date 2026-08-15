const mongoose = require("mongoose");

const KATEGORI = [
  "pola-hidup-sehat",
  "gizi-seimbang",
  "olahraga",
  "kesehatan-mental",
  "pencegahan-penyakit"
];

const TIPE = ["article", "video", "infographic"];

const skemaContent = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, enum: TIPE },
    category: { type: String, required: true, enum: KATEGORI },
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

// Menopang pencarian judul dan kutipan di halaman Beranda.
skemaContent.index({ title: "text", excerpt: "text" });
skemaContent.index({ category: 1, type: 1, publishedAt: -1 });

// Bentuk ringkas untuk kartu di daftar — tanpa body, supaya balasan daftar tetap kecil.
skemaContent.methods.keKartu = function () {
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

module.exports = mongoose.model("Content", skemaContent);
module.exports.KATEGORI = KATEGORI;
module.exports.TIPE = TIPE;
