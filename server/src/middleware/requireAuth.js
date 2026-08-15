const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Locks down every content and personal-data route. Without a valid token, the
// request stops right here — not just hidden in the UI.
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ pesan: "Silakan masuk dulu untuk membuka konten." });
    }

    const token = header.slice(7).trim();
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ pesan: "Sesi Anda sudah berakhir. Silakan masuk lagi." });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ pesan: "Akun tidak ditemukan." });
    }

    // Identity comes ONLY from the token. Any userId sent by the client is ignored.
    req.user = user;
    next();
  } catch (galat) {
    next(galat);
  }
}

module.exports = { requireAuth };
