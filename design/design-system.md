# Design System Healthy Life

Satu design system dipakai bersama oleh aplikasi web dan aplikasi mobile. Nilai di dokumen ini adalah sumber kebenaran: web menurunkannya jadi CSS variable di `web/src/styles/tokens.css`, mobile menurunkannya jadi objek tema di `mobile/src/theme.js`, dan Figma menurunkannya jadi variable dan style.

Mode terang saja. Tidak ada mode gelap.

## Prinsip yang dipegang

1. **Mobile-first.** Tata letak dirancang untuk lebar 390px dulu, baru dilebarkan lewat breakpoint. Web bukan desain desktop yang dikecilkan.
2. **Satu wajah di dua platform.** Warna, tipografi, jarak, dan bentuk kartu identik. Yang berbeda hanya cara berpindah halaman: web pakai header dan sidebar di layar lebar, mobile pakai bottom tab.
3. **Konten lebih dulu.** Gambar sampul, judul, dan tipe konten adalah tiga hal yang paling dulu terbaca di kartu.
4. **Warna dipakai untuk arti, bukan hiasan.** Hijau berarti aksi utama dan status baik, jingga berarti aksen dan penekanan, merah berarti galat. Tidak ada warna yang muncul tanpa alasan.

## Warna

### Warna utama dan aksen

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `hijau-700` | `#0E6E49` | Keadaan ditekan pada tombol primer |
| `hijau-600` | `#128A5B` | Tombol primer, tautan, chip aktif, ikon tab aktif |
| `hijau-500` | `#19A96F` | Aksen grafik, garis kemajuan |
| `hijau-100` | `#DCF3E8` | Latar lembut, cincin fokus |
| `hijau-50` | `#F1FAF5` | Latar kartu bersorot |
| `jingga-500` | `#F2762E` | Aksen, lencana tipe video, angka penting |
| `jingga-100` | `#FDE8DA` | Latar lembut aksen |

### Warna netral

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `tinta-900` | `#12211B` | Judul dan teks utama |
| `tinta-600` | `#4B5B54` | Teks sekunder, keterangan |
| `tinta-400` | `#84968D` | Teks nonaktif, placeholder |
| `garis` | `#E2EBE6` | Garis pembatas, batas input |
| `putih` | `#FFFFFF` | Permukaan kartu, isi input |
| `latar` | `#F6FBF8` | Latar halaman, putih kehijauan |

### Warna status

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `sukses` | `#128A5B` | Berhasil disimpan |
| `peringatan` | `#C9820A` | Peringatan ringan |
| `bahaya` | `#D2453C` | Pesan galat, tombol hapus |
| `bahaya-100` | `#FBE4E2` | Latar kotak galat |

### Warna lencana tipe konten

Tiga tipe konten dibedakan dengan warna lencana, bukan dengan bentuk kartu yang berbeda.

| Tipe | Teks lencana | Warna teks | Warna latar |
|---|---|---|---|
| `article` | Artikel | `hijau-700` `#0E6E49` | `hijau-100` `#DCF3E8` |
| `video` | Video | `#9A3F0B` | `jingga-100` `#FDE8DA` |
| `infographic` | Infografis | `#1A4E8A` | `#DDEAFB` |

Kategori tidak punya warna sendiri. Chip kategori memakai netral saat tidak aktif dan `hijau-600` saat aktif, supaya jumlah warna di layar tetap sedikit.

### Kontras

Semua pasangan teks dan latar di atas memenuhi WCAG AA untuk teks normal, kecuali `tinta-400` yang hanya boleh dipakai untuk placeholder dan teks nonaktif — bukan untuk kalimat yang harus terbaca.

## Tipografi

Font: **Inter**. Kalau Inter tidak tersedia, jatuh ke `-apple-system, "Segoe UI", Roboto, Arial, sans-serif`. Satu keluarga font untuk seluruh aplikasi.

| Token | Ukuran / tinggi baris | Tebal | Dipakai untuk |
|---|---|---|---|
| `judul-besar` | 28 / 34 | 700 | Judul halaman detail, judul layar Register dan Login |
| `judul-1` | 22 / 28 | 700 | Judul bagian, sapaan di Beranda |
| `judul-2` | 18 / 24 | 600 | Judul kartu konten, judul kelompok |
| `badan` | 15 / 22 | 400 | Teks isi, isi input |
| `badan-tebal` | 15 / 22 | 600 | Label tombol |
| `kecil` | 13 / 18 | 400 | Kutipan kartu, keterangan waktu baca |
| `label` | 12 / 16 | 600 | Label input, teks lencana, label tab |
| `angka-besar` | 26 / 30 | 700 | Angka pada kotak ringkasan |

Di layar 1024px ke atas, `judul-besar` naik ke 34 / 40 dan `judul-1` naik ke 26 / 32. Ukuran lain tidak berubah.

Panjang baris teks isi dibatasi 68 karakter di layar lebar, supaya artikel tetap enak dibaca.

