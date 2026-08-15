const express = require("express");
const Content = require("../models/Content");
const Favorite = require("../models/Favorite");
const { asyncHandler, clientError } = require("../middleware/error");

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { category, type, search } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const perPage = Math.min(50, parseInt(req.query.perPage, 10) || 12);

    const filter = {};
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (search) {
      const pola = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ title: pola }, { excerpt: pola }, { tags: pola }];
    }

    const [daftar, total, idFavorit] = await Promise.all([
      Content.find(filter).sort({ publishedAt: -1 }).skip((page - 1) * perPage).limit(perPage),
      Content.countDocuments(filter),
      Favorite.find({ userId: req.user._id }).distinct("contentId")
    ]);

    const himpunanFavorit = new Set(idFavorit.map((id) => id.toString()));

    res.json({
      konten: daftar.map((k) => ({
        ...k.toCard(),
        disimpan: himpunanFavorit.has(k._id.toString())
      })),
      halaman: page,
      perHalaman: perPage,
      total,
      totalHalaman: Math.ceil(total / perPage) || 1
    });
  })
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const konten = await Content.findOne({ slug: req.params.slug });
    if (!konten) throw clientError(404, "Konten tidak ditemukan.");

    const disimpan = await Favorite.exists({ userId: req.user._id, contentId: konten._id });

    res.json({
      konten: {
        id: konten._id,
        slug: konten.slug,
        title: konten.title,
        type: konten.type,
        category: konten.category,
        excerpt: konten.excerpt,
        body: konten.body,
        imageUrl: konten.imageUrl,
        videoId: konten.videoId,
        videoUrl: konten.videoUrl,
        author: konten.author,
        source: konten.source,
        readingMinutes: konten.readingMinutes,
        tags: konten.tags,
        publishedAt: konten.publishedAt
      },
      disimpan: Boolean(disimpan)
    });
  })
);

module.exports = router;
