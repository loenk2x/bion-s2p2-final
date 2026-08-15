# Rencana aplikasi mobile Expo

Dokumen ini adalah peta pengerjaan aplikasi React Native untuk Healthy Life.
Bobotnya 15% dari penilaian, dan sampai dokumen ini ditulis belum ada satu pun
berkas di `mobile/`.

Server, aplikasi web, dan lapisan `shared/` sudah selesai. Aplikasi mobile
dibangun **di atas** ketiganya, bukan di sampingnya.

---

## 1. Kenapa `shared/` menentukan bentuk pekerjaan ini

`shared/` sengaja dibuat supaya logika tidak ditulis dua kali. Komponen React
tidak bisa dipakai ulang di React Native karena tidak ada `div` dan tidak ada
CSS — tapi seluruh logika di bawahnya bisa.

Artinya, pembagian kerjanya sudah ditentukan sejak awal:

- **Sudah ada di `shared/`, tinggal diimpor.** Jangan ditulis ulang.
- **Harus ditulis baru di `mobile/`.** Hanya tampilan: `View`, `Text`,
  `StyleSheet`, navigasi, dan penyimpanan token.

Kalau saat mengerjakan muncul godaan menyalin sepotong logika dari `web/` ke
`mobile/`, itu tanda logikanya seharusnya naik ke `shared/` — bukan disalin.

### Yang sudah tersedia di `shared/`

| Modul | Yang diekspor | Dipakai untuk |
|---|---|---|
| `@shared/api` | `createApi({ baseUrl, onUnauthorized })`, `ApiError` | seluruh panggilan server, 20 endpoint sudah terbungkus |
| `@shared/AuthProvider` | `AuthProvider({ api, setToken, storage, children })`, `useAuth()` | keadaan login, `storage` disuntikkan dari luar |
| `@shared/activities` | `ACTIVITIES`, `ACTIVITY_TYPES`, `ADD_MENU_ORDER`, `BREATHING_DURATIONS`, `MOODS`, `moodByValue`, `keypadFor`, `validateValue` | enam jenis aktivitas, aturan validasi, urutan menu tambah |
| `@shared/activityColors` | `ACTIVITY_COLORS`, `activityColorVar`, `activityColorHex` | warna per jenis aktivitas |
| `@shared/categories` | `CATEGORIES`, `CATEGORY_SLUGS`, `categoryLabel`, `CONTENT_TYPES`, `contentTypeLabel`, `contentCardMeta` | lima kategori dan tiga tipe konten |
| `@shared/format` | `formatInteger`, `formatDecimal`, `formatActivityValue`, `formatLongDate`, `formatShortDate`, `formatTime`, `formatDateGroupHeading`, `firstName` | seluruh format angka dan tanggal |
| `@shared/rings` | `RING_CANVAS`, `RING_AXES`, `MIN_RADIUS_RATIO`, `achievementRadius`, `PULSE_DELAYS`, `buildRings` | perhitungan geometri cincin harian |
| `@shared/avatar` | `initialsOf`, `avatarColor` | avatar inisial di profil |
| `@shared/markdown` | `parseMarkdown` | isi artikel di halaman detail |
| `@shared/register` | `MIN_PASSWORD_LENGTH`, `validateName`, `validateEmail`, `validatePassword`, `validateConfirmPassword` | validasi form registrasi |

Dua catatan pemakaian yang gampang keliru:

- **`activityColorHex`, bukan `activityColorVar`.** React Native tidak mengenal
  CSS custom property. Kembaran hex-nya memang disediakan untuk keperluan ini.
- **`keypadFor(type)` mengembalikan `"decimal"` atau `"integer"`.** Di web nilai
  itu dipetakan ke `inputMode`; di React Native dipetakan ke `keyboardType`
  (`"decimal-pad"` dan `"number-pad"`). Pemetaannya ditulis di `mobile/`, bukan
  di `shared/`.

---

## 2. Jebakan terpenting: Metro tidak mengikuti berkas di luar folder proyek

Ini satu-satunya hal yang bisa menggagalkan seluruh rencana kalau salah.

`shared/` berada di akar repositori, di **luar** `mobile/`. Metro (bundler React
Native) secara bawaan hanya mengawasi berkas di dalam folder proyek. Tanpa
konfigurasi, `import { createApi } from "@shared/api"` akan gagal.

