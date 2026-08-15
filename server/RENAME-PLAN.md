# Peta rename identifier server

Dokumen ini memetakan seluruh identifier Bahasa Indonesia di `server/src/` dan
`server/scripts/feed.js`. Ini **bukan** eksekusi rename — hanya peta untuk agen
berikutnya. `scripts/smoke-test.mjs` tidak dipindai karena sudah Bahasa Inggris.

Aturan yang dipakai untuk memutuskan apa yang boleh disentuh: identifier, nama
fungsi, nama berkas, dan komentar berubah ke Bahasa Inggris. String yang
dilihat pengguna, nama field JSON yang dikirim ke klien, dan apa pun yang
sudah tersimpan di database tetap seperti sekarang.

## 1. Berkas yang perlu diganti namanya

Hanya dua berkas yang namanya sendiri berbahasa Indonesia. Berkas model dan
middleware lain sudah punya nama Inggris (`Content.js`, `Favorite.js`,
`HealthLog.js`, `User.js`, `requireAuth.js`, `error.js`, `db.js`), jadi tidak
masuk daftar ini — hanya isinya yang berubah.

- **`src/utils/aktivitas.js` → `src/utils/activities.js`**
  Diimpor oleh: `src/app.js`, `src/models/HealthLog.js`, `src/routes/logs.js`,
  `scripts/feed.js`. Empat berkas ini perlu path impor-nya diperbarui begitu
  berkas ini dipindah namanya.

- **`src/routes/publik.js` → `src/routes/public.js`**
  Diimpor oleh: `src/app.js` (lewat `require("./routes/publik")`, disimpan ke
  variabel lokal `rutePublik`). Satu berkas yang perlu diperbarui.

## 2. Tabel identifier

Diurutkan dari yang paling banyak dipakai di berkas lain (bukan berkas
tempat ia didefinisikan). Untuk identifier yang namanya dipakai ulang secara
independen di beberapa berkas (bukan lewat impor, misalnya `daftar` atau
`hasil` yang muncul sebagai variabel lokal berbeda-beda), lihat catatan di
bawah tabel — tidak dihitung sebagai "dipakai di berkas lain" karena bukan
satu identifier yang sama.

