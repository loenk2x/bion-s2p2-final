const mongoose = require("mongoose");
const { JENIS } = require("../utils/aktivitas");

const skemaHealthLog = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true, enum: JENIS },
    value: { type: Number, required: true, min: 0 },
    // Hanya terisi pada catatan breathing, dan boleh kosong kalau pengguna melewati
    // pertanyaan mood di akhir sesi.
    mood: { type: Number, min: 1, max: 4, default: null },
    note: { type: String, default: "", maxlength: 300 },
    loggedAt: { type: Date, required: true },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ }
  },
  { timestamps: true }
);

// Riwayat diurutkan dari catatan terbaru.
skemaHealthLog.index({ userId: 1, loggedAt: -1 });
// Agregasi harian dan ringkasan tujuh hari.
skemaHealthLog.index({ userId: 1, date: 1, type: 1 });

module.exports = mongoose.model("HealthLog", skemaHealthLog);
