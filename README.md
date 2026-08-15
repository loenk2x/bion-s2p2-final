# Healthy Life

Healthy Life adalah aplikasi edukasi kesehatan untuk tugas Final LO4. Aplikasi ini
menyediakan artikel, video, dan infografis seputar lima topik kesehatan — pola hidup
sehat, gizi seimbang, olahraga, kesehatan mental, dan pencegahan penyakit — serta
fitur pencatatan aktivitas harian: langkah, olahraga, air minum, tidur, latihan
pernapasan, dan berat badan.

## Bagian yang sudah jadi dan yang belum

Sudah jadi:

- **Desain UI/UX.** Design system, mockup, dan berkas siap impor Figma ada di `design/`.
- **Server dan database.** API Express lengkap untuk autentikasi, konten, favorit,
  dan catatan harian sudah jalan. `server/scripts/feed.js` sudah bisa mengisi
  database dari `content/` dan menyiapkan akun demo.

Belum jadi:

- **Aplikasi web (`web/`).** Fondasi React, Vite, dan routing sudah ada di
  `web/src/App.jsx` — routing-nya sudah menyebut delapan halaman (Landing, Daftar,
  Masuk, Beranda, Detail konten, Favorit, Catatan harian, Profil). Tapi berkas
  halaman di `web/src/pages/` dan kerangka tampilan `Kerangka.jsx` belum ditulis,
  jadi aplikasi web belum bisa dijalankan sampai berkas itu ada.
- **Aplikasi mobile (`mobile/`).** Belum dibuat sama sekali. Rencananya memakai
  Expo, menyusul di langkah berikutnya.

## Struktur monorepo

```
Final LO4/
├── content/          20 berkas JSON konten, sumber data untuk feeder
│   ├── gizi-seimbang/
│   ├── kesehatan-mental/
│   ├── olahraga/
│   ├── pencegahan-penyakit/
│   └── pola-hidup-sehat/
├── design/           design system, mockup, prompt Figma, berkas siap impor
│   ├── design-system.md
│   ├── mockups.html
│   └── figma/
├── server/           Express 4 + Mongoose 8 + JWT, port 4000
│   ├── scripts/feed.js
│   └── src/
│       ├── app.js
│       ├── config/db.js
│       ├── middleware/
│       ├── models/
│       └── routes/
├── web/              React 18 + Vite 5 + React Router 6, port 5173
│   └── src/
├── mobile/           belum dibuat — rencananya Expo
├── docker-compose.yml
├── render.yaml
└── README.md
```

## Cara menjalankan tanpa Docker

1. Salin `server/.env.example` menjadi `server/.env`, lalu isi `MONGO_URI` dengan
   alamat cluster MongoDB Atlas dan `JWT_SECRET` dengan string acak.
2. Di folder `server/`, jalankan `npm install`, lalu `npm run feed` untuk mengisi
   database dan menyiapkan akun demo, lalu `npm run dev` untuk menyalakan server.
3. Di folder `web/`, jalankan `npm install`, lalu `npm run dev` untuk menyalakan
   aplikasi web.

## Cara menjalankan dengan Docker

Siapkan `server/.env` seperti langkah di atas, lalu dari akar repositori jalankan:

```
docker compose up --build
```

Server tersedia di `http://localhost:4000`, aplikasi web di `http://localhost:5173`.
Kode di `server/` dan `web/` di-mount ke dalam kontainer, jadi perubahan berkas di
komputer langsung terlihat tanpa membangun ulang image.

Database tidak ikut dalam `docker-compose.yml` karena Healthy Life memakai MongoDB
Atlas (basis data terkelola di cloud), bukan MongoDB yang dijalankan sendiri.

Expo sengaja tidak dimasukkan Docker. Metro, server pengembangan Expo, perlu
dihubungi langsung oleh HP lewat jaringan lokal yang sama. Docker Desktop di
Windows tidak menyediakan mode jaringan host, jadi HP tidak bisa mencapai Metro
yang berjalan di dalam kontainer. Expo tetap dijalankan langsung di komputer,
di luar Docker.