| Nama sekarang | Usulan Inggris | Jenis | Berkas definisi | Dipakai di berkas lain |
|---|---|---|---|---|
| `bungkus` | `asyncHandler` | fungsi | `src/middleware/error.js` | 6 |
| `galatKlien` | `clientError` | fungsi | `src/middleware/error.js` | 4 |
| `AKTIVITAS` | `ACTIVITIES` | konstanta | `src/utils/aktivitas.js` | 2 |
| `JENIS` | `ACTIVITY_TYPES` | konstanta | `src/utils/aktivitas.js` | 2 |
| `TARGET_HARIAN` | `DAILY_TARGETS` | konstanta | `src/utils/aktivitas.js` | 2 |
| `MOOD` | `MOOD_LABELS` | konstanta | `src/utils/aktivitas.js` | 2 |
| `tanggalKunci` | `dateKey` | fungsi | `src/utils/aktivitas.js` | 2 |
| `sambungkanDatabase` | `connectDatabase` | fungsi | `src/config/db.js` | 2 |
| `keKartu` | `toCard` | metode skema Mongoose | `src/models/Content.js` | 2 |
| `namaDatabase` | `databaseName` | variabel (properti hasil balik) | `src/config/db.js` | 2 |
| `tidakDitemukan` | `notFound` | fungsi | `src/middleware/error.js` | 1 |
| `tanganiGalat` | `errorHandler` | fungsi | `src/middleware/error.js` | 1 |
| `requireAuth` | *(sudah Inggris, tidak diganti)* | fungsi | `src/middleware/requireAuth.js` | 2 |
| `DURASI_SESI_NAPAS` | `BREATHING_SESSION_MINUTES` | konstanta | `src/utils/aktivitas.js` | 1 |
| `tanggalMundur` | `daysAgo` | fungsi | `src/utils/aktivitas.js` | 1 |
| `periksaNilai` | `validateValue` | fungsi | `src/utils/aktivitas.js` | 1 |
| `periksaMood` | `validateMood` | fungsi | `src/utils/aktivitas.js` | 1 |
| `keBentukPublik` | `toPublicProfile` | metode skema Mongoose | `src/models/User.js` | 1 (dipakai 4x di berkas itu) |
| `nilai` (properti balik `periksaNilai`) | `value` | variabel/field balik fungsi | `src/utils/aktivitas.js` | 1 |
| `nama` (properti tiap entri `AKTIVITAS`) | `label` | properti konfigurasi | `src/utils/aktivitas.js` | 1 (dibaca di `logs.js` sebagai `info.nama`) |
| `satuan` (properti tiap entri `AKTIVITAS`) | `unit` | properti konfigurasi | `src/utils/aktivitas.js` | 1 (dibaca di `logs.js` sebagai `info.satuan`) |
| `isi` | `payload` | variabel (payload JWT terurai) | `src/middleware/requireAuth.js` | 0 |
| `nilaiSah` | `allowedValues` | properti konfigurasi | `src/utils/aktivitas.js` | 0 |
| `desimal` | `isDecimal` | properti konfigurasi | `src/utils/aktivitas.js` | 0 |
| `pakaiMood` | `hasMood` | properti konfigurasi | `src/utils/aktivitas.js` | 0 |
| `cara` | — | properti konfigurasi, **tidak dipakai di mana pun saat ini** | `src/utils/aktivitas.js` | 0 (mati) |
| `KATEGORI` | `CATEGORIES` | konstanta, **diekspor tapi tidak pernah diimpor** | `src/models/Content.js` | 0 (mati) |
| `TIPE` | `CONTENT_TYPES` | konstanta, **diekspor tapi tidak pernah diimpor** | `src/models/Content.js` | 0 (mati) |
| `skemaContent` | `contentSchema` | variabel | `src/models/Content.js` | 0 |
| `skemaFavorite` | `favoriteSchema` | variabel | `src/models/Favorite.js` | 0 |
| `skemaHealthLog` | `healthLogSchema` | variabel | `src/models/HealthLog.js` | 0 |
| `skemaUser` | `userSchema` | variabel | `src/models/User.js` | 0 |
| `buatToken` | `createToken` | fungsi | `src/routes/auth.js` | 0 (dipakai 2x di berkas itu) |
| `bentukCatatan` | `toLogEntry` | fungsi | `src/routes/logs.js` | 0 (dipakai 4x di berkas itu) |
| `bacaKonten` | `readContentFiles` | fungsi | `scripts/feed.js` | 0 |
| `isiKonten` | `upsertContents` | fungsi | `scripts/feed.js` | 0 |
| `siapkanAkunDemo` | `prepareDemoAccount` | fungsi | `scripts/feed.js` | 0 |
| `DIR_KONTEN` | `CONTENT_DIR` | konstanta | `scripts/feed.js` | 0 |
| `WAJIB` | `REQUIRED_FIELDS` | konstanta | `scripts/feed.js` | 0 |
| `AKUN_DEMO` | `DEMO_ACCOUNT` | konstanta | `scripts/feed.js` | 0 |
| `rutePublik` | `publicRouter` | variabel (alias impor) | `src/app.js` | 0 |
| `ruteAuth` | `authRouter` | variabel (alias impor) | `src/app.js` | 0 |
| `ruteContents` | `contentsRouter` | variabel (alias impor) | `src/app.js` | 0 |
| `ruteFavorites` | `favoritesRouter` | variabel (alias impor) | `src/app.js` | 0 |
| `ruteLogs` | `logsRouter` | variabel (alias impor) | `src/app.js` | 0 |
| `cocok` | `matches` | variabel | `src/routes/auth.js` | 0 (2x di berkas itu) |
| `passwordLama` (destructure `req.body`) | `oldPassword` | parameter/variabel lokal — **field JSON di body tetap `passwordLama`** | `src/routes/auth.js` | 0 |
| `passwordBaru` (destructure `req.body`) | `newPassword` | parameter/variabel lokal — **field JSON di body tetap `passwordBaru`** | `src/routes/auth.js` | 0 |

Catatan tentang nama lokal yang dipakai ulang di banyak berkas secara
independen (bukan diimpor, jadi tidak masuk hitungan tabel di atas, tapi
penting untuk pencarian tanpa pandang bulu saat rename):

- `galat` — nama parameter `catch`/callback di `src/middleware/error.js`,
  `src/middleware/requireAuth.js`, `src/server.js`, dan `scripts/feed.js`
  (di `feed.js` juga dipakai sebagai nama variabel array kumpulan pesan
  galat, terpisah dari parameter `catch` di IIFE-nya). Usulan: `error`.