`mobile/metro.config.js` harus menyetel tiga hal:

1. `watchFolders` menunjuk ke akar repositori, supaya Metro membaca `shared/`
2. `resolver.nodeModulesPaths` menyertakan `node_modules` milik `mobile/`
3. `resolver.extraNodeModules` memetakan `@shared` ke folder `shared/`

Godaan yang harus ditolak: **menyalin `shared/` ke dalam `mobile/`.** Itu
membuat bundler senang dan menghapus seluruh alasan folder itu dibuat. Dua
salinan akan berbeda dalam hitungan hari.

Cara membuktikan konfigurasinya benar dijelaskan di Langkah 1.

---

## 3. Delapan layar, mengikuti aplikasi web

Syarat tugas minimal 4 halaman. Aplikasi web punya 8, dan mobile mengikuti
daftar yang sama supaya keduanya bisa dibandingkan saat dinilai.

| Layar mobile | Padanan di web | Isi |
|---|---|---|
| Landing | `web/src/pages/Landing.jsx` | halaman depan sebelum login, teaser konten |
| Register | `Register.jsx` | daftar akun baru |
| Masuk | `SignIn.jsx` | login |
| Beranda | `Home.jsx` | cincin harian, ringkasan, daftar konten, filter kategori |
| Detail konten | `ContentDetail.jsx` | isi artikel/video/infografis, tombol simpan |
| Favorit | `Favorites.jsx` | konten tersimpan |
| Catatan | `DailyLog.jsx` | riwayat aktivitas per tanggal, tambah catatan, sesi pernapasan |
| Profil | `Profile.jsx` | data diri, ganti password, keluar |

Registrasi dan login **wajib** sebelum seluruh fitur dan konten bisa diakses.
Itu syarat tugas, bukan pilihan desain. Tiga layar pertama terbuka; lima
sisanya di belakang login.

Sumber tata letak: `design/mockups.html`, berkas `design/figma-*.html`, dan
berkas Figma `OjkPfDShLvVgz3P05YFqrQ` halaman Mobile. Warna diambil dari
`web/src/styles/tokens.css`, jangan ditebak.

---

## 4. Delapan langkah pengerjaan

Satu langkah satu commit. Langkah 1 dikerjakan sampai terbukti jalan sebelum
apa pun yang lain dimulai.

**Langkah 1 — kerangka Expo dan pembuktian impor `shared/`.**
Buat proyek Expo di `mobile/`, tulis `metro.config.js`, lalu **buktikan** impor
lintas folder benar-benar jalan: impor satu nilai dari `@shared/activities`
(misalnya `ACTIVITY_TYPES`) dan tampilkan di layar, lalu jalankan bundler dan
pastikan tidak ada galat resolusi. Jangan lanjut sebelum ini terbukti.

**Langkah 2 — sambungan API dan keadaan login.**
Tulis `mobile/src/lib/api.js` sebagai kembaran `web/src/lib/api.js`: memanggil
`createApi` dari `@shared/api`, dengan `baseUrl` dari `process.env.EXPO_PUBLIC_API_URL`
dan penyimpanan token pakai `expo-secure-store`. Lalu pasang `AuthProvider` dari
`@shared/AuthProvider` dengan `storage` yang menunjuk ke penyimpanan itu.

Perhatikan: perangkat fisik **tidak bisa** menghubungi `localhost` — itu merujuk
ke perangkat itu sendiri, bukan ke komputer yang menjalankan server. Base URL
harus alamat IP komputer di jaringan lokal.

**Langkah 3 — kerangka navigasi.**
Stack untuk layar sebelum login, bottom tab untuk lima layar setelah login.
Nama rute Bahasa Indonesia, sama seperti web (`beranda`, `favorit`, `catatan`,
`profil`). Komponen `Bottom tab` sudah ada di Figma — ikuti bentuknya.

**Langkah 4 — Landing, Register, Masuk.**
Validasi form registrasi memakai empat validator dari `@shared/register`,
jangan menulis aturan baru.

