const express = require("express");
const HealthLog = require("../models/HealthLog");
const { asyncHandler, clientError } = require("../middleware/error");
const {
  ACTIVITIES,
  ACTIVITY_TYPES,
  DAILY_TARGETS,
  MOOD_LABELS,
  validateValue,
  validateMood,
  dateKey,
  daysAgo
} = require("../utils/activities");

const router = express.Router();

// Every query in this file includes req.user._id. Daily entries are private.

function toLogEntry(log) {
  const info = ACTIVITIES[log.type];
  return {
    id: log._id,
    type: log.type,
    namaJenis: info.label,
    value: log.value,
    satuan: info.unit,
    mood: log.mood,
    namaMood: log.mood ? MOOD_LABELS[log.mood] : null,
    note: log.note,
    loggedAt: log.loggedAt,
    date: log.date
  };
}

// ---------- summary: today's rings plus a seven-day recap ----------
router.get(
  "/summary",
  asyncHandler(async (req, res) => {
    const today = dateKey();
    const start = dateKey(daysAgo(6));

    const logs = await HealthLog.find({
      userId: req.user._id,
      date: { $gte: start, $lte: today }
    }).sort({ loggedAt: 1 });

    const byDate = {};
    for (const log of logs) {
      if (!byDate[log.date]) byDate[log.date] = { steps: 0, exercise: 0, water: 0, breathingMinutes: 0, breathingSessions: 0, sleep: null, weight: null, mood: null };
      const day = byDate[log.date];
      if (log.type === "steps") day.steps += log.value;
      else if (log.type === "exercise") day.exercise += log.value;
      else if (log.type === "water") day.water += log.value;
      else if (log.type === "breathing") { day.breathingMinutes += log.value; day.breathingSessions += 1; if (log.mood) day.mood = log.mood; }
      else if (log.type === "sleep") day.sleep = log.value;   // the last entry of that day wins
      else if (log.type === "weight") day.weight = log.value;
    }

    const todayStats = byDate[today] || { steps: 0, sleep: null, breathingSessions: 0 };
    const progress = (value, target) => ({
      capaian: value,
      target,
      persen: Math.min(1, target ? value / target : 0)
    });

    const rings = {
      gerak: { ...progress(todayStats.steps, DAILY_TARGETS.gerak), satuan: "langkah" },
      tidur: { ...progress(todayStats.sleep || 0, DAILY_TARGETS.tidur), satuan: "jam" },
      relaksasi: { ...progress(todayStats.breathingSessions, DAILY_TARGETS.relaksasi), satuan: "sesi" }
    };
    rings.targetTercapai = ["gerak", "tidur", "relaksasi"].filter((k) => rings[k].persen >= 1).length;

    const days = Object.values(byDate);
    const sum = (pick) => days.reduce((t, x) => t + (pick(x) || 0), 0);
    const average = (pick) => {
      const values = days.map(pick).filter((v) => v !== null && v !== undefined);
      return values.length ? Number((values.reduce((t, v) => t + v, 0) / values.length).toFixed(1)) : 0;
    };

    res.json({
      hariIni: today,
      cincin: rings,
      tujuhHari: {
        totalLangkah: sum((x) => x.steps),
        rataTidur: average((x) => x.sleep),
        totalOlahraga: sum((x) => x.exercise),
        rataAir: average((x) => x.water),
        totalMenitPernapasan: sum((x) => x.breathingMinutes),
        jumlahHariTercatat: days.length
      }
    });
  })
);

// ---------- history ----------
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { type, from, to } = req.query;
    const filter = { userId: req.user._id };

    if (type) {
      if (!ACTIVITY_TYPES.includes(type)) throw clientError(400, `Jenis catatan "${type}" tidak dikenal.`);
      filter.type = type;
    }
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to) filter.date.$lte = to;
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const perPage = Math.min(100, parseInt(req.query.perPage, 10) || 30);

    const [items, total] = await Promise.all([
      HealthLog.find(filter).sort({ loggedAt: -1 }).skip((page - 1) * perPage).limit(perPage),
      HealthLog.countDocuments(filter)
    ]);

    // Grouped by date, exactly the way the history screen shows it.
    const groups = [];
    for (const log of items) {
      let group = groups.find((x) => x.date === log.date);
      if (!group) { group = { date: log.date, catatan: [] }; groups.push(group); }
      group.catatan.push(toLogEntry(log));
    }

    res.json({ kelompok: groups, total, halaman: page, perHalaman: perPage });
  })
);

// ---------- record one activity; every type goes through the same door ----------
// Breathing has no endpoint of its own. All that sets it apart are two validation
// rules already attached to its type: the value must be 1, 3, or 5 minutes, and it
// is the only type allowed to carry a mood.
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { type, value, mood, note, loggedAt } = req.body || {};

    if (!ACTIVITY_TYPES.includes(type)) {
      throw clientError(400, `Jenis catatan harus salah satu dari: ${ACTIVITY_TYPES.join(", ")}.`);
    }

    const validated = validateValue(type, value);
    if (validated.message) throw clientError(400, validated.message);

    const moodResult = validateMood(type, mood);
    if (moodResult.message) throw clientError(400, moodResult.message);

    const loggedAtDate = loggedAt ? new Date(loggedAt) : new Date();
    if (Number.isNaN(loggedAtDate.getTime())) throw clientError(400, "Waktu pencatatan tidak terbaca.");

    const entry = await HealthLog.create({
      userId: req.user._id,
      type,
      value: validated.value,
      mood: moodResult.mood,
      note: note ? String(note).trim() : "",
      loggedAt: loggedAtDate,
      date: dateKey(loggedAtDate)
    });

    res.status(201).json({ catatan: toLogEntry(entry) });
  })
);

// ---------- edit and delete ----------
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const { value, note, mood } = req.body || {};
    const entry = await HealthLog.findOne({ _id: req.params.id, userId: req.user._id });
    // 404, not 403 — the existence of another user's entry must never leak.
    if (!entry) throw clientError(404, "Catatan tidak ditemukan.");

    // Exactly the same validation rules as on create. The type cannot be changed —
    // changing the type would amount to creating a different entry.
    if (value !== undefined) {
      const validated = validateValue(entry.type, value);
      if (validated.message) throw clientError(400, validated.message);
      entry.value = validated.value;
    }
    if (note !== undefined) entry.note = String(note).trim();
    if (mood !== undefined) {
      const moodResult = validateMood(entry.type, mood);
      if (moodResult.message) throw clientError(400, moodResult.message);
      entry.mood = moodResult.mood;
    }

    await entry.save();
    res.json({ catatan: toLogEntry(entry) });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const result = await HealthLog.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (result.deletedCount === 0) throw clientError(404, "Catatan tidak ditemukan.");
    res.json({ pesan: "Catatan dihapus." });
  })
);

module.exports = router;
