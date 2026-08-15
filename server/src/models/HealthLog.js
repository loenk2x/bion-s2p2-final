const mongoose = require("mongoose");
const { ACTIVITY_TYPES } = require("../utils/activities");

const healthLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true, enum: ACTIVITY_TYPES },
    value: { type: Number, required: true, min: 0 },
    // Only set on breathing entries, and may stay empty when the user skips the
    // mood question at the end of a session.
    mood: { type: Number, min: 1, max: 4, default: null },
    note: { type: String, default: "", maxlength: 300 },
    loggedAt: { type: Date, required: true },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ }
  },
  { timestamps: true }
);

// History is listed newest entry first.
healthLogSchema.index({ userId: 1, loggedAt: -1 });
// Daily aggregation and the seven-day summary.
healthLogSchema.index({ userId: 1, date: 1, type: 1 });

module.exports = mongoose.model("HealthLog", healthLogSchema);
