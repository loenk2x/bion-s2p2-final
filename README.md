# Healthy Life

Healthy Life adalah aplikasi edukasi kesehatan untuk tugas Final LO4. Aplikasi ini
menyediakan artikel, video, dan infografis seputar lima topik kesehatan — pola hidup
sehat, gizi seimbang, olahraga, kesehatan mental, dan pencegahan penyakit — serta
fitur pencatatan aktivitas harian: langkah, olahraga, air minum, tidur, latihan
pernapasan, dan berat badan.

Registrasi dan login wajib sebelum seluruh fitur dan konten bisa diakses.

Diagram alur aplikasinya ada di `design/alur-aplikasi.png`.

## Empat bagian, semuanya sudah jalan

| Bagian | Keadaan |
|---|---|
| Desain UI/UX | Design system, mockup, dan berkas Figma berisi 13 komponen, 15 frame mobile, 8 frame web |
| Aplikasi web | 8 halaman, React 18 + Vite 5 |
| Aplikasi mobile | 8 layar, Expo SDK 54 + React Native |
| Server dan database | 20 route Express, MongoDB Atlas berisi 20 konten |

## Struktur monorepo

```
Final LO4/
├── content/          20 berkas JSON konten, sumber data untuk feeder
│   ├── gizi-seimbang/
│   ├── kesehatan-mental/
│   ├── olahraga/
│   ├── pencegahan-penyakit/
│   └── pola-hidup-sehat/
├── design/           design system, mockup, diagram alur, berkas siap impor Figma
│   ├── design-system.md
│   ├── mockups.html            sumber kebenaran tata letak
│   ├── alur-aplikasi.html/.png diagram alur aplikasi
│   ├── cincin-harian.html      purwarupa animasi cincin harian
│   ├── build-css.mjs           membangkitkan web/src/styles/komponen.css
│   ├── build-figma.mjs         membangkitkan design/figma/
│   └── figma/                  25 berkas siap impor
├── shared/           logika lintas platform, dipakai web dan mobile
├── server/           Express 4 + Mongoose 8 + JWT, port 4000
│   ├── scripts/feed.js
│   └── src/
├── web/              React 18 + Vite 5 + React Router 6, port 5173
│   └── src/
├── mobile/           Expo SDK 54 + React Native, Metro di port 8081
│   ├── metro.config.js
│   └── src/
├── docker-compose.yml
├── render.yaml
└── README.md
```

## Folder `shared/` dan kenapa ia ada

Komponen React tidak bisa dipakai ulang di React Native — tidak ada `div`, tidak ada
CSS. Tapi logika di bawahnya bisa. `shared/` adalah tempat logika itu, supaya tidak
ditulis dua kali dan tidak berbeda diam-diam antara web dan mobile.

Sepuluh modul di dalamnya:

| Modul | Isi |
|---|---|
| `api.js` | `createApi()`, membungkus seluruh 20 endpoint. Token disimpan di memori |
| `AuthProvider.jsx` | Keadaan login. React murni, tanpa DOM |
| `activities.js` | Enam jenis aktivitas, aturan validasi, urutan menu tambah |
| `activityColors.js` | Warna per jenis aktivitas, pasangan CSS variable dan hex |
| `categories.js` | Lima kategori dan tiga tipe konten |
| `format.js` | Format angka dan tanggal, ditulis manual tanpa `Intl` |
| `rings.js` | Perhitungan geometri cincin harian |
| `avatar.js` | Inisial dan warna avatar |
| `markdown.js` | Pengurai Markdown, mengembalikan struktur data |
| `register.js` | Aturan validasi form registrasi |

Aturan yang menjaga folder ini tetap berguna: **tidak boleh ada JSX elemen HTML,
impor `.css`, `window`, `document`, `localStorage`, atau API khusus Node.** Hal-hal
yang khas platform ditulis di sisi masing-masing — misalnya penyimpanan token, yang
memakai `localStorage` di web dan `expo-secure-store` di mobile.

Dua modul menyediakan nilai warna dua kali, sebagai CSS custom property dan sebagai
hex. React Native tidak mengenal CSS variable, jadi kembaran hex-nya memang untuk
keperluan itu. Di React Native pakai `activityColorHex`, bukan `activityColorVar`.

## Menjalankan tanpa Docker

