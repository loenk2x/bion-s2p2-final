const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/requireAuth");
const { bungkus, galatKlien } = require("../middleware/error");

const router = express.Router();

function buatToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

router.post(
  "/register",
  bungkus(async (req, res) => {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      throw galatKlien(400, "Nama, email, dan password wajib diisi.");
    }
    if (String(password).length < 8) {
      throw galatKlien(400, "Password minimal 8 karakter.");
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({ name, email, passwordHash });

    res.status(201).json({ token: buatToken(user), user: user.toPublicProfile() });
  })
);

router.post(
  "/login",
  bungkus(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      throw galatKlien(400, "Email dan password wajib diisi.");
    }

    const user = await User.findOne({ email: String(email).toLowerCase() }).select("+passwordHash");
    // Pesan yang sama untuk email salah maupun password salah, supaya tidak bisa
    // dipakai menebak email mana yang terdaftar.
    const cocok = user ? await bcrypt.compare(String(password), user.passwordHash) : false;
    if (!cocok) {
      throw galatKlien(401, "Email atau password salah.");
    }

    res.json({ token: buatToken(user), user: user.toPublicProfile() });
  })
);

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user.toPublicProfile() });
});

router.put(
  "/me",
  requireAuth,
  bungkus(async (req, res) => {
    const { name, bio } = req.body || {};
    if (name !== undefined) req.user.name = String(name).trim();
    if (bio !== undefined) req.user.bio = String(bio).trim();
    await req.user.save();
    res.json({ user: req.user.toPublicProfile() });
  })
);

router.put(
  "/password",
  requireAuth,
  bungkus(async (req, res) => {
    const { passwordLama, passwordBaru } = req.body || {};
    if (!passwordLama || !passwordBaru) {
      throw galatKlien(400, "Password lama dan password baru wajib diisi.");
    }
    if (String(passwordBaru).length < 8) {
      throw galatKlien(400, "Password baru minimal 8 karakter.");
    }

    const user = await User.findById(req.user._id).select("+passwordHash");
    const cocok = await bcrypt.compare(String(passwordLama), user.passwordHash);
    if (!cocok) {
      throw galatKlien(401, "Password lama salah.");
    }

    user.passwordHash = await bcrypt.hash(String(passwordBaru), 10);
    await user.save();
    res.json({ pesan: "Password berhasil diperbarui." });
  })
);

module.exports = router;
