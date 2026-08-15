const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { requireAuth } = require("../middleware/requireAuth");
const { asyncHandler, clientError } = require("../middleware/error");

const router = express.Router();

function createToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
}

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      throw clientError(400, "Nama, email, dan password wajib diisi.");
    }
    if (String(password).length < 8) {
      throw clientError(400, "Password minimal 8 karakter.");
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await User.create({ name, email, passwordHash });

    res.status(201).json({ token: createToken(user), user: user.toPublicProfile() });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
      throw clientError(400, "Email dan password wajib diisi.");
    }

    const user = await User.findOne({ email: String(email).toLowerCase() }).select("+passwordHash");
    // Same message for a wrong email or a wrong password, so it can't be used to
    // guess which email is registered.
    const matches = user ? await bcrypt.compare(String(password), user.passwordHash) : false;
    if (!matches) {
      throw clientError(401, "Email atau password salah.");
    }

    res.json({ token: createToken(user), user: user.toPublicProfile() });
  })
);

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user.toPublicProfile() });
});

router.put(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
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
  asyncHandler(async (req, res) => {
    const { passwordLama: oldPassword, passwordBaru: newPassword } = req.body || {};
    if (!oldPassword || !newPassword) {
      throw clientError(400, "Password lama dan password baru wajib diisi.");
    }
    if (String(newPassword).length < 8) {
      throw clientError(400, "Password baru minimal 8 karakter.");
    }

    const user = await User.findById(req.user._id).select("+passwordHash");
    const matches = await bcrypt.compare(String(oldPassword), user.passwordHash);
    if (!matches) {
      throw clientError(401, "Password lama salah.");
    }

    user.passwordHash = await bcrypt.hash(String(newPassword), 10);
    await user.save();
    res.json({ pesan: "Password berhasil diperbarui." });
  })
);

module.exports = router;
