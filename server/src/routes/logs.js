const express = require("express");
const HealthLog = require("../models/HealthLog");
const { bungkus, galatKlien } = require("../middleware/error");
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

// Semua query di berkas ini menyertakan req.user._id. Catatan harian bersifat privat.

function bentukCatatan(c) {
  const info = ACTIVITIES[c.type];
  return {
    id: c._id,
    type: c.type,
    namaJenis: info.label,
    value: c.value,
    satuan: info.unit,
    mood: c.mood,
    namaMood: c.mood ? MOOD_LABELS[c.mood] : null,
    note: c.note,
    loggedAt: c.loggedAt,
    date: c.date
  };
}

// ---------- ringkasan: cincin harian hari ini dan rekap tujuh hari ----------
router.get(
  "/summary",
  bungkus(async (req, res) => {
    const hariIni = dateKey();
    const mulai = dateKey(daysAgo(6));

    const catatan = await HealthLog.find({
      userId: req.user._id,
      date: { $gte: mulai, $lte: hariIni }
    }).sort({ loggedAt: 1 });

    const perHari = {};
    for (const c of catatan) {
      if (!perHari[c.date]) perHari[c.date] = { steps: 0, exercise: 0, water: 0, breathingMenit: 0, breathingSesi: 0, sleep: null, weight: null, mood: null };
      const h = perHari[c.date];
      if (c.type === "steps") h.steps += c.value;
      else if (c.type === "exercise") h.exercise += c.value;
      else if (c.type === "water") h.water += c.value;
      else if (c.type === "breathing") { h.breathingMenit += c.value; h.breathingSesi += 1; if (c.mood) h.mood = c.mood; }
      else if (c.type === "sleep") h.sleep = c.value;   // catatan terakhir hari itu menang
      else if (c.type === "weight") h.weight = c.value;
    }

    const h = perHari[hariIni] || { steps: 0, sleep: null, breathingSesi: 0 };
    const capaian = (nilai, target) => ({
      capaian: nilai,
      target,
      persen: Math.min(1, target ? nilai / target : 0)
    });

    const cincin = {
      gerak: { ...capaian(h.steps, DAILY_TARGETS.gerak), satuan: "langkah" },
      tidur: { ...capaian(h.sleep || 0, DAILY_TARGETS.tidur), satuan: "jam" },
      relaksasi: { ...capaian(h.breathingSesi, DAILY_TARGETS.relaksasi), satuan: "sesi" }
    };
    cincin.targetTercapai = ["gerak", "tidur", "relaksasi"].filter((k) => cincin[k].persen >= 1).length;

    const hari = Object.values(perHari);
    const jumlah = (ambil) => hari.reduce((t, x) => t + (ambil(x) || 0), 0);
    const rata = (ambil) => {
      const isi = hari.map(ambil).filter((v) => v !== null && v !== undefined);
      return isi.length ? Number((isi.reduce((t, v) => t + v, 0) / isi.length).toFixed(1)) : 0;
    };

    res.json({
      hariIni,
      cincin,
      tujuhHari: {
        totalLangkah: jumlah((x) => x.steps),
        rataTidur: rata((x) => x.sleep),
        totalOlahraga: jumlah((x) => x.exercise),
        rataAir: rata((x) => x.water),
        totalMenitPernapasan: jumlah((x) => x.breathingMenit),
        jumlahHariTercatat: hari.length
      }
    });
  })
);

// ---------- riwayat ----------
router.get(
  "/",
  bungkus(async (req, res) => {
    const { type, from, to } = req.query;
    const filter = { userId: req.user._id };

    if (type) {
      if (!ACTIVITY_TYPES.includes(type)) throw galatKlien(400, `Jenis catatan "${type}" tidak dikenal.`);
      filter.type = type;
    }
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to) filter.date.$lte = to;
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const perPage = Math.min(100, parseInt(req.query.perPage, 10) || 30);

    const [daftar, total] = await Promise.all([
      HealthLog.find(filter).sort({ loggedAt: -1 }).skip((page - 1) * perPage).limit(perPage),
      HealthLog.countDocuments(filter)
    ]);

    // Dikelompokkan per tanggal, persis seperti tampilan riwayat di aplikasi.
    const kelompok = [];
    for (const c of daftar) {
      let k = kelompok.find((x) => x.date === c.date);
      if (!k) { k = { date: c.date, catatan: [] }; kelompok.push(k); }
      k.catatan.push(bentukCatatan(c));
    }

    res.json({ kelompok, total, halaman: page, perHalaman: perPage });
  })
);

// ---------- catat satu aktivitas, semua jenis lewat pintu yang sama ----------
// Latihan pernapasan tidak punya endpoint sendiri. Yang membedakannya hanya dua
// aturan validasi yang sudah menempel pada jenisnya: nilai harus 1, 3, atau 5 menit,
// dan hanya jenis ini yang boleh menyertakan mood.
router.post(
  "/",
  bungkus(async (req, res) => {
    const { type, value, mood, note, loggedAt } = req.body || {};

    if (!ACTIVITY_TYPES.includes(type)) {
      throw galatKlien(400, `Jenis catatan harus salah satu dari: ${ACTIVITY_TYPES.join(", ")}.`);
    }

    const nilai = validateValue(type, value);
    if (nilai.pesan) throw galatKlien(400, nilai.pesan);

    const hasilMood = validateMood(type, mood);
    if (hasilMood.pesan) throw galatKlien(400, hasilMood.pesan);

    const waktu = loggedAt ? new Date(loggedAt) : new Date();
    if (Number.isNaN(waktu.getTime())) throw galatKlien(400, "Waktu pencatatan tidak terbaca.");

    const catatan = await HealthLog.create({
      userId: req.user._id,
      type,
      value: nilai.value,
      mood: hasilMood.mood,
      note: note ? String(note).trim() : "",
      loggedAt: waktu,
      date: dateKey(waktu)
    });

    res.status(201).json({ catatan: bentukCatatan(catatan) });
  })
);

// ---------- ubah dan hapus ----------
router.put(
  "/:id",
  bungkus(async (req, res) => {
    const { value, note, mood } = req.body || {};
    const catatan = await HealthLog.findOne({ _id: req.params.id, userId: req.user._id });
    // 404, bukan 403 — keberadaan catatan milik orang lain tidak boleh bocor.
    if (!catatan) throw galatKlien(404, "Catatan tidak ditemukan.");

    // Aturan validasi yang sama persis dengan saat membuat. Jenis catatan tidak
    // bisa diubah — mengubah jenis sama saja membuat catatan baru.
    if (value !== undefined) {
      const nilai = validateValue(catatan.type, value);
      if (nilai.pesan) throw galatKlien(400, nilai.pesan);
      catatan.value = nilai.value;
    }
    if (note !== undefined) catatan.note = String(note).trim();
    if (mood !== undefined) {
      const hasilMood = validateMood(catatan.type, mood);
      if (hasilMood.pesan) throw galatKlien(400, hasilMood.pesan);
      catatan.mood = hasilMood.mood;
    }

    await catatan.save();
    res.json({ catatan: bentukCatatan(catatan) });
  })
);

router.delete(
  "/:id",
  bungkus(async (req, res) => {
    const hasil = await HealthLog.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (hasil.deletedCount === 0) throw galatKlien(404, "Catatan tidak ditemukan.");
    res.json({ pesan: "Catatan dihapus." });
  })
);

module.exports = router;
