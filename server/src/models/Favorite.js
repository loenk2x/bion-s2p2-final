const mongoose = require("mongoose");

const skemaFavorite = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Satu pengguna tidak bisa menyimpan konten yang sama dua kali.
skemaFavorite.index({ userId: 1, contentId: 1 }, { unique: true });
// Menopang daftar favorit yang diurutkan dari yang terbaru.
skemaFavorite.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Favorite", skemaFavorite);
