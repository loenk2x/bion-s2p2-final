const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// A user cannot save the same content twice.
favoriteSchema.index({ userId: 1, contentId: 1 }, { unique: true });
// Supports listing favorites sorted from most recent.
favoriteSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Favorite", favoriteSchema);
