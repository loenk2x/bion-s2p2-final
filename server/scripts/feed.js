// Seeds the database from JSON files in the content/ folder, then prepares
// the demo account along with its favorites and daily health log entries.
//
// Run: npm run feed

require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const { connectDatabase } = require("../src/config/db");
const Content = require("../src/models/Content");
const User = require("../src/models/User");
const Favorite = require("../src/models/Favorite");
const HealthLog = require("../src/models/HealthLog");
const { tanggalKunci } = require("../src/utils/aktivitas");

const CONTENT_DIR = path.join(__dirname, "..", "..", "content");
const REQUIRED_FIELDS = ["slug", "title", "type", "category", "excerpt", "body", "imageUrl", "publishedAt"];

const DEMO_ACCOUNT = {
  name: "Pengguna Demo",
  email: "demo@healthylife.id",
  password: "demo12345"
};

function readContentFiles() {
  const files = [];
  for (const category of fs.readdirSync(CONTENT_DIR)) {
    const dir = path.join(CONTENT_DIR, category);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const filename of fs.readdirSync(dir)) {
      if (filename.endsWith(".json")) files.push(path.join(dir, filename));
    }
  }

  const contents = [];
  const validationErrors = [];
  for (const b of files) {
    const rel = path.relative(CONTENT_DIR, b);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(b, "utf8"));
    } catch (e) {
      validationErrors.push(`${rel}: JSON tidak terbaca — ${e.message}`);
      continue;
    }
    const missingFields = REQUIRED_FIELDS.filter((k) => data[k] === undefined || data[k] === null || data[k] === "");
    if (missingFields.length) {
      validationErrors.push(`${rel}: field wajib kosong — ${missingFields.join(", ")}`);
      continue;
    }
    if (data.type === "video" && !data.videoId) {
      validationErrors.push(`${rel}: tipe video tapi videoId kosong`);
      continue;
    }
    contents.push(data);
  }
  return { contents, errors: validationErrors };
}

async function upsertContents(contents) {
  let created = 0;
  let updated = 0;
  for (const k of contents) {
    const result = await Content.updateOne(
      { slug: k.slug },
      {
        $set: {
          title: k.title,
          type: k.type,
          category: k.category,
          excerpt: k.excerpt,
          body: k.body,
          imageUrl: k.imageUrl,
          videoId: k.videoId || null,
          videoUrl: k.videoUrl || null,
          author: k.author || "Tim Healthy Life",
          source: k.source || { name: "", url: "" },
          readingMinutes: k.readingMinutes || 3,
          tags: k.tags || [],
          publishedAt: new Date(k.publishedAt)
        }
      },
      { upsert: true }
    );
    if (result.upsertedCount) created += 1;
    else if (result.modifiedCount) updated += 1;
  }
  return { created, updated };
}

async function prepareDemoAccount() {
  let user = await User.findOne({ email: DEMO_ACCOUNT.email });
  if (!user) {
    user = await User.create({
      name: DEMO_ACCOUNT.name,
      email: DEMO_ACCOUNT.email,
      passwordHash: await bcrypt.hash(DEMO_ACCOUNT.password, 10),
      bio: "Akun contoh untuk mencoba Healthy Life."
    });
  }

  // Reset from scratch so running the feeder multiple times doesn't pile up data.
  await Favorite.deleteMany({ userId: user._id });
  await HealthLog.deleteMany({ userId: user._id });

  const favorites = await Content.find({}).sort({ publishedAt: -1 }).limit(4);
  await Favorite.insertMany(favorites.map((k) => ({ userId: user._id, contentId: k._id })));

  // Last seven days, spread across six activity types.
  const dailyPatterns = [
    { steps: [3120, 4100], exercise: [25], water: [3, 3, 2], sleep: 7.1, breathing: [{ minutes: 3, mood: 3 }], weight: 68.4 },
    { steps: [7410], exercise: [30], water: [8], sleep: 7.6, breathing: [{ minutes: 5, mood: 4 }] },
    { steps: [2980, 4100], exercise: [], water: [6], sleep: 6.8, breathing: [] },
    { steps: [5640], exercise: [45], water: [7], sleep: 8.1, breathing: [{ minutes: 1, mood: 2 }], weight: 68.1 },
    { steps: [6820], exercise: [20], water: [5], sleep: 7.4, breathing: [{ minutes: 3, mood: 3 }] },
    { steps: [4310], exercise: [], water: [6, 2], sleep: 7.0, breathing: [{ minutes: 3, mood: 4 }] },
    { steps: [8150], exercise: [35], water: [8], sleep: 7.9, breathing: [{ minutes: 5, mood: 4 }], weight: 67.9 }
  ];

  const entries = [];
  dailyPatterns.forEach((day, i) => {
    const daysBack = dailyPatterns.length - 1 - i;
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - daysBack);
    const date = tanggalKunci(baseDate);
    const at = (hour, minute) => {
      const d = new Date(baseDate);
      d.setHours(hour, minute, 0, 0);
      return d;
    };

    day.steps.forEach((v, n) => entries.push({ type: "steps", value: v, loggedAt: at(7 + n * 10, 10), date }));
    day.exercise.forEach((v) => entries.push({ type: "exercise", value: v, loggedAt: at(6, 15), date, note: "Jalan pagi keliling komplek" }));
    day.water.forEach((v, n) => entries.push({ type: "water", value: v, loggedAt: at(9 + n * 4, 30), date }));
    if (day.sleep) entries.push({ type: "sleep", value: day.sleep, loggedAt: at(6, 0), date });
    day.breathing.forEach((s) => entries.push({ type: "breathing", value: s.minutes, mood: s.mood, loggedAt: at(12, 0), date }));
    if (day.weight) entries.push({ type: "weight", value: day.weight, loggedAt: at(7, 0), date });
  });

  await HealthLog.insertMany(entries.map((c) => ({ ...c, userId: user._id, note: c.note || "" })));

  return { email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password, favorites: favorites.length, entries: entries.length };
}

(async () => {
  try {
    const { databaseName } = await connectDatabase();
    console.log(`Database tersambung: ${databaseName}`);

    const { contents, errors } = readContentFiles();
    if (errors.length) {
      console.error(`\n${errors.length} berkas konten bermasalah:`);
      errors.forEach((g) => console.error("  - " + g));
      throw new Error("Perbaiki berkas di content/ dulu sebelum mengisi database.");
    }

    const { created, updated } = await upsertContents(contents);
    console.log(`Konten: ${contents.length} berkas dibaca, ${created} baru, ${updated} diperbarui.`);

    const demo = await prepareDemoAccount();
    console.log(`Akun demo: ${demo.email} / ${demo.password}`);
    console.log(`  ${demo.favorites} favorit, ${demo.entries} catatan harian selama 7 hari.`);

    const byCategory = await Content.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    console.log("\nJumlah konten per kategori:");
    byCategory.forEach((k) => console.log(`  ${k._id.padEnd(22)} ${k.count}`));

    await mongoose.disconnect();
    console.log("\nSelesai.");
  } catch (error) {
    console.error("\nFeeder gagal:", error.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
})();
