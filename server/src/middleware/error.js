// Centralized error handling. Outgoing messages are always Bahasa Indonesia and
// say what to do, not just "invalid".

function notFound(req, res) {
  res.status(404).json({ pesan: `Alamat ${req.method} ${req.originalUrl} tidak ada.` });
}

function errorHandler(error, req, res, _next) {
  if (error.name === "ValidationError") {
    const details = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ pesan: "Isian belum benar.", rincian: details });
  }

  if (error.code === 11000) {
    const fields = Object.keys(error.keyPattern || {});
    if (fields.includes("email")) {
      return res.status(409).json({ pesan: "Email itu sudah terdaftar. Silakan masuk." });
    }
    return res.status(409).json({ pesan: "Data itu sudah ada." });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ pesan: "Id yang dikirim tidak berbentuk benar." });
  }

  const status = error.status || 500;
  const pesan = status === 500 ? "Terjadi galat di server." : error.message;

  if (status === 500) {
    console.error("[galat]", error);
  }

  res.status(status).json({ pesan });
}

// Wraps an async handler so its error reaches errorHandler without a repeated try/catch.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function clientError(status, pesan) {
  const e = new Error(pesan);
  e.status = status;
  return e;
}

module.exports = { notFound, errorHandler, asyncHandler, clientError };
