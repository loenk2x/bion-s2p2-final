const express = require("express");
const Content = require("../models/Content");
const { asyncHandler } = require("../middleware/error");

const router = express.Router();

// The only content route that may be opened without a token, just for the landing page.
// Only title, category, type, and cover image are sent — body and videoId are
// deliberately left out, so the content itself stays behind the login.
router.get(
  "/teaser",
  asyncHandler(async (req, res) => {
    const items = await Content.find({})
      .sort({ publishedAt: -1 })
      .limit(3)
      .select("slug title category type imageUrl");

    const count = await Content.countDocuments();
    const categories = await Content.distinct("category");

    res.json({
      konten: items.map((k) => ({
        slug: k.slug,
        title: k.title,
        category: k.category,
        type: k.type,
        imageUrl: k.imageUrl
      })),
      jumlahKonten: count,
      jumlahKategori: categories.length
    });
  })
);

module.exports = router;
