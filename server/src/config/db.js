const mongoose = require("mongoose");

async function sambungkanDatabase() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI belum diisi. Salin server/.env.example jadi server/.env lalu isi nilainya.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });

  const { name, host } = mongoose.connection;
  return { namaDatabase: name, host };
}

module.exports = { sambungkanDatabase };
