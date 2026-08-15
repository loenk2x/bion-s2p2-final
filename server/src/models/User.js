const mongoose = require("mongoose");

const skemaUser = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Format email tidak benar"]
    },
    passwordHash: { type: String, required: true, select: false },
    bio: { type: String, default: "", maxlength: 200 }
  },
  { timestamps: true }
);

// Bentuk aman untuk dikirim ke klien. passwordHash tidak pernah ikut.
skemaUser.methods.keBentukPublik = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    bio: this.bio,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model("User", skemaUser);