- `daftar` — variabel lokal di `src/routes/contents.js`,
  `src/routes/favorites.js`, `src/routes/publik.js`. Usulan: `items` atau
  `list` sesuai konteks masing-masing.
- `hasil` — variabel lokal di `src/app.js`, `src/routes/favorites.js`,
  `scripts/feed.js`. Usulan: `result`.
- `kategori` — variabel lokal di `src/routes/publik.js` dan
  `scripts/feed.js` (nama berbeda dari field JSON `kategori` di
  `src/app.js`, lihat bagian 3).
- `konten`, `catatan` — variabel lokal di beberapa berkas rute, dan
  **juga** nama field JSON yang dikirim ke klien. Lihat peringatan di
  bagian 5.

## 3. Yang JANGAN diubah

**Seluruh string pesan berbahasa Indonesia** yang dikirim ke pengguna lewat
`res.json({ pesan: ... })` atau lewat `throw galatKlien(status, "...")` —
misalnya "Konten tidak ditemukan.", "Email atau password salah.",
"Password lama salah.", "Sesi Anda sudah berakhir. Silakan masuk lagi."
Semua ini tetap Bahasa Indonesia karena antarmuka aplikasinya Bahasa
Indonesia.

**Nama field JSON pada balasan API** (respons ke klien) — daftar yang
ditemukan saat pemindaian:
`pesan`, `konten`, `catatan`, `kelompok`, `cincin`, `disimpan`,
`disimpanPada`, `favorit`, `halaman`, `perHalaman`, `totalHalaman`,
`hariIni`, `tujuhHari`, `totalLangkah`, `rataTidur`, `totalOlahraga`,
`rataAir`, `totalMenitPernapasan`, `jumlahHariTercatat`, `capaian`,
`target`, `persen`, `targetTercapai`, `gerak`, `tidur`, `relaksasi`,
`namaJenis`, `namaMood`, `satuan` (sebagai field balasan, terpisah dari
properti konfigurasi internal `satuan` di atas), `kategori` (pada balasan
`GET /api/categories`), `jumlahKonten`, `jumlahKategori`, `aktivitas`,
`durasiSesiNapas`, `targetHarian`, `mood` (sebagai field), `waktu` (pada
`GET /api/health`). Semua field ini tetap seperti sekarang.

**Nama field JSON pada isi permintaan (request body) dari klien** —
`passwordLama` dan `passwordBaru` pada `PUT /api/auth/password`. Ini
sering terlewat karena hanya field balasan yang biasanya diperhatikan,
padahal field permintaan sama-sama bagian dari kontrak dengan `web/`.

**Path route itu sendiri** — khususnya `GET /api/aktivitas` dan
`GET /api/categories`. Path adalah bagian dari kontrak API yang sama
seperti nama field JSON; mengubahnya sama-sama merusak `web/` yang sedang
dibangun di atas kontrak ini.

**Nama field skema Mongoose yang sudah tersimpan di database** —
`passwordHash`, `loggedAt`, `bio`, `note`, semua field `Content` (`slug`,
`title`, `type`, `category`, `excerpt`, `body`, `imageUrl`, `videoId`,
`videoUrl`, `author`, `source`, `readingMinutes`, `tags`, `publishedAt`),
`userId`, `contentId`, `createdAt`, `updatedAt`. Semuanya sudah berbahasa
Inggris, jadi ini bukan pekerjaan rename — hanya penegasan supaya agen
berikutnya tidak menyentuhnya.

**Nilai enum dan slug** — nilai `type` (`article`, `video`, `infographic`),
nilai `type` pada `HealthLog` (`steps`, `exercise`, `water`, `sleep`,
`breathing`, `weight`), dan slug kategori (`pola-hidup-sehat`,
`gizi-seimbang`, `olahraga`, `kesehatan-mental`, `pencegahan-penyakit`).
Slug kategori Bahasa Indonesia ini juga dipakai sebagai bagian dari path
saat filter (`GET /api/contents?category=pola-hidup-sehat`), jadi
sama-sama bagian dari kontrak.

**Label mood** (`"Buruk"`, `"Kurang"`, `"Biasa saja"`, `"Senang"`) dan nama
akun demo (`"Pengguna Demo"`) di `scripts/feed.js` — ini konten yang
dilihat pengguna, bukan identifier kode.

## 4. Usulan urutan pengerjaan

14 langkah, dari berkas yang paling sedikit dipakai berkas lain menuju yang
paling banyak diimpor. Tiap langkah bisa di-commit dan diuji sendiri lewat
`npm run smoke` (dan `npm run feed` khusus langkah yang menyentuh
`scripts/feed.js`).