## Akun demo

Dibuat otomatis oleh `npm run feed`, didefinisikan di `server/scripts/feed.js`:

- Email: `demo@healthylife.id`
- Password: `demo12345`

Akun ini sudah punya empat konten favorit dan catatan aktivitas harian selama
tujuh hari terakhir, tersebar di enam jenis aktivitas.

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

## Skema database

Empat collection di MongoDB, semua didefinisikan di `server/src/models/`.

**users** — `name`, `email` (unik), `passwordHash` (tidak pernah dikirim ke klien),
`bio`, `createdAt`, `updatedAt`.

**contents** — `slug` (unik), `title`, `type` (`article`, `video`, atau
`infographic`), `category` (lima kategori kesehatan), `excerpt`, `body`,
`imageUrl`, `videoId`, `videoUrl`, `author`, `source`, `readingMinutes`, `tags`,
`publishedAt`.

**favorites** — `userId`, `contentId`, `createdAt`. Kombinasi `userId` dan
`contentId` bersifat unik, jadi satu pengguna tidak bisa menyimpan konten yang
sama dua kali.

**healthlogs** — `userId`, `type`, `value`, `mood`, `note`, `loggedAt`, `date`
(kunci tanggal berformat `YYYY-MM-DD`). Enam nilai `type` yang sah: `steps`,
`exercise`, `water`, `sleep`, `breathing`, `weight`. Field `mood` hanya terisi
pada catatan bertipe `breathing` — nilainya 1 sampai 4. Pada lima jenis lainnya,
`mood` selalu kosong.

## Catatan deployment

**Netlify (aplikasi web).**

1. Hubungkan repositori ke Netlify.
2. Netlify membaca `web/netlify.toml` otomatis: base `web`, perintah build
   `npm run build`, direktori publikasi `dist`.
3. Isi environment variable `VITE_API_URL` di dashboard Netlify dengan alamat
   server di Render, bukan `localhost`.

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
  berubah-ubah, tidak tetap. Kalau Network Access di MongoDB Atlas dibatasi ke
  IP tertentu, koneksi dari Render bisa gagal sewaktu-waktu.
- **Paket gratis Render tidur setelah sekitar 15 menit tanpa permintaan.**
  Permintaan pertama setelah server tidur butuh sekitar satu menit untuk
  membangunkannya kembali. Ini bukan tanda server rusak.

## Menjalankan aplikasi mobile lewat Expo Go

Begini catatannya, untuk saat `mobile/` sudah dibuat. Alamat server di aplikasi
mobile harus memakai alamat IP jaringan lokal laptop, misalnya
`http://192.168.1.5:4000`, bukan `http://localhost:4000`. Di HP, `localhost`
berarti HP itu sendiri, bukan laptop tempat server berjalan. Cari alamat IP
laptop lewat `ipconfig` di Windows, lihat bagian IPv4 Address pada adapter
Wi-Fi yang sedang dipakai. Laptop dan HP harus tersambung ke jaringan Wi-Fi
yang sama.

## Daftar periksa penilaian

Tabel ini memetakan tiap komponen penilaian ke berkas atau bagian yang
membuktikannya.

| Komponen penilaian | Bobot | Bukti |
|---|---|---|
| Desain UI/UX | 10% | `design/design-system.md`, `design/mockups.html`, `design/figma/` |
| Aplikasi web minimal 4 halaman | 15% | `web/src/App.jsx` (routing 8 halaman) — implementasi halaman di `web/src/pages/` belum selesai, lihat bagian "Bagian yang sudah jadi dan yang belum" |
| Aplikasi mobile minimal 4 halaman | 15% | `mobile/` — belum dibuat, lihat bagian "Bagian yang sudah jadi dan yang belum" |
| Aplikasi server dan database | 15% | `server/src/routes/`, `server/src/models/`, `server/scripts/feed.js`, bagian "Daftar endpoint" dan "Skema database" di README ini |