## Jarak

Skala kelipatan 4: **4, 8, 12, 16, 20, 24, 32, 40, 48**.

Aturan pemakaian yang tetap:

- Padding dalam kartu: 16
- Jarak antarkartu di daftar: 12
- Padding kiri kanan layar mobile: 16
- Padding kiri kanan layar web di bawah 640px: 16; di atasnya 24
- Jarak antarbagian dalam satu halaman: 24
- Jarak label ke input: 8; jarak antar-input dalam satu form: 16

Lebar isi maksimum di web: 1120px, ditaruh di tengah.

## Bentuk dan bayangan

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `radius-sm` | 8px | Input, lencana, tombol kecil |
| `radius-md` | 12px | Kartu konten, tombol, kotak ringkasan |
| `radius-lg` | 16px | Modal, lembar bawah |
| `radius-penuh` | 999px | Chip kategori, avatar |
| `bayang-1` | `0 1px 2px rgba(18,33,27,.06), 0 1px 3px rgba(18,33,27,.04)` | Kartu dalam keadaan biasa |
| `bayang-2` | `0 4px 12px rgba(18,33,27,.08)` | Kartu saat disentuh, header yang menempel, bottom tab |

Bayangan hanya dua tingkat. Tidak ada bayangan berwarna.

## Breakpoint

| Nama | Lebar | Perubahan tata letak |
|---|---|---|
| Dasar | 0–639px | Satu kolom, navigasi lewat bottom tab |
| `sm` | 640px | Daftar konten jadi dua kolom |
| `lg` | 1024px | Daftar konten jadi tiga kolom, bottom tab diganti header dengan menu mendatar, halaman detail memakai dua kolom |

## Komponen

### Tombol

| Jenis | Latar | Teks | Batas |
|---|---|---|---|
| Primer | `hijau-600` | `putih` | tidak ada |
| Sekunder | `putih` | `hijau-600` | 1px `hijau-600` |
| Netral | `putih` | `tinta-900` | 1px `garis` |
| Bahaya | `putih` | `bahaya` | 1px `bahaya` |
| Teks | tanpa latar | `hijau-600` | tidak ada |

Tinggi 44px untuk ukuran biasa dan 36px untuk ukuran kecil, radius `radius-md`, padding kiri kanan 20, teks `badan-tebal`. Saat ditekan, tombol primer memakai `hijau-700`. Saat nonaktif, latar `garis` dan teks `tinta-400`.

Ukuran sentuh minimum 44 × 44px di mobile, termasuk untuk tombol ikon.

### Input

Tinggi 48px, radius `radius-sm`, batas 1px `garis`, latar `putih`, teks `badan`, placeholder `tinta-400`, padding kiri kanan 14.

Label di atas input memakai `label` warna `tinta-600`. Saat difokus, batas menjadi `hijau-600` dengan cincin 3px `hijau-100`. Saat galat, batas menjadi `bahaya` dan pesan galat muncul di bawah input memakai `label` warna `bahaya`.

Input password punya tombol mata di sisi kanan untuk menampilkan atau menyembunyikan isian.

### Kartu konten

Susunan dari atas ke bawah:

1. Gambar sampul, rasio 16:9, sudut atas mengikuti `radius-md`
2. Lencana tipe konten, ditempel di pojok kiri atas gambar
3. Tombol simpan berbentuk lingkaran putih 36px di pojok kanan atas gambar, ikon berubah terisi saat konten sudah disimpan
4. Judul `judul-2`, dipotong maksimal 2 baris
5. Kutipan `kecil` warna `tinta-600`, dipotong maksimal 2 baris
6. Baris keterangan: nama kategori, titik pemisah, dan waktu baca, memakai `label` warna `tinta-400`

Latar `putih`, radius `radius-md`, bayangan `bayang-1`, padding 16 di bagian teks. Seluruh kartu bisa ditekan; tombol simpan menangkap sentuhannya sendiri agar tidak ikut membuka halaman detail.

### Chip kategori

Tinggi 34px, radius `radius-penuh`, padding kiri kanan 14, teks `kecil`. Tidak aktif: latar `putih`, batas 1px `garis`, teks `tinta-600`. Aktif: latar `hijau-600`, tanpa batas, teks `putih`. Chip disusun mendatar dan bisa digeser kalau tidak muat.

### Lencana tipe konten

Tinggi 22px, radius `radius-sm`, padding kiri kanan 8, teks `label`. Warnanya mengikuti tabel warna lencana di atas.

### Avatar inisial

Lingkaran dengan `radius-penuh` berisi satu atau dua huruf pertama nama, teks tebal warna `putih`. Ukuran 40px di header, 56px di daftar, dan 80px di halaman Profil.

Warna latarnya dipilih dari lima warna berikut berdasarkan sisa bagi kode karakter nama, sehingga satu nama selalu mendapat warna yang sama: `#128A5B`, `#F2762E`, `#2D7FF9`, `#7A5AF8`, `#0E9DA8`.

