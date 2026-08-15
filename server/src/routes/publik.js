const express = require("express");
const Content = require("../models/Content");
const { bungkus } = require("../middleware/error");

const router = express.Router();

// Satu-satunya route konten yang boleh dibuka tanpa token, khusus halaman landing.
// Yang dikirim hanya judul, kategori, tipe, dan gambar sampul — body dan videoId
// sengaja tidak ikut, jadi isi kontennya tetap tertutup.
router.get(
  "/teaser",
  bungkus(async (req, res) => {
    const daftar = await Content.find({})
      .sort({ publishedAt: -1 })
      .limit(3)
      .select("slug title category type imageUrl");

    const jumlah = await Content.countDocuments();
    const kategori = await Content.distinct("category");

    res.json({
      konten: daftar.map((k) => ({
        slug: k.slug,
        title: k.title,
        category: k.category,
        type: k.type,
        imageUrl: k.imageUrl
      })),
      jumlahKonten: jumlah,
      jumlahKategori: kategori.length
    });
  })
);

module.exports = router;