1. ✅ `scripts/feed.js` — ganti semua identifier internalnya (`bacaKonten`,
   `isiKonten`, `siapkanAkunDemo`, `DIR_KONTEN`, `WAJIB`, `AKUN_DEMO`, dan
   variabel lokalnya). Tidak ada berkas lain yang bergantung padanya.
2. ✅ `src/models/Favorite.js` — ganti `skemaFavorite`. Tanpa dependen.
3. ✅ `src/models/User.js` — ganti `skemaUser` dan `keBentukPublik`, sekaligus
   perbarui 4 titik pemanggilan `keBentukPublik` di `src/routes/auth.js`.
4. ✅ `src/models/Content.js` — ganti `KATEGORI`, `TIPE`, `skemaContent`, dan
   `keKartu`, sekaligus perbarui pemanggilan `keKartu` di
   `src/routes/contents.js` dan `src/routes/favorites.js`.
5. ✅ `src/middleware/requireAuth.js` — ganti `isi` menjadi `payload`. Nama
   fungsi `requireAuth` sudah Inggris, tidak berubah.
6. ✅ `src/config/db.js` — ganti `sambungkanDatabase` dan `namaDatabase`,
   sekaligus perbarui pemanggilnya di `src/server.js` dan `scripts/feed.js`.
7. ✅ `src/utils/aktivitas.js` → pindah jadi `src/utils/activities.js`, ganti
   seluruh isinya (`AKTIVITAS`, `JENIS`, `DURASI_SESI_NAPAS`,
   `TARGET_HARIAN`, `MOOD`, `tanggalKunci`, `tanggalMundur`,
   `periksaNilai`, `periksaMood`, dan properti konfigurasi `nama`,
   `satuan`, `desimal`, `cara`, `nilaiSah`, `pakaiMood`), sekaligus
   perbarui path dan nama impor di `src/app.js`, `src/models/HealthLog.js`,
   `src/routes/logs.js`, dan `scripts/feed.js`. Langkah paling luas
   cakupannya sejauh ini karena diimpor 4 berkas — uji dengan smoke test
   penuh, bukan cuma endpoint logs.
8. ✅ `src/middleware/error.js` — ganti `tidakDitemukan`, `tanganiGalat`,
   `bungkus`, `galatKlien`, `rincian`, `kolom`, sekaligus perbarui 6 berkas
   pengimpor (`src/app.js`, `src/routes/auth.js`, `src/routes/publik.js`,
   `src/routes/favorites.js`, `src/routes/logs.js`,
   `src/routes/contents.js`). Ini identifier dengan sebaran terluas —
   kerjakan sebagai satu commit mekanis, lalu jalankan smoke test penuh
   karena semua endpoint melewati `bungkus`.
9. ✅ `src/routes/publik.js` → pindah jadi `src/routes/public.js`, ganti
   variabel lokalnya (`daftar`, `jumlah`, `kategori`), sekaligus perbarui
   path impor dan nama variabel `rutePublik` di `src/app.js`.
10. `src/routes/auth.js` — ganti `buatToken`, `cocok`, dan nama variabel
    lokal hasil destructure `passwordLama`/`passwordBaru` (field JSON di
    body tetap sama, hanya nama variabel JavaScript-nya yang berubah).
11. `src/routes/contents.js` — ganti variabel lokal (`pola`, `daftar`,
    `idFavorit`, `himpunanFavorit`).
12. `src/routes/favorites.js` — ganti variabel lokal (`daftar`, `ada`,
    `hasil`).
13. `src/routes/logs.js` — berkas paling padat identifier Indonesia.
    Ganti `bentukCatatan` dan seluruh variabel lokal ringkasan (`hariIni`,
    `mulai`, `catatan`, `perHari`, `capaian`, `cincin`, `hari`, `jumlah`,
    `rata`, `kelompok`, `nilai`, `hasilMood`, `waktu`). Perhatikan bagian 5
    — beberapa nama ini dipakai lewat shorthand property jadi field JSON,
    harus diubah jadi mapping eksplisit supaya field balasan tidak ikut
    berubah. Uji `GET /api/logs/summary` secara khusus, bukan cuma smoke
    test umum.
14. `src/app.js` — bereskan sisa alias impor (`ruteAuth`, `ruteContents`,
    `ruteFavorites`, `ruteLogs`) dan terjemahkan komentar. Langkah
    penutup — jalankan smoke test penuh sebagai regresi akhir.