### Kotak ringkasan

Dipakai di Beranda dan Catatan Harian untuk menampilkan satu angka. Isinya: label `label` warna `tinta-600`, angka `angka-besar` warna `tinta-900`, dan satuan `kecil` warna `tinta-400` di samping angka. Latar `putih`, radius `radius-md`, padding 16, bayangan `bayang-1`. Disusun dalam grid dua kolom di mobile dan empat kolom mulai 640px.

### Bottom tab, khusus mobile

Tinggi 64px ditambah area aman perangkat, latar `putih`, garis atas 1px `garis`, bayangan `bayang-2`. Empat tab: Beranda, Favorit, Catatan, Profil. Ikon 24px dengan label `label` di bawahnya. Tab aktif memakai `hijau-600`, tab tidak aktif memakai `tinta-400`.

### Header

Tinggi 64px, latar `putih`, garis bawah 1px `garis`.

Di mobile berisi judul layar di tengah dan tombol kembali di kiri bila layar dibuka dari layar lain. Di web mulai 1024px berisi logo di kiri, menu mendatar Beranda, Favorit, dan Catatan Harian di tengah, serta avatar inisial di kanan yang membuka menu ke halaman Profil dan tombol keluar.

### Keadaan kosong

Ikon garis 48px warna `tinta-400`, judul `judul-2`, satu kalimat penjelas `kecil` warna `tinta-600`, dan satu tombol primer yang mengarahkan ke tindakan berikutnya. Semuanya rata tengah dengan jarak 12 antarunsur.

### Kerangka pemuatan

Saat data belum datang, kartu diganti kotak abu `#EDF3F0` dengan radius yang sama dan animasi berkedip lembut. Jumlah kerangka mengikuti jumlah kartu yang biasanya muncul, yaitu empat di mobile.

## Susunan layar

Tujuh layar, sama di web dan mobile.

| Layar | Isi utama |
|---|---|
| Register | Nama, email, password, konfirmasi password, tombol daftar, tautan ke Login |
| Login | Email, password, tombol masuk, tombol isi akun demo, tautan ke Register |
| Beranda | Sapaan dan ringkasan hari ini, pencarian, chip kategori, tab tipe konten, daftar kartu konten |
| Detail Konten | Gambar sampul atau pemutar YouTube, judul, keterangan, isi, tautan sumber, tombol simpan |
| Favorit | Daftar kartu konten yang sudah disimpan, keadaan kosong bila belum ada |
| Catatan Harian | Form catat aktivitas, ringkasan 7 hari, riwayat yang dikelompokkan per tanggal |
| Profil | Avatar inisial, nama, email, ubah nama dan bio, ganti password, jumlah favorit dan catatan, tombol keluar |

## Alur perpindahan layar

```
Belum masuk
  Login  ⇄  Register
    └── berhasil masuk ──▶ Beranda

Sudah masuk
  Beranda ──▶ Detail Konten ──▶ kembali ke Beranda
  Beranda ⇄ Favorit ⇄ Catatan Harian ⇄ Profil     (bottom tab di mobile, menu header di web)
  Favorit ──▶ Detail Konten
  Profil ──▶ keluar ──▶ Login
```

Membuka alamat layar mana pun tanpa token akan dilempar ke Login. Setelah berhasil masuk, pengguna dikembalikan ke alamat yang tadi dituju.

## Aturan menulis teks antarmuka

- Seluruhnya Bahasa Indonesia. Istilah teknis yang tidak punya padanan lazim boleh tetap Inggris, misalnya `email`.
- Tombol memakai kata kerja: "Simpan catatan", bukan "Submit".
- Pesan galat menyebut apa yang harus dilakukan: "Password minimal 8 karakter", bukan "Password tidak valid".
- Sapaan memakai nama depan pengguna: "Halo, Wiguno".
- Angka satuan ditulis terpisah dari angkanya: "6.240 langkah", "8 gelas".

## Cara nilai ini dipakai di kode

**Web**, `web/src/styles/tokens.css`:

```css
:root {
  --hijau-600: #128A5B;
  --jingga-500: #F2762E;
  --tinta-900: #12211B;
  --latar: #F6FBF8;
  --radius-md: 12px;
  --bayang-1: 0 1px 2px rgba(18,33,27,.06), 0 1px 3px rgba(18,33,27,.04);
}
```

**Mobile**, `mobile/src/theme.js`:

```js
export const warna = {
  hijau600: "#128A5B",
  jingga500: "#F2762E",
  tinta900: "#12211B",
  latar: "#F6FBF8",
};
export const radius = { sm: 8, md: 12, lg: 16, penuh: 999 };
export const jarak = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
```

Nilai mentah seperti `#128A5B` tidak boleh ditulis langsung di komponen. Selalu lewat token, supaya satu perubahan warna cukup dilakukan di satu tempat dan langsung berlaku di web maupun mobile.