**Langkah 5 — Beranda dan cincin harian.**
Cincin digambar dengan `react-native-svg`. Seluruh perhitungan geometrinya sudah
ada di `@shared/rings` — `buildRings`, `achievementRadius`, `RING_AXES`,
`MIN_RADIUS_RATIO`. Yang ditulis baru hanya elemen `<Svg>` dan `<Circle>`.

Animasi denyut: 1 → 1,045 selama 3,6 detik dengan jeda `PULSE_DELAYS`, dan
**mati** kalau pengguna menyalakan pengurangan gerak di setelan sistem
(`AccessibilityInfo.isReduceMotionEnabled`). Perilaku ini sudah ada di web dan
harus sama di mobile.

**Langkah 6 — Detail konten.**
Isi artikel dirender dari `parseMarkdown` di `@shared/markdown`. Pengurainya
hanya menangani heading `##`, list `- `, dan paragraf — itu memang batasnya,
jangan diperluas di langkah ini. Tombol simpan memanggil `addFavorite` dan
`removeFavorite`.

**Langkah 7 — Favorit dan Catatan.**
Termasuk lembar tambah catatan dan sesi latihan pernapasan. Enam jenis aktivitas
diambil dari `ACTIVITIES` dan urutan menunya dari `ADD_MENU_ORDER`. Validasi
nilai memakai `validateValue`, yang mengembalikan `{ value }` kalau diterima
atau `{ message }` kalau ditolak.

Mood **bukan** jenis aktivitas tersendiri — ia hanya field pada catatan
`breathing`, dan hanya jenis itu yang boleh menyertakannya. Server akan menolak
mood pada jenis lain.

**Langkah 8 — Profil.**
Avatar inisial dari `initialsOf` dan `avatarColor`. Ganti password mengirim
field `passwordLama` dan `passwordBaru` — dua nama itu bagian dari kontrak API,
bukan pilihan penamaan.

---

## 5. Yang tidak boleh diubah

**Nama field JSON API.** Aplikasi web sudah dibangun di atas kontrak ini, dan
mobile memakai kontrak yang sama: `pesan`, `konten`, `catatan`, `kelompok`,
`cincin`, `disimpan`, `disimpanPada`, `favorit`, `halaman`, `perHalaman`,
`totalHalaman`, `hariIni`, `tujuhHari`, `totalLangkah`, `rataTidur`,
`totalOlahraga`, `rataAir`, `totalMenitPernapasan`, `jumlahHariTercatat`,
`capaian`, `target`, `persen`, `targetTercapai`, `gerak`, `tidur`, `relaksasi`,
`namaJenis`, `namaMood`, `satuan`, `kategori`, `jumlah`, `aktivitas`,
`durasiSesiNapas`, `targetHarian`, `mood`, `waktu`, `rincian`. Field permintaan
`passwordLama` dan `passwordBaru`. Path `/api/aktivitas` tetap begitu.

**Berkas di luar `mobile/`.** `server/`, `web/`, `design/` tidak disentuh.
Berkas `shared/` yang sudah ada tidak diubah.

**Aturan bahasa.** Kode Bahasa Inggris: identifier, nama fungsi, nama berkas,
komentar. Bahasa Indonesia hanya untuk teks yang dilihat pengguna, nama rute,
dan dokumen seperti berkas ini.

---

## 6. Gerbang mutu

Tiap langkah harus lolos sebelum di-commit:

```
cd mobile && npx expo export --platform android
```

Perintah itu menjalankan bundler sungguhan, jadi galat impor `shared/` akan
ketahuan di situ — berbeda dari sekadar menjalankan `expo start` yang bisa
tampak sehat sampai layarnya dibuka.

Selain itu, `cd web && npm run build` harus tetap lolos. Aplikasi web tidak
disentuh, jadi kalau build-nya rusak berarti ada yang salah menyentuh `shared/`.

---

## 7. Kalau ada logika yang ternyata belum ada di `shared/`

Mungkin terjadi: sebuah aturan ada di `web/` tapi tertinggal di sana, bukan di
`shared/`.

Kalau begitu, **jangan menyalinnya ke `mobile/`.** Laporkan temuannya, lalu
sementara tulis di `mobile/` dengan komentar yang menyebut asalnya. Memindahkan
ke `shared/` berarti menyentuh `web/` juga, dan itu keputusan tersendiri yang
diambil setelah aplikasi mobile jalan.
