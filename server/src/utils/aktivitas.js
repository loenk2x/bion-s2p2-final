// Satu-satunya tempat jenis aktivitas didefinisikan.
// Nama, satuan, dan targetnya dipakai bersama oleh validasi, agregasi, dan feeder.

const AKTIVITAS = {
  steps:     { nama: "Langkah",            satuan: "langkah", desimal: false, cara: "jumlah" },
  exercise:  { nama: "Olahraga",           satuan: "menit",   desimal: false, cara: "jumlah" },
  water:     { nama: "Air minum",          satuan: "gelas",   desimal: false, cara: "jumlah" },
  sleep:     { nama: "Tidur",              satuan: "jam",     desimal: true,  cara: "terakhir" },
  breathing: { nama: "Latihan pernapasan", satuan: "menit",   desimal: false, cara: "jumlah" },
  weight:    { nama: "Berat badan",        satuan: "kg",      desimal: true,  cara: "terakhir" }
};

const JENIS = Object.keys(AKTIVITAS);

// Jenis yang boleh masuk lewat POST /api/logs. Latihan pernapasan sengaja dikecualikan
// supaya durasinya hanya bisa lahir dari sesi yang benar-benar dijalani.
const JENIS_MANUAL = JENIS.filter((j) => j !== "breathing");

const DURASI_SESI_NAPAS = [1, 3, 5];

const TARGET_HARIAN = {
  gerak: 10000,     // langkah
  tidur: 8,         // jam
  relaksasi: 3      // sesi
};

const MOOD = {
  1: "Buruk",
  2: "Kurang",
  3: "Biasa saja",
  4: "Senang"
};

// Tanggal lokal dalam bentuk YYYY-MM-DD, dipakai sebagai kunci pengelompokan.
function tanggalKunci(waktu = new Date()) {
  const d = new Date(waktu);
  const bulan = String(d.getMonth() + 1).padStart(2, "0");
  const hari = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${bulan}-${hari}`;
}

function tanggalMundur(jumlahHari) {
  const d = new Date();
  d.setDate(d.getDate() - jumlahHari);
  return d;
}

module.exports = {
  AKTIVITAS,
  JENIS,
  JENIS_MANUAL,
  DURASI_SESI_NAPAS,
  TARGET_HARIAN,
  MOOD,
  tanggalKunci,
  tanggalMundur
};
