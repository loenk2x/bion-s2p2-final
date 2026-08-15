// Satu-satunya tempat jenis aktivitas didefinisikan.
// Nama, satuan, dan targetnya dipakai bersama oleh validasi, agregasi, dan feeder.

// Tiap jenis membawa aturan validasinya sendiri:
//   desimal   — boleh pecahan atau harus bulat
//   nilaiSah  — kalau ada, nilainya harus salah satu dari daftar ini
//   pakaiMood — hanya jenis ini yang boleh menyertakan mood
//   cara      — bagaimana angka sehari dihitung saat diagregasi
const AKTIVITAS = {
  steps:     { nama: "Langkah",            satuan: "langkah", desimal: false, cara: "jumlah" },
  exercise:  { nama: "Olahraga",           satuan: "menit",   desimal: false, cara: "jumlah" },
  water:     { nama: "Air minum",          satuan: "gelas",   desimal: false, cara: "jumlah" },
  sleep:     { nama: "Tidur",              satuan: "jam",     desimal: true,  cara: "terakhir" },
  breathing: { nama: "Latihan pernapasan", satuan: "menit",   desimal: false, cara: "jumlah",
               nilaiSah: [1, 3, 5], pakaiMood: true },
  weight:    { nama: "Berat badan",        satuan: "kg",      desimal: true,  cara: "terakhir" }
};

const JENIS = Object.keys(AKTIVITAS);

const DURASI_SESI_NAPAS = AKTIVITAS.breathing.nilaiSah;

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

// Satu pintu validasi nilai untuk semua jenis. Dipakai saat membuat maupun mengubah
// catatan, supaya aturannya tidak pernah berbeda antara keduanya.
// Mengembalikan { nilai } kalau lolos, atau { pesan } kalau ditolak.
function periksaNilai(type, nilaiMentah) {
  const info = AKTIVITAS[type];
  if (!info) return { pesan: `Jenis catatan harus salah satu dari: ${JENIS.join(", ")}.` };

  const nilai = Number(nilaiMentah);
  if (!Number.isFinite(nilai) || nilai < 0) {
    return { pesan: "Nilai catatan harus angka nol atau lebih." };
  }
  if (!info.desimal && !Number.isInteger(nilai)) {
    return { pesan: `${info.nama} harus berupa angka bulat.` };
  }
  if (info.nilaiSah && !info.nilaiSah.includes(nilai)) {
    return { pesan: `${info.nama} hanya menerima nilai ${info.nilaiSah.join(", ")} ${info.satuan}.` };
  }
  return { nilai };
}

// Mood hanya boleh menempel pada jenis yang memang menanyakannya di akhir sesi.
function periksaMood(type, mood) {
  if (mood === undefined || mood === null) return { mood: null };
  if (!AKTIVITAS[type] || !AKTIVITAS[type].pakaiMood) {
    return { pesan: `Mood hanya dicatat pada ${AKTIVITAS.breathing.nama}, tidak pada jenis lain.` };
  }
  const angka = Number(mood);
  if (![1, 2, 3, 4].includes(angka)) {
    return { pesan: "Mood harus angka 1 sampai 4, atau dikosongkan." };
  }
  return { mood: angka };
}

module.exports = {
  AKTIVITAS,
  JENIS,
  DURASI_SESI_NAPAS,
  periksaNilai,
  periksaMood,
  TARGET_HARIAN,
  MOOD,
  tanggalKunci,
  tanggalMundur
};