1. Salin `server/.env.example` menjadi `server/.env`, lalu isi `MONGO_URI` dengan
   alamat cluster MongoDB Atlas dan `JWT_SECRET` dengan string acak.
2. Di folder `server/`: `npm install`, lalu `npm run feed` untuk mengisi database
   dan menyiapkan akun demo, lalu `npm run dev`.
3. Di folder `web/`: `npm install`, lalu `npm run dev`.

## Menjalankan dengan Docker

Siapkan `server/.env` seperti di atas, lalu dari akar repositori:

```bash
docker compose up --build
```

Server tersedia di `http://localhost:4000`, aplikasi web di `http://localhost:5173`.

Tiga hal yang perlu diketahui soal setup Docker ini:

- **`shared/` dipetakan terpisah.** Build context layanan `web` hanya `./web`, jadi
  `shared/` tidak ikut masuk sendiri. `docker-compose.yml` memetakannya ke `/shared`
  di dalam kontainer, sesuai alias `@shared` di `web/vite.config.js`.
- **Hot reload aplikasi web tidak jalan.** Bind mount Windows tidak mengirim event
  perubahan berkas ke Vite. Setelah mengubah berkas di `web/`, jalankan
  `docker restart finallo4-web-1` supaya berkasnya dibaca ulang.
- **Zona waktu kontainer disetel `Asia/Jakarta`.** Image Node tidak menyetel zona
  waktu, jadi prosesnya berjalan di UTC. Kunci tanggal catatan harian dibentuk dari
  waktu lokal proses, sehingga tanpa setelan ini catatan yang dibuat antara pukul
  00.00 dan 07.00 WIB akan tercatat di tanggal kemarin. Setelan yang sama ada di
  `render.yaml`.

Database tidak ikut dalam `docker-compose.yml` karena Healthy Life memakai MongoDB
Atlas, bukan MongoDB yang dijalankan sendiri.

Expo sengaja tidak dimasukkan Docker. Metro, server pengembangan Expo, perlu
dihubungi langsung oleh HP lewat jaringan lokal yang sama. Docker Desktop di Windows
tidak menyediakan mode jaringan host, jadi HP tidak bisa mencapai Metro yang berjalan
di dalam kontainer.

## Menjalankan aplikasi mobile lewat Expo Go

1. Salin `mobile/.env.example` menjadi `mobile/.env`, lalu isi `EXPO_PUBLIC_API_URL`
   dengan alamat IP jaringan lokal komputer, misalnya `http://192.168.1.5:4000`.
   **Bukan `localhost`** — bagi HP, `localhost` berarti HP itu sendiri. Cari alamat
   IP lewat `ipconfig`, lihat IPv4 Address pada adapter Wi-Fi yang sedang dipakai.
2. Di folder `mobile/`: `npm install`, lalu `npx expo start`.
3. Pindai QR code dengan Expo Go. HP dan komputer harus di Wi-Fi yang sama.

Jalankan `npx expo start` di terminal sungguhan, bukan lewat proses latar belakang.
Expo CLI hanya mencetak QR code kalau keluarannya terhubung ke terminal.

**Versi SDK tidak boleh dinaikkan sembarangan.** Expo Go hanya mendukung satu versi
SDK per rilis aplikasinya. Proyek ini dipatok di **SDK 54.0.36** karena itu yang
didukung Expo Go yang dipakai menguji. `create-expo-app` mengambil versi `latest`
secara bawaan, jadi proyek baru akan lahir di SDK yang lebih tinggi dan tidak bisa
dibuka Expo Go yang sama.

### Metro dan `shared/`

`shared/` berada di luar folder `mobile/`, sementara Metro secara bawaan hanya
mengawasi berkas di dalam folder proyek. `mobile/metro.config.js` menjembatani ini
dengan `watchFolders` ke akar repositori dan `resolver.resolveRequest` khusus.

`resolver.extraNodeModules` **tidak** cukup untuk memetakan `@shared`. Metro mengurai
`@shared/activities` sebagai satu nama paket berskop — aturan yang sama dipakai npm
untuk `@scope/nama` — bukan sebagai paket `@shared` dengan subpath `activities`, jadi
pemetaannya tidak pernah terpanggil. Alasan lengkapnya ditulis di komentar berkas itu.

