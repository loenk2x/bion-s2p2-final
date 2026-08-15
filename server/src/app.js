const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const Content = require("./models/Content");
const { requireAuth } = require("./middleware/requireAuth");
const { notFound, errorHandler, asyncHandler } = require("./middleware/error");
const { ACTIVITIES, BREATHING_SESSION_MINUTES, DAILY_TARGETS, MOOD_LABELS } = require("./utils/activities");

const publicRouter = require("./routes/public");
const authRouter = require("./routes/auth");
const contentsRouter = require("./routes/contents");
const favoritesRouter = require("./routes/favorites");
const logsRouter = require("./routes/logs");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true }));
app.use(express.json({ limit: "200kb" }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "hidup", waktu: new Date().toISOString() }));

// No login required
app.use("/api/public", publicRouter);
app.use("/api/auth", authRouter);

// Everything below requires a login. requireAuth is mounted at the app level
// rather than per handler, so no content route can slip through by accident.
app.use("/api/contents", requireAuth, contentsRouter);
app.use("/api/favorites", requireAuth, favoritesRouter);
app.use("/api/logs", requireAuth, logsRouter);

app.get(
  "/api/categories",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rows = await Content.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ kategori: rows.map((row) => ({ slug: row._id, jumlah: row.count })) });
  })
);

// Activity type reference for clients, so labels and units are never written twice.
app.get("/api/aktivitas", requireAuth, (req, res) => {
  res.json({ aktivitas: ACTIVITIES, durasiSesiNapas: BREATHING_SESSION_MINUTES, targetHarian: DAILY_TARGETS, mood: MOOD_LABELS });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
