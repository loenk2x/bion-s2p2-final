// Mengisi database dari berkas JSON di folder content/, lalu menyiapkan akun demo
// beserta favorit dan catatan hariannya.
//
// Jalankan: npm run feed

require("dotenv").config();

const fs = require("node:fs");
const path = require("node:path");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const { sambungkanDatabase } = require("../src/config/db");
const Content = require("../src/models/Content");
const User = require("../src/models/User");
const Favorite = require("../src/models/Favorite");
const HealthLog = require("../src/models/HealthLog");
const { tanggalKunci } = require("../src/utils/aktivitas");

const DIR_KONTEN = path.join(__dirname, "..", "..", "content");
const WAJIB = ["slug", "title", "type", "category", "excerpt", "body", "imageUrl", "publishedAt"];

const AKUN_DEMO = {
  name: "Pengguna Demo",
  email: "demo@healthylife.id",
  password: "demo12345"
};

function bacaKonten() {
  const berkas = [];
  for (const kategori of fs.readdirSync(DIR_KONTEN)) {
    const dir = path.join(DIR_KONTEN, kategori);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const nama of fs.readdirSync(dir)) {
      if (nama.endsWith(".json")) berkas.push(path.join(dir, nama));
    }
  }

  const konten = [];
  const galat = [];
  for (const b of berkas) {
    const rel = path.relative(DIR_KONTEN, b);
    let data;
    try {
      data = JSON.parse(fs.readFileSync(b, "utf8"));
    } catch (e) {
      galat.push(`${rel}: JSON tidak terbaca — ${e.message}`);
      continue;
    }
    const kurang = WAJIB.filter((k) => data[k] === undefined || data[k] === null || data[k] === "");
    if (kurang.length) {
      galat.push(`${rel}: field wajib kosong — ${kurang.join(", ")}`);
      continue;
    }
    if (data.type === "video" && !data.videoId) {
      galat.push(`${rel}: tipe video tapi videoId kosong`);
      continue;
    }
    konten.push(data);
  }
  return { konten, galat };
}

async function isiKonten(konten) {
  let baru = 0;
  let diperbarui = 0;
  for (const k of konten) {
    const hasil = await Content.updateOne(
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
    if (hasil.upsertedCount) baru += 1;
    else if (hasil.modifiedCount) diperbarui += 1;
  }
  return { baru, diperbarui };
}

async function siapkanAkunDemo() {
  let user = await User.findOne({ email: AKUN_DEMO.email });
  if (!user) {
    user = await User.create({
      name: AKUN_DEMO.name,
      email: AKUN_DEMO.email,
      passwordHash: await bcrypt.hash(AKUN_DEMO.password, 10),
      bio: "Akun contoh untuk mencoba Healthy Life."
    });
  }

  // Isi ulang dari nol supaya menjalankan feeder berkali-kali tidak menumpuk data.
  await Favorite.deleteMany({ userId: user._id });
  await HealthLog.deleteMany({ userId: user._id });

  const favorit = await Content.find({}).sort({ publishedAt: -1 }).limit(4);
  await Favorite.insertMany(favorit.map((k) => ({ userId: user._id, contentId: k._id })));

  // Tujuh hari terakhir, tersebar di enam jenis aktivitas.
  const pola = [
    { steps: [3120, 4100], exercise: [25], water: [3, 3, 2], sleep: 7.1, napas: [{ menit: 3, mood: 3 }], weight: 68.4 },
    { steps: [7410], exercise: [30], water: [8], sleep: 7.6, napas: [{ menit: 5, mood: 4 }] },
    { steps: [2980, 4100], exercise: [], water: [6], sleep: 6.8, napas: [] },
    { steps: [5640], exercise: [45], water: [7], sleep: 8.1, napas: [{ menit: 1, mood: 2 }], weight: 68.1 },
    { steps: [6820], exercise: [20], water: [5], sleep: 7.4, napas: [{ menit: 3, mood: 3 }] },
    { steps: [4310], exercise: [], water: [6, 2], sleep: 7.0, napas: [{ menit: 3, mood: 4 }] },
    { steps: [8150], exercise: [35], water: [8], sleep: 7.9, napas: [{ menit: 5, mood: 4 }], weight: 67.9 }
  ];

  const catatan = [];
  pola.forEach((hari, i) => {
    const mundur = pola.length - 1 - i;
    const dasar = new Date();
    dasar.setDate(dasar.getDate() - mundur);
    const date = tanggalKunci(dasar);
    const pada = (jam, menit) => {
      const d = new Date(dasar);
      d.setHours(jam, menit, 0, 0);
      return d;
    };

    hari.steps.forEach((v, n) => catatan.push({ type: "steps", value: v, loggedAt: pada(7 + n * 10, 10), date }));
    hari.exercise.forEach((v) => catatan.push({ type: "exercise", value: v, loggedAt: pada(6, 15), date, note: "Jalan pagi keliling komplek" }));
    hari.water.forEach((v, n) => catatan.push({ type: "water", value: v, loggedAt: pada(9 + n * 4, 30), date }));
    if (hari.sleep) catatan.push({ type: "sleep", value: hari.sleep, loggedAt: pada(6, 0), date });
    hari.napas.forEach((s) => catatan.push({ type: "breathing", value: s.menit, mood: s.mood, loggedAt: pada(12, 0), date }));
    if (hari.weight) catatan.push({ type: "weight", value: hari.weight, loggedAt: pada(7, 0), date });
  });

  await HealthLog.insertMany(catatan.map((c) => ({ ...c, userId: user._id, note: c.note || "" })));

  return { email: AKUN_DEMO.email, password: AKUN_DEMO.password, favorit: favorit.length, catatan: catatan.length };
}

(async () => {
  try {
    const { namaDatabase } = await sambungkanDatabase();
    console.log(`Database tersambung: ${namaDatabase}`);

    const { konten, galat } = bacaKonten();
    if (galat.length) {
      console.error(`\n${galat.length} berkas konten bermasalah:`);
      galat.forEach((g) => console.error("  - " + g));
      throw new Error("Perbaiki berkas di content/ dulu sebelum mengisi database.");
    }

    const { baru, diperbarui } = await isiKonten(konten);
    console.log(`Konten: ${konten.length} berkas dibaca, ${baru} baru, ${diperbarui} diperbarui.`);

    const demo = await siapkanAkunDemo();
    console.log(`Akun demo: ${demo.email} / ${demo.password}`);
    console.log(`  ${demo.favorit} favorit, ${demo.catatan} catatan harian selama 7 hari.`);

    const perKategori = await Content.aggregate([
      { $group: { _id: "$category", jumlah: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    console.log("\nJumlah konten per kategori:");
    perKategori.forEach((k) => console.log(`  ${k._id.padEnd(22)} ${k.jumlah}`));

    await mongoose.disconnect();
    console.log("\nSelesai.");
  } catch (galat) {
    console.error("\nFeeder gagal:", galat.message);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
})();