Godaan yang harus ditolak kalau Metro gagal menemukan `shared/`: menyalin foldernya
ke dalam `mobile/`. Itu memuaskan bundler sekaligus menghapus seluruh alasan folder
itu dibuat.

## Akun demo

Dibuat otomatis oleh `npm run feed`, didefinisikan di `server/scripts/feed.js`:

- Email: `demo@healthylife.id`
- Password: `demo12345`

Akun ini sudah punya empat konten favorit dan catatan aktivitas harian selama tujuh
hari terakhir, tersebar di enam jenis aktivitas.

## Delapan halaman

Alamat rute sama di web dan mobile. Tiga yang pertama terbuka, lima sisanya di
belakang login.

| Halaman | Rute | Isi |
|---|---|---|
| Landing | `/` | Cuplikan konten, tanpa isi penuh |
| Register | `/daftar` | Nama, email, password minimal 8 karakter |
| Masuk | `/masuk` | Menukar email dan password jadi token |
| Beranda | `/beranda` | Cincin harian, cari, filter kategori dan tipe, daftar konten |
| Detail konten | `/konten/:slug` | Artikel, video, atau infografis, tombol simpan |
| Favorit | `/favorit` | Konten tersimpan, geser kiri untuk hapus |
| Catatan | `/catatan` | Riwayat per tanggal, tambah catatan, sesi latihan pernapasan |
| Profil | `/profil` | Data diri, ganti password, keluar |

## Daftar endpoint

Base URL: `http://localhost:4000`. Kolom "Perlu login" berarti request harus
menyertakan header `Authorization: Bearer <token>` dari hasil login atau register.

| Method | Endpoint | Perlu login | Keterangan |
|---|---|---|---|
| GET | `/api/health` | Tidak | Cek server hidup |
| GET | `/api/public/teaser` | Tidak | Tiga konten terbaru untuk halaman landing, tanpa isi lengkap |
| POST | `/api/auth/register` | Tidak | Daftar akun baru |
| POST | `/api/auth/login` | Tidak | Masuk, mengembalikan token JWT |
| GET | `/api/auth/me` | Ya | Data akun yang sedang login |
| PUT | `/api/auth/me` | Ya | Ubah nama dan bio |
| PUT | `/api/auth/password` | Ya | Ubah password |
| GET | `/api/contents` | Ya | Daftar konten, mendukung filter `category`, `type`, `search`, dan halaman |
| GET | `/api/contents/:slug` | Ya | Detail satu konten |
| GET | `/api/favorites` | Ya | Daftar konten favorit milik pengguna |
| POST | `/api/favorites/:contentId` | Ya | Simpan konten ke favorit |
| DELETE | `/api/favorites/:contentId` | Ya | Hapus konten dari favorit |
| GET | `/api/logs/summary` | Ya | Ringkasan cincin harian dan rekap tujuh hari terakhir |
| GET | `/api/logs` | Ya | Riwayat catatan, mendukung filter `type`, `from`, `to`, dan halaman |
| POST | `/api/logs` | Ya | Tambah satu catatan aktivitas |
| PUT | `/api/logs/:id` | Ya | Ubah catatan |
| DELETE | `/api/logs/:id` | Ya | Hapus catatan |
| GET | `/api/categories` | Ya | Jumlah konten per kategori |
| GET | `/api/aktivitas` | Ya | Rujukan jenis aktivitas, satuan, dan target harian |

Route ini didefinisikan di `server/src/app.js` dan berkas di `server/src/routes/`.

Catatan penamaan: kode server berbahasa Inggris, tapi **nama field JSON pada balasan
tetap Bahasa Indonesia** — `pesan`, `konten`, `catatan`, `kelompok`, `cincin`,
`hariIni`, dan seterusnya. Nama-nama itu kontrak yang sudah dipakai aplikasi web dan
mobile; mengubahnya memecahkan keduanya sekaligus.

## Data yang privat

Catatan harian dan favorit hanya bisa dilihat pemiliknya. Dua aturan yang
menjaganya:

- **Identitas selalu diambil dari token**, tidak pernah dari body atau query. `userId`
  yang dikirim klien diabaikan.
- **Milik pengguna lain dibalas 404, bukan 403.** Balasan 403 akan membocorkan bahwa
  catatan dengan id itu ada.

## Skema database

Empat collection di MongoDB, semua didefinisikan di `server/src/models/`.

