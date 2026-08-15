// Penanganan galat terpusat. Pesan yang keluar selalu Bahasa Indonesia dan
// menyebut apa yang harus dilakukan, bukan sekadar "tidak valid".

function tidakDitemukan(req, res) {
  res.status(404).json({ pesan: `Alamat ${req.method} ${req.originalUrl} tidak ada.` });
}

function tanganiGalat(galat, req, res, _next) {
  if (galat.name === "ValidationError") {
    const rincian = Object.values(galat.errors).map((e) => e.message);
    return res.status(400).json({ pesan: "Isian belum benar.", rincian });
  }

  if (galat.code === 11000) {
    const kolom = Object.keys(galat.keyPattern || {});
    if (kolom.includes("email")) {
      return res.status(409).json({ pesan: "Email itu sudah terdaftar. Silakan masuk." });
    }
    return res.status(409).json({ pesan: "Data itu sudah ada." });
  }

  if (galat.name === "CastError") {
    return res.status(400).json({ pesan: "Id yang dikirim tidak berbentuk benar." });
  }

  const status = galat.status || 500;
  const pesan = status === 500 ? "Terjadi galat di server." : galat.message;

  if (status === 500) {
    console.error("[galat]", galat);
  }

  res.status(status).json({ pesan });
}

// Membungkus handler async supaya galatnya sampai ke tanganiGalat tanpa try/catch berulang.
const bungkus = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function galatKlien(status, pesan) {
  const e = new Error(pesan);
  e.status = status;
  return e;
}

module.exports = { tidakDitemukan, tanganiGalat, bungkus, galatKlien };