## 5. Jebakan yang perlu diwaspadai

- **Variabel lokal yang namanya sama dengan field JSON lewat shorthand
  property.** Di `src/routes/logs.js`, kode menulis
  `res.json({ kelompok, total, halaman: page, perHalaman: perPage })` dan
  `cincin.targetTercapai = ...` lalu `res.json({ hariIni, cincin, ... })`.
  Kalau variabel `kelompok`, `cincin`, `hariIni` diganti nama tanpa
  mengubah shorthand-nya jadi mapping eksplisit (`kelompok: groups`), field
  JSON yang dikirim ke klien ikut berubah nama dan `web/` yang sedang
  dibangun di atas kontrak ini akan patah. Sama halnya dengan `konten` di
  `src/routes/contents.js` dan `src/routes/publik.js`, dan `catatan` di
  `src/routes/logs.js` (`k.catatan.push(...)`, `res.json({ catatan: ... })`).

- **Kata yang jadi identifier juga muncul sebagai kata biasa di dalam
  pesan Bahasa Indonesia.** Pencarian-dan-ganti buta akan merusak teks
  yang dilihat pengguna. Contoh yang ditemukan saat pemindaian:
  - `galat` → identifier, tapi juga muncul sebagai kata di pesan
    `"Terjadi galat di server."`
  - `nilai` → identifier (properti balik `periksaNilai`), tapi juga muncul
    di pesan `"Nilai catatan harus angka nol atau lebih."` dan
    `` `${info.nama} hanya menerima nilai ${info.nilaiSah.join(", ")} ...` ``
  - `jenis` (huruf kecil, beda dari konstanta `JENIS`) muncul di pesan
    `"Jenis catatan harus salah satu dari: ..."` — rename yang tidak
    peka huruf besar/kecil akan ikut mengubah pesan ini.
  - `konten` dan `catatan` juga muncul di pesan seperti
    `"Konten tidak ditemukan."`, `"Konten disimpan ke favorit."`,
    `"Catatan tidak ditemukan."`, `"Catatan dihapus."` — selain jadi field
    JSON (lihat poin pertama), kata-kata ini juga bagian dari kalimat yang
    harus tetap Bahasa Indonesia.
  - `aktivitas` (huruf kecil) muncul di path `/api/aktivitas` dan field
    balasan `aktivitas` — beda dari konstanta `AKTIVITAS` yang memang
    boleh diganti jadi `ACTIVITIES`. Rename case-insensitive akan merusak
    path dan field ini.
  - `favorit` — field JSON balasan (`GET /api/favorites` mengembalikan
    `{ favorit: [...] }`) padahal path route-nya sendiri sudah Inggris
    (`/api/favorites`). Inkonsistensi ini sudah ada sejak awal dan bukan
    sesuatu yang perlu diperbaiki di tugas rename — hanya perlu diketahui
    supaya tidak dikira salah ketik lalu "diperbaiki" tanpa sengaja.

- **`passwordLama`/`passwordBaru` gampang terlewat.** Berbeda dari field
  balasan yang biasanya jadi fokus utama saat memetakan kontrak API, dua
  nama ini ada di sisi permintaan (request body yang dikirim `web/`).
  Kalau hanya field balasan yang diperiksa sebelum rename, field
  permintaan ini bisa ikut ter-rename tanpa sengaja dan endpoint
  `PUT /api/auth/password` berhenti menerima body dari `web/`.

- **`KATEGORI` dan `TIPE` di `src/models/Content.js` diekspor tapi tidak
  pernah diimpor di tempat lain.** Aman untuk diganti nama tanpa
  memperbarui berkas lain, tapi juga sinyal kalau ekspor ini mungkin sisa
  kode yang tidak terpakai — di luar cakupan tugas rename untuk
  memutuskan apakah dihapus.

- **`galat` dipakai dua kali dengan makna berbeda dalam satu berkas.** Di
  `scripts/feed.js`, `galat` adalah nama variabel array (kumpulan pesan
  validasi konten) di `bacaKonten()`, sekaligus nama parameter `catch` di
  IIFE utama berkas yang sama. Scope-nya beda jadi tidak error, tapi kalau
  cuma satu nama pengganti dipakai untuk keduanya (misalnya sama-sama jadi
  `error`), maksud tiap variabel jadi kurang jelas — pertimbangkan nama
  yang lebih spesifik untuk array-nya, misalnya `validationErrors`.