**users** — `name`, `email` (unik), `passwordHash` (tidak pernah dikirim ke klien),
`bio`, `createdAt`, `updatedAt`.

**contents** — `slug` (unik), `title`, `type` (`article`, `video`, atau
`infographic`), `category` (lima kategori kesehatan), `excerpt`, `body`, `imageUrl`,
`videoId`, `videoUrl`, `author`, `source`, `readingMinutes`, `tags`, `publishedAt`.

**favorites** — `userId`, `contentId`, `createdAt`. Kombinasi `userId` dan
`contentId` bersifat unik, jadi satu pengguna tidak bisa menyimpan konten yang sama
dua kali.

**healthlogs** — `userId`, `type`, `value`, `mood`, `note`, `loggedAt`, `date` (kunci
tanggal berformat `YYYY-MM-DD`). Enam nilai `type` yang sah: `steps`, `exercise`,
`water`, `sleep`, `breathing`, `weight`. Field `mood` hanya terisi pada catatan
bertipe `breathing` — nilainya 1 sampai 4. Pada lima jenis lainnya, `mood` selalu
kosong. Mood bukan jenis aktivitas tersendiri.

## CSS aplikasi web diangkat dari mockup

`web/src/styles/komponen.css` **dibangkitkan, bukan ditulis tangan.**
`design/build-css.mjs` mengangkat aturannya dari `design/mockups.html` supaya
tampilan aplikasi tidak menyimpang dari mockup. Suntingan tangan di berkas itu akan
hilang saat skripnya dijalankan lagi:

```bash
node design/build-css.mjs
```

Berkas CSS yang memang ditulis tangan adalah `web/src/styles/layout.css`, isinya
khusus hal-hal yang tidak ada di mockup.

## Menguji server

```bash
cd server && npm run smoke
```

Skrip ini menjalankan 36 pemeriksaan terhadap server yang sedang hidup — autentikasi,
konten, favorit, catatan harian, aturan validasi, dan aturan privasi. Jalankan sebelum
meng-commit perubahan apa pun di `server/`.

## Catatan deployment

**Netlify (aplikasi web).**

1. Hubungkan repositori ke Netlify.
2. Netlify membaca `web/netlify.toml` otomatis: base `web`, perintah build
   `npm run build`, direktori publikasi `dist`.
3. Isi environment variable `VITE_API_URL` di dashboard Netlify dengan alamat server
   di Render, bukan `localhost`.

**Render (server).**

1. Hubungkan repositori ke Render, pakai Blueprint dari `render.yaml` di akar
   repositori.
2. Render membaca `render.yaml` otomatis: `rootDir` `server`, `buildCommand`
   `npm install`, `startCommand` `npm start`, `healthCheckPath` `/api/health`.
3. Isi `MONGO_URI`, `JWT_SECRET`, dan `CORS_ORIGIN` di dashboard Render. Ketiganya
   ditandai `sync: false` di `render.yaml`, jadi sengaja tidak disimpan di
   repositori. `CORS_ORIGIN` diisi dengan alamat web di Netlify.

Dua hal yang mudah membuat bingung:

- **Atlas Network Access harus mengizinkan `0.0.0.0/0`.** IP server Render
  berubah-ubah, tidak tetap. Kalau Network Access di MongoDB Atlas dibatasi ke IP
  tertentu, koneksi dari Render bisa gagal sewaktu-waktu.
- **Paket gratis Render tidur setelah sekitar 15 menit tanpa permintaan.** Permintaan
  pertama setelah server tidur butuh sekitar satu menit untuk membangunkannya
  kembali. Ini bukan tanda server rusak.

## Daftar periksa penilaian

| Komponen penilaian | Bobot | Bukti |
|---|---|---|
| Desain UI/UX | 10% | `design/design-system.md`, `design/mockups.html`, `design/figma/`, `design/alur-aplikasi.png` |
| Aplikasi web minimal 4 halaman | 15% | `web/src/pages/` — 8 halaman, lihat bagian "Delapan halaman" |
| Aplikasi mobile minimal 4 halaman | 15% | `mobile/src/screens/` — 8 layar, lihat bagian "Menjalankan aplikasi mobile lewat Expo Go" |
| Aplikasi server dan database | 15% | `server/src/routes/`, `server/src/models/`, `server/scripts/feed.js`, bagian "Daftar endpoint" dan "Skema database" |
