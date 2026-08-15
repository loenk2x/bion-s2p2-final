const express = require("express");
const Favorite = require("../models/Favorite");
const Content = require("../models/Content");
const { bungkus, galatKlien } = require("../middleware/error");

const router = express.Router();

// Setiap query di berkas ini menyertakan req.user._id. Tidak ada satu pun jalan
// untuk membaca atau menghapus favorit milik pengguna lain.

router.get(
  "/",
  bungkus(async (req, res) => {
    const daftar = await Favorite.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate("contentId");

    res.json({
      favorit: daftar
        .filter((f) => f.contentId)
        .map((f) => ({ ...f.contentId.toCard(), disimpan: true, disimpanPada: f.createdAt })),
      total: daftar.length
    });
  })
);

router.post(
  "/:contentId",
  bungkus(async (req, res) => {
    const ada = await Content.exists({ _id: req.params.contentId });
    if (!ada) throw galatKlien(404, "Konten tidak ditemukan.");

    // Menyimpan dua kali tidak menghasilkan galat, cukup tetap tersimpan.
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
  bungkus(async (req, res) => {
    const hasil = await Favorite.deleteOne({
      userId: req.user._id,
      contentId: req.params.contentId
    });

    // 404, bukan 403 — supaya keberadaan favorit milik orang lain pun tidak bocor.
    if (hasil.deletedCount === 0) {
      throw galatKlien(404, "Favorit tidak ditemukan.");
    }

    res.json({ pesan: "Konten dihapus dari favorit.", disimpan: false });
  })
);

module.exports = router;
