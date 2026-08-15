const express = require("express");
const Favorite = require("../models/Favorite");
const Content = require("../models/Content");
const { asyncHandler, clientError } = require("../middleware/error");

const router = express.Router();

// Every query in this file includes req.user._id. There is no path here that can
// read or delete another user's favorites.

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const favorites = await Favorite.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("contentId");

    res.json({
      favorit: favorites
        .filter((f) => f.contentId)
        .map((f) => ({ ...f.contentId.toCard(), disimpan: true, disimpanPada: f.createdAt })),
      total: favorites.length
    });
  })
);

router.post(
  "/:contentId",
  asyncHandler(async (req, res) => {
    const contentExists = await Content.exists({ _id: req.params.contentId });
    if (!contentExists) throw clientError(404, "Konten tidak ditemukan.");

    // Saving twice is not an error; the favorite simply stays saved.
    await Favorite.updateOne(
      { userId: req.user._id, contentId: req.params.contentId },
      { $setOnInsert: { userId: req.user._id, contentId: req.params.contentId } },
      { upsert: true }
    );

    res.status(201).json({ pesan: "Konten disimpan ke favorit.", disimpan: true });
  })
);

router.delete(
  "/:contentId",
  asyncHandler(async (req, res) => {
    const result = await Favorite.deleteOne({
      userId: req.user._id,
      contentId: req.params.contentId
    });

    // 404, not 403 — so the existence of another user's favorite never leaks.
    if (result.deletedCount === 0) {
      throw clientError(404, "Favorit tidak ditemukan.");
    }

    res.json({ pesan: "Konten dihapus dari favorit.", disimpan: false });
  })
);

module.exports = router;
