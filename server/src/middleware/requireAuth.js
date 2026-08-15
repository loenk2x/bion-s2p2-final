const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Menutup seluruh route konten dan data pribadi. Tanpa token yang sah, permintaan
// berhenti di sini — bukan sekadar disembunyikan di antarmuka.
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ pesan: "Silakan masuk dulu untuk membuka konten." });
    }

    const token = header.slice(7).trim();
    let isi;
    try {
      isi = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ pesan: "Sesi Anda sudah berakhir. Silakan masuk lagi." });
    }

    const user = await User.findById(isi.sub);
    if (!user) {
      return res.status(401).json({ pesan: "Akun tidak ditemukan." });
    }

    // Identitas HANYA berasal dari token. Nilai userId yang dikirim klien diabaikan.
    req.user = user;
    next();
  } catch (galat) {
    next(galat);
  }
}

module.exports = { requireAuth };
