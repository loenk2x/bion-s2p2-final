const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const Content = require("./models/Content");
const { requireAuth } = require("./middleware/requireAuth");
const { notFound, errorHandler, asyncHandler } = require("./middleware/error");
const { ACTIVITIES, BREATHING_SESSION_MINUTES, DAILY_TARGETS, MOOD_LABELS } = require("./utils/activities");

const rutePublik = require("./routes/publik");
const ruteAuth = require("./routes/auth");
const ruteContents = require("./routes/contents");
const ruteFavorites = require("./routes/favorites");
const ruteLogs = require("./routes/logs");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true }));
app.use(express.json({ limit: "200kb" }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "hidup", waktu: new Date().toISOString() }));

// Tanpa login
app.use("/api/public", rutePublik);
app.use("/api/auth", ruteAuth);

// Semua yang di bawah ini wajib login. requireAuth dipasang di tingkat app,
// bukan di tiap handler, supaya tidak ada route konten yang lolos tanpa sengaja.
app.use("/api/contents", requireAuth, ruteContents);
app.use("/api/favorites", requireAuth, ruteFavorites);
app.use("/api/logs", requireAuth, ruteLogs);

app.get(
  "/api/categories",
  requireAuth,
  asyncHandler(async (req, res) => {
    const hasil = await Content.aggregate([
      { $group: { _id: "$category", jumlah: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ kategori: hasil.map((k) => ({ slug: k._id, jumlah: k.jumlah })) });
  })
);

// Rujukan jenis aktivitas untuk klien, supaya nama dan satuannya tidak ditulis dua kali.
app.get("/api/aktivitas", requireAuth, (req, res) => {
  res.json({ aktivitas: ACTIVITIES, durasiSesiNapas: BREATHING_SESSION_MINUTES, targetHarian: DAILY_TARGETS, mood: MOOD_LABELS });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
