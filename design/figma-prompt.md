# Prompt Figma untuk Healthy Life

Prompt siap tempel supaya Anda tidak menggambar dari nol di Figma. Nilai warna, ukuran, dan teks di dalamnya sama persis dengan `design-system.md` dan `mockups.html`.

## Cara memakainya

1. Buat file Figma baru bernama **Healthy Life — Final LO4**.
2. Buka **Figma AI → First Draft** (`Ctrl+K`, lalu pilih First Draft).
3. Jalankan Prompt 1 dan Prompt 2 dulu untuk fondasi dan komponen, baru prompt layar satu per satu.
4. Buka `mockups.html` di browser berdampingan dengan Figma sebagai acuan visual saat merapikan.

## Prompt 1 — Fondasi design system

```
Buatkan halaman "Design System" untuk aplikasi edukasi kesehatan bernama Healthy Life.
Bahasa antarmuka: Bahasa Indonesia. Mode terang saja.

Color variables dengan nama dan nilai persis:
hijau-700 #0E6E49, hijau-600 #128A5B, hijau-500 #19A96F, hijau-100 #DCF3E8, hijau-50 #F1FAF5,
jingga-500 #F2762E, jingga-100 #FDE8DA,
tinta-900 #12211B, tinta-600 #4B5B54, tinta-400 #84968D,
garis #E2EBE6, putih #FFFFFF, latar #F6FBF8,
bahaya #D2453C, bahaya-100 #FBE4E2, peringatan #C9820A.

Tambahkan enam warna jenis aktivitas dalam kelompok terpisah bernama "Aktivitas":
ak-langkah #F2762E, ak-olahraga #19A96F, ak-air #2D7FF9,
ak-tidur #7A5AF8, ak-napas #0E9DA8, ak-berat #C9820A.

Text styles memakai font Inter:
judul-besar 28/34 Bold, judul-1 22/28 Bold, judul-2 18/24 SemiBold,
badan 15/22 Regular, badan-tebal 15/22 SemiBold, kecil 13/18 Regular,
label 12/16 SemiBold, angka-besar 26/30 Bold, angka-aktivitas 22/28 Bold,
angka-stepper 44/48 Bold.

Effect styles:
bayang-1 = 0 1 2 rgba(18,33,27,0.06) ditambah 0 1 3 rgba(18,33,27,0.04),
bayang-2 = 0 4 12 rgba(18,33,27,0.08),
bayang-3 = 0 8 24 rgba(18,33,27,0.16).

Radius: 8 input dan lencana, 12 kartu dan tombol, 16 kartu cincin dan lembar bawah,
999 chip, avatar, dan tombol bulat. Skala jarak 4 8 12 16 20 24 32 40 48.

Tampilkan sebagai papan contoh: swatch warna dengan nama dan hex, daftar text style,
contoh kotak tiap radius, dan contoh tiap bayangan.
```

## Prompt 2 — Komponen dasar

```
Di halaman "Komponen", buatkan komponen berikut memakai variable dan text style yang sudah ada.

1. Tombol tinggi 44, radius 12, padding 20, teks badan-tebal. Varian: primer (hijau-600, teks putih),
   sekunder (putih, teks hijau-600, garis hijau-600), netral (putih, teks tinta-900, garis garis),
   bahaya (putih, teks bahaya, garis bahaya), teks (tanpa latar, hijau-600), nonaktif (latar garis, teks tinta-400).
   Buat juga ukuran kecil tinggi 36 padding 14.

2. Tombol ikon bulat 40x40 radius penuh, latar putih, garis 1px garis, ikon 20 warna tinta-600.
   Varian aktif: ikon hijau-600, latar hijau-50, garis hijau-100.
   Varian di atas gambar: tanpa garis, latar putih 94 persen, efek bayang-1.

3. Input tinggi 48, radius 8, garis 1px garis, padding 14, label di atas memakai label warna tinta-600.
   Keadaan fokus: garis hijau-600 ditambah cincin luar 3px hijau-100.
   Keadaan galat: garis bahaya, ditambah teks galat 12/16 warna bahaya di bawah input.

4. Chip kategori tinggi 34 radius penuh padding 14 teks kecil.
   Tidak aktif putih dengan garis; aktif latar hijau-600 teks putih.

5. Tab tipe konten bergaris bawah: baris teks 14/18 SemiBold dengan jarak 20,
   menempel pada garis pembatas 1px garis. Tab tidak aktif tinta-400.
   Tab aktif hijau-700 dengan garis bawah 2px hijau-600.
   Bentuknya harus jelas berbeda dari chip kategori karena keduanya muncul berdampingan.

6. Lencana tipe konten tinggi 22 radius 8 padding 8 teks label:
   Artikel latar #DCF3E8 teks #0E6E49, Video latar #FDE8DA teks #9A3F0B,
   Infografis latar #DDEAFB teks #1A4E8A.

7. Avatar inisial: lingkaran berisi dua huruf tebal putih, ukuran 40, 56, 80.
   Warna latar dari lima nilai: #128A5B, #F2762E, #2D7FF9, #7A5AF8, #0E9DA8.

8. Kartu konten lebar 340: gambar 16:9 di atas, lencana tipe di kiri atas gambar,
   tombol simpan bulat putih 36 di kanan atas gambar, lalu bagian teks padding 16 berisi
   judul judul-2 dua baris, kutipan kecil warna tinta-600 dua baris,
   dan keterangan "Olahraga · 5 menit baca" memakai label warna tinta-400.
   Latar putih, radius 12, efek bayang-1.

9. Baris konten mendatar: gambar 96x72 radius 8 di kiri, judul dua baris dan keterangan di tengah.
   Latar putih, radius 12, padding 10, efek bayang-1.

10. Keadaan kosong: ikon garis 48 warna tinta-400, judul judul-2,
    satu kalimat kecil warna tinta-600, satu tombol primer. Rata tengah, jarak 12.
```

## Prompt 3 — Komponen khas Healthy Life

```
Masih di halaman "Komponen", tambahkan empat komponen berikut.

1. CINCIN HARIAN.
   Kartu putih radius 16 padding 18, berisi grafik tiga lingkaran bertumpuk seperti Huawei Health.
   Lingkaran atas di tengah berwarna #F2762E jari-jari 42, lingkaran kiri bawah #7A5AF8 jari-jari 36,
   lingkaran kanan bawah #0E9DA8 jari-jari 28. Ketiganya memakai blend mode Multiply
   supaya bagian yang bertumpuk menggelap. Di dalam tiap lingkaran ada ikon putih 22:
   orang berlari, bulan sabit, dan tiga cincin sepusat.
   Di bawah grafik ada tiga kolom legenda yang dipisah garis tipis, tiap kolom berisi
   titik warna 8px, nama sumbu memakai label, dan angkanya 20/26 Bold:
   Gerak 6.240 langkah, Tidur 7,1 jam, Relaksasi 1 sesi.
   Di pojok kanan atas kartu ada pil kecil latar hijau-100 teks hijau-700 bertuliskan "2 dari 3 target".

2. KARTU AKTIVITAS.
   Kartu putih radius 12 padding 14 efek bayang-1, dengan batang warna selebar 4 menempel di sisi kiri,
   dan ikon jenis aktivitas berukuran 96 di pojok kanan bawah dengan opasitas 13 persen
   yang terpotong tepi kartu sebagai gambar latar.
   Isi: jam memakai label warna tinta-400, nilai 22/28 Bold dengan satuan kecil warna tinta-400 di sampingnya,
   nama jenis 12/16 SemiBold berwarna sesuai jenisnya, lalu catatan opsional kecil warna tinta-600.
   Buat enam varian: Langkah #F2762E ikon jejak kaki, Olahraga #19A96F ikon orang berlari,
   Air minum #2D7FF9 ikon tetes air, Tidur #7A5AF8 ikon bulan sabit,
   Latihan pernapasan #0E9DA8 ikon tiga cincin sepusat, Berat badan #C9820A ikon timbangan.

3. BARIS GESER HAPUS.
   Baris konten yang digeser ke kiri sejauh 84, memperlihatkan panel merah #D2453C di belakangnya
   berisi ikon keranjang sampah 22 dan kata "Hapus" 11/14 warna putih, rata tengah.
   Buat dua varian: keadaan biasa dan keadaan tergeser.

4. TOMBOL TAMBAH DAN PILIHANNYA.
   Lingkaran 56 warna hijau-600 dengan ikon tambah putih dan efek bayang-3.
   Buat juga keadaan terbuka: latar ditutup tirai hitam 55 persen, ikon tambah berputar 45 derajat,
   dan enam pilihan bertumpuk di atas tombol dengan jarak 12, tiap pilihan berupa
   label putih radius 8 padding 7x12 di kiri dan lingkaran putih 48 berisi ikon berwarna di kanan.
   Urutan dari bawah ke atas: Berat badan, Latihan pernapasan, Tidur, Air minum, Olahraga, Langkah.
```

## Prompt 4 — Layar mobile, 390 × 844

Jalankan satu per satu.

### Landing, bisa dibuka tanpa login

```
Frame mobile 390x844 bernama "Mobile / Landing", latar #F6FBF8, padding kiri kanan 16.
Baris atas: logo Healthy Life di kiri, tombol sekunder kecil "Masuk" di kanan.
Lalu judul 28/34 Bold "Belajar hidup sehat, satu langkah tiap hari."
dan paragraf badan warna tinta-600 "Artikel, video, dan infografis dari Kementerian Kesehatan RI,
WHO, dan sumber tepercaya lain — plus catatan aktivitas harian Anda sendiri."
Lalu tombol primer selebar layar "Daftar gratis".
Lalu dua kotak angka bersebelahan: 20 konten dan 5 kategori.
Lalu label "CUPLIKAN KONTEN" dan dua baris konten mendatar. Baris kedua digambar buram
dengan ikon gembok di kanan, menandakan konten terkunci.
Paling bawah teks rata tengah kecil warna tinta-400 "Daftar dulu untuk membuka seluruh konten."
Tanpa bottom tab.
```

### Register dan Login

```
Frame mobile 390x844 bernama "Mobile / Register", latar #F6FBF8, padding kiri kanan 16.
Logo Healthy Life di atas, judul "Buat akun" judul-besar, kalimat penjelas
"Daftar dulu untuk membuka semua artikel, video, dan infografis kesehatan."
Lalu empat input berlabel: Nama lengkap berisi "Wiguno", Email berisi "wiguno@email.com",
Password dalam keadaan fokus, Konfirmasi password dalam keadaan galat dengan pesan
"Konfirmasi password belum sama".
Tombol primer selebar layar "Daftar", lalu teks rata tengah "Sudah punya akun? Masuk".
Tanpa bottom tab.
```

```
Frame mobile 390x844 bernama "Mobile / Login", latar #F6FBF8.
Bagian atas rata tengah: kotak hijau-600 64x64 radius 20 berisi ikon daun putih,
judul "Healthy Life" judul-besar, kalimat "Masuk untuk melanjutkan".
Lalu input Email berisi "demo@healthylife.id" dan input Password dengan ikon mata,
tautan teks "Lupa password?" rata kanan, tombol primer "Masuk",
tombol sekunder "Isi akun demo", lalu teks "Belum punya akun? Daftar".
Tanpa bottom tab.
```

### Beranda

```
Frame mobile 390x844 bernama "Mobile / Beranda", latar #F6FBF8, padding kiri kanan 16.
Baris atas: di kiri sapaan "Halo, Wiguno" judul-1 dan tanggal "Sabtu, 15 Agustus 2026" kecil;
di kanan tombol ikon bulat berisi bookmark sebagai pintasan ke Favorit, lalu avatar inisial 40 "WG".
Lalu komponen Cincin Harian selebar layar.
Lalu kolom pencarian tinggi 48 dengan ikon kaca pembesar dan placeholder "Cari artikel, video, infografis".
Lalu deret chip kategori mendatar yang bisa digeser: Semua aktif, Pola Hidup Sehat, Gizi Seimbang, Olahraga.
Chip terakhir sengaja terpotong tepi layar untuk menunjukkan bahwa deretnya bisa digeser.
Lalu tab tipe konten bergaris bawah: Semua aktif, Artikel, Video, Infografis.
Lalu satu kartu konten berjudul "Manfaat Jalan Kaki 30 Menit Setiap Hari" lencana Artikel
keterangan "Olahraga · 5 menit baca" dengan tombol simpan dalam keadaan tersimpan.
Tombol tambah mengambang di kanan bawah, 16 dari kanan dan 102 dari bawah.
Paling bawah bottom tab dengan tab Beranda aktif.
```

Buat frame kembar **Mobile / Beranda — tombol tambah terbuka** memakai keadaan terbuka dari komponen tombol tambah.

### Detail konten, tiga versi

```
Frame mobile 390x844 bernama "Mobile / Detail — artikel", latar #F6FBF8.
Paling atas gambar sampul selebar layar setinggi 220. Di atas gambar itu ada tiga tombol
ikon bulat mengambang: kembali di kiri, lalu bagikan dan simpan di kanan.
Tombol simpan dalam keadaan aktif. Tidak ada header terpisah dan tidak ada bilah tombol di bawah.
Di bawah gambar, padding kiri kanan 16: lencana Artikel, judul
"Manfaat Jalan Kaki 30 Menit Setiap Hari" judul-besar,
keterangan "Olahraga · 5 menit baca · Tim Healthy Life" memakai label warna tinta-400,
lalu tiga paragraf isi dengan satu subjudul "Apa yang terjadi pada tubuh",
lalu kotak sumber berisi label "SUMBER" dan teks
"Kementerian Kesehatan RI — ayosehat.kemkes.go.id" warna hijau-600.
Paling bawah bottom tab dengan tab Beranda aktif.
```

```
Frame mobile 390x844 bernama "Mobile / Detail — video", latar #F6FBF8.
Header putih tinggi 64 berisi tombol kembali di kiri, tombol bagikan dan simpan di kanan.
Di bawah header, pemutar YouTube rasio 16:9 selebar layar berlatar gelap
dengan tombol putar bundar putih di tengah.
Lalu lencana Video, judul "Manfaat Olahraga Sesuai Usia",
keterangan "Olahraga · 2 menit · CNN Indonesia",
ringkasan isi video, subjudul "Poin utama", satu paragraf, dan kotak sumber
"CNN Indonesia — youtube.com". Paling bawah bottom tab.
```

```
Frame mobile 390x844 bernama "Mobile / Detail — infografis", latar #F6FBF8.
Header putih tinggi 64 berisi tombol kembali, bagikan, dan simpan.
Lalu lencana Infografis, judul "Infografis Isi Piringku: Panduan Porsi Makan Sehari-hari" 22/28 Bold,
keterangan "Gizi Seimbang · 3 menit".
Lalu gambar infografis tinggi 300 dalam bingkai gelap radius 12, dengan pil gelap di pojok kanan bawah
bertuliskan "Ketuk untuk memperbesar" beserta ikon perbesar.
Lalu penjelasan isi, subjudul "Angka kunci", satu paragraf, dan kotak sumber. Paling bawah bottom tab.
```

### Favorit

```
Frame mobile 390x844 bernama "Mobile / Favorit", latar #F6FBF8.
Header putih tinggi 64 dengan judul "Favorit".
Di bawahnya label "4 KONTEN DISIMPAN · GESER KE KIRI UNTUK MENGHAPUS" warna tinta-400.
Lalu empat baris konten bertumpuk dengan jarak 8. Baris kedua digambar dalam keadaan tergeser
84 ke kiri sehingga panel merah berisi ikon keranjang dan kata "Hapus" terlihat di kanannya.
Judul keempat baris:
"Manfaat Jalan Kaki 30 Menit Setiap Hari" — Olahraga · Artikel · 5 menit,
"Infografis Isi Piringku: Panduan Porsi Makan Sehari-hari" — Gizi Seimbang · Infografis · 3 menit,
"Pentingnya Tidur Cukup untuk Kesehatan" — Pola Hidup Sehat · Artikel · 4 menit,
"Mengelola Stres dalam Kehidupan Sehari-hari" — Kesehatan Mental · Artikel · 5 menit.
Paling bawah bottom tab dengan tab Favorit aktif.
```

### Catatan harian dan lembar pencatatan

```
Frame mobile 390x844 bernama "Mobile / Catatan harian", latar #F6FBF8.
Header putih tinggi 64 dengan judul "Catatan Harian".
Isinya hanya riwayat, tanpa formulir apa pun.
Kelompok pertama berlabel "HARI INI · 15 AGUSTUS" berisi empat kartu aktivitas berurutan:
Olahraga 25 menit jam 06.15 dengan catatan "Jalan pagi keliling komplek",
Langkah 3.120 langkah jam 07.10, Air minum 3 gelas jam 09.30,
Latihan pernapasan 3 menit jam 12.00 dengan catatan "Perasaan setelah sesi: 🙂 Biasa saja".
Kelompok kedua berlabel "14 AGUSTUS" berisi satu kartu Tidur 7,1 jam jam 06.00.
Tombol tambah mengambang di kanan bawah.
Paling bawah bottom tab dengan tab Catatan aktif.
```

### Enam lembar tambah catatan

Buat enam frame terpisah bernama **Mobile / Lembar — Langkah**, **Mobile / Lembar — Olahraga**, **Mobile / Lembar — Air minum**, **Mobile / Lembar — Tidur**, **Mobile / Lembar — Latihan pernapasan**, dan **Mobile / Lembar — Berat badan**. Kelimanya memakai kerangka yang sama; hanya bagian pengisian yang berbeda.

```
Frame mobile 390x844 bernama "Mobile / Lembar — Air minum", latar #F6FBF8.
Di belakang: header "Catatan Harian" dan satu kartu aktivitas, ditutup tirai hitam 55 persen.
Di depan: lembar putih naik dari bawah, radius 16 di sudut atas, efek bayang-3,
dengan pegangan abu 40x4 di tengah atas.
Isi lembar: baris judul berisi lingkaran 40 dengan ikon jenis aktivitas berlatar 10 persen warna jenisnya,
lalu nama jenis judul-1 dan "Sabtu, 15 Agustus · 09.30" kecil warna tinta-600.
Lalu pengatur angka: tombol bulat 52 bertanda kurang, angka memakai 44/48 Bold
dengan satuan di bawahnya, tombol bulat bertanda tambah.
Lalu input "Catatan, opsional".
Lalu tombol primer selebar lembar "Simpan" dan tombol netral "Batal".
```

Ulangi prompt di atas untuk kelima jenis lain, dengan penyesuaian berikut:

| Frame | Ikon dan warna lingkaran judul | Angka dan satuan | Tambahan |
|---|---|---|---|
| Langkah | jejak kaki, `#F2762E` | 3.120 langkah | tiga tombol pintasan "+500", "+1.000", "+2.000" di bawah pengatur angka |
| Olahraga | orang berlari, `#19A96F` | 25 menit | tiga tombol pintasan "+5", "+15", "+30" |
| Air minum | tetes air, `#2D7FF9` | 3 gelas | — |
| Tidur | bulan sabit, `#7A5AF8` | 7,1 jam | — |
| Berat badan | timbangan, `#C9820A` | 68,4 kg | — |

Lembar Latihan pernapasan berbeda sendiri:

```
Frame mobile 390x844 bernama "Mobile / Lembar — Latihan pernapasan", latar #F6FBF8.
Susunan belakang dan lembarnya sama seperti lembar lain, tapi tanpa pengatur angka
dan tanpa input catatan.
Baris judul: lingkaran 40 warna #0E9DA8 berlatar #EAF7F8 dengan ikon tiga cincin sepusat,
lalu "Latihan pernapasan" judul-1 dan kalimat "Menenangkan diri sebelum mencatat perasaan".
Lalu label "Durasi sesi" dan tiga kotak pilihan setinggi 72 bersebelahan berisi angka 1, 3, dan 5
dengan kata "menit" kecil di bawah angkanya. Kotak angka 3 dalam keadaan terpilih:
garis #0E9DA8, latar #EAF7F8, dan cincin luar 2px #CDECEF.
Lalu tombol primer selebar lembar "Mulai sesi" dan tombol netral "Batal".
Paling bawah kalimat rata tengah 12/17 warna tinta-400 "Mood dicatat otomatis di akhir sesi."
```

### Sesi latihan pernapasan dan pencatatan mood

```
Frame mobile 390x844 bernama "Mobile / Sesi latihan pernapasan".
Seluruh layar berlatar gradien vertikal dari #0E9DA8 di atas ke #095E66 di bawah.
Baris atas: teks putih "Latihan pernapasan" di kiri, tombol tutup bulat 36
berlatar putih 18 persen dengan ikon silang putih di kanan.
Di tengah layar: tiga lingkaran putih sepusat dengan diameter 260, 210, dan 160
beropasitas 14, 22, dan 34 persen, mengelilingi lingkaran inti putih 120.
Inti berisi teks "Tarik napas" 14/18 SemiBold dan angka hitung mundur "4" memakai 46/52 Bold,
keduanya berwarna #0B7C86.
Di bawah lingkaran, kalimat rata tengah warna putih 85 persen
"Ikuti lingkarannya. Tarik napas saat membesar, buang napas saat mengecil."
Bagian bawah layar: garis kemajuan setinggi 4 berlatar putih 25 persen dengan isian putih 38 persen,
lalu baris "Sesi 3 menit" di kiri dan "01.52 tersisa" di kanan,
lalu tombol selebar layar berlatar putih 18 persen bertuliskan "Selesai lebih awal".
Tanpa bottom tab.
```

```
Frame mobile 390x844 bernama "Mobile / Akhir sesi — catat mood", latar #F6FBF8.
Di belakang: header "Catatan Harian" dan satu kartu aktivitas, ditutup tirai hitam 55 persen.
Di depan lembar putih dari bawah berisi, rata tengah:
lingkaran 56 warna #0E9DA8 berlatar #EAF7F8 dengan ikon tiga cincin sepusat,
judul "Sesi selesai" judul-1, dan kalimat "3 menit latihan pernapasan tercatat."
Lalu label "Bagaimana perasaan Anda sekarang?" dan empat kotak emoji setinggi 52 bersebelahan:
😞 😐 🙂 😄, dengan kotak ketiga dalam keadaan terpilih bergaris hijau-600 dan latar hijau-50.
Di bawah tiap kotak ada label 11/14: Buruk, Kurang, Biasa saja, Senang.
Label "Biasa saja" berwarna hijau-700 dan tebal karena sedang terpilih.
Lalu tombol primer selebar lembar "Simpan" dan tombol teks "Lewati pencatatan mood".
```

### Profil

```
Frame mobile 390x844 bernama "Mobile / Profil", latar #F6FBF8.
Header putih tinggi 64 dengan judul "Profil".
Bagian atas rata tengah: avatar inisial 80 warna #128A5B berisi "WG",
nama "Wiguno" judul-1, email "wiguno@email.com" kecil warna tinta-600.
Jangan tambahkan kotak angka apa pun di halaman ini.
Lalu kartu putih berisi input Nama berisi "Wiguno", input Bio dengan placeholder
"Ceritakan sedikit tentang Anda", dan tombol primer selebar kartu "Simpan perubahan".
Lalu kartu putih berjudul "Keamanan" berisi tombol netral "Ganti password".
Lalu tombol bahaya selebar layar "Keluar" beserta ikon keluar.
Paling bawah bottom tab dengan tab Profil aktif.
```

## Prompt 5 — Halaman web, 1440 × 900

Isi ditaruh di tengah dengan lebar maksimum 1120.

```
Frame desktop 1440x900 bernama "Web / Landing".
Header putih tinggi 64: logo Healthy Life di kiri, tombol teks "Masuk" dan tombol primer
"Daftar gratis" di kanan.
Isi dibagi dua kolom sama lebar.
Kolom kiri padding 56: judul 44/52 Bold "Belajar hidup sehat, satu langkah tiap hari.",
paragraf 17/26 warna tinta-600 "20 artikel, video, dan infografis dari Kementerian Kesehatan RI,
WHO, dan sumber tepercaya lain. Simpan yang penting, lalu catat aktivitas harian Anda sendiri.",
tombol primer "Daftar gratis" bersebelahan dengan tombol netral "Sudah punya akun",
lalu tiga angka berjajar: 20 KONTEN, 5 KATEGORI, 3 TIPE KONTEN.
Kolom kanan berlatar hijau-50 padding 48: label "CUPLIKAN KONTEN" lalu tiga baris konten mendatar.
Baris ketiga digambar buram dengan ikon gembok. Di bawahnya kalimat
"Daftar dulu untuk membuka seluruh konten."
```

Untuk **Web / Register** dan **Web / Login**, bagi layar jadi dua kolom sama lebar. Kolom kiri berlatar `hijau-600` berisi logo putih, judul 40/48 Bold, dan satu paragraf putih. Kolom kanan berisi form selebar 400 yang isinya sama dengan versi mobile. Judul kolom kiri untuk Register: "Belajar hidup sehat, satu langkah tiap hari."; untuk Login: "Selamat datang kembali." dengan paragraf "Favorit dan catatan harian Anda tersimpan dan hanya bisa dilihat oleh Anda sendiri."

```
Frame desktop 1440x900 bernama "Web / Beranda", latar #F6FBF8.
Header putih tinggi 64: logo di kiri, menu mendatar Beranda Favorit "Catatan Harian" dengan Beranda aktif,
lalu di kanan tombol primer kecil "Tambah catatan" beserta ikon tambah,
tombol ikon bulat bookmark sebagai pintasan Favorit, dan avatar inisial 40.
Isi dibagi dua kolom: kolom kiri lebar sisa, kolom kanan tetap 400, jarak 32.
Kolom kiri: judul "Halo, Wiguno" 34/40 Bold, tanggal, kolom pencarian lebar 420,
deret enam chip kategori, lalu tab tipe konten bergaris bawah.
Kolom kanan: komponen Cincin Harian.
Di bawah keduanya, grid kartu konten tiga kolom jarak 20 berisi tiga kartu.
```

```
Frame desktop 1440x900 bernama "Web / Detail konten", latar #F6FBF8, header seperti Beranda.
Baris atas isi: tautan "← Kembali ke Beranda" di kiri,
tombol ikon bulat bagikan dan simpan di kanan.
Lalu dua kolom: kiri lebar sisa berisi pemutar YouTube 16:9 radius 12,
lencana Video, judul "Manfaat Olahraga Sesuai Usia" 34/40 Bold, keterangan,
dan isi dengan lebar teks dibatasi 68 karakter.
Kolom kanan lebar 320 berisi kotak sumber dan dua baris konten di bawah label
"KONTEN LAIN DI OLAHRAGA".
```

```
Frame desktop 1440x900 bernama "Web / Favorit", latar #F6FBF8, header dengan menu Favorit aktif.
Judul "Favorit" dan kalimat "4 konten disimpan. Hanya Anda yang bisa melihat daftar ini."
Lalu empat baris konten mendatar bertumpuk dengan lebar maksimum 760.
Baris kedua digambar dalam keadaan disorot kursor: bayangannya naik jadi bayang-2 dan
di ujung kanannya muncul tombol ikon bulat merah berisi ikon keranjang sampah.
Baris lain tidak memperlihatkan tombol itu.
```

```
Frame desktop 1440x900 bernama "Web / Catatan harian", latar #F6FBF8,
header dengan menu "Catatan Harian" aktif dan tombol "Tambah catatan".
Judul halaman, lalu kalimat "Boleh mencatat beberapa kali dalam sehari. Catatan ini privat."
Lalu empat kotak ringkasan berjajar: Langkah 7 hari 41.870, Rata-rata tidur 7,1 jam,
Total olahraga 185 menit, Rata-rata air 6,4 gelas.
Lalu riwayat dikelompokkan per tanggal, tiap kelompok berisi kartu aktivitas dalam grid tiga kolom.
Kelompok "HARI INI · 15 AGUSTUS" berisi Olahraga, Langkah, dan Air minum.
Kelompok "14 AGUSTUS" berisi Tidur, Latihan pernapasan, dan Berat badan.
Tidak ada formulir di halaman ini.
```

```
Frame desktop 1440x900 bernama "Web / Profil", latar #F6FBF8, header seperti Beranda.
Judul "Profil" dan kalimat "Data akun Anda."
Dua kolom: kiri lebar 340 berisi kartu putih rata tengah dengan avatar inisial 80,
nama, email, dan tombol bahaya "Keluar". Jangan tambahkan kotak angka apa pun.
Kanan berisi kartu "Data diri" dengan input Nama, input Email yang tidak bisa diubah,
input Bio, dan tombol primer "Simpan perubahan"; lalu kartu "Ganti password" berisi
input Password lama, Password baru, dan tombol netral "Perbarui password".
```

## Prompt 6 — Papan alur layar

```
Buatkan halaman "Alur" berisi diagram perpindahan layar Healthy Life,
memakai kotak radius 12 berlatar putih dengan bayangan halus dan panah warna tinta-400.

Kelompok pertama berjudul "Tanpa login": kotak Landing dengan panah ke Register dan ke Login,
lalu Login dan Register saling terhubung dua arah,
dan panah dari Login ke Beranda berlabel "berhasil masuk".

Kelompok kedua berjudul "Sudah masuk": kotak Beranda, Favorit, Catatan Harian, dan Profil
saling terhubung dua arah berlabel "bottom tab di mobile, menu header di web".
Panah dari Beranda dan dari Favorit ke Detail Konten.
Panah dari Beranda dan dari Catatan Harian ke "Lembar catat" berlabel "tombol tambah".
Panah dari Favorit ke "Hapus dari favorit" berlabel "geser ke kiri".
Panah dari Profil ke Landing berlabel "keluar".

Di bawah diagram tulis catatan:
"Landing hanya menampilkan judul dan gambar sampul sebagai cuplikan. Isi konten tetap ditutup.
Membuka alamat konten mana pun tanpa token akan dilempar ke Login,
lalu dikembalikan ke alamat yang tadi dituju setelah berhasil masuk."
```

## Yang perlu dirapikan sendiri setelah Figma AI selesai

1. **Blend mode cincin harian.** Figma AI sering melewatkan Multiply pada ketiga lingkaran. Atur manual di panel Layer, kalau tidak bentuknya tidak akan terlihat menyatu.
2. **Gambar latar kartu aktivitas.** Ikon 96px di pojok kanan bawah harus dipotong tepi kartu dan diturunkan opasitasnya ke 13 persen.
3. **Gambar sampul.** Ganti dengan gambar sesuai topik. Kalau ingin sama persis dengan aplikasi, ambil `imageUrl` dari berkas JSON di folder `content/`.
4. **Pemotongan teks.** Judul kartu dua baris, kutipan dua baris, lewat properti truncate.
5. **Komponen dan variant.** Ubah kartu konten, kartu aktivitas, tombol, input, chip, dan avatar menjadi component dengan variant.
6. **Penamaan frame.** Samakan dengan nama di prompt supaya urutannya rapi.

## Daftar frame yang harus ada saat dikumpulkan

| Halaman Figma | Isi |
|---|---|
| Design System | Swatch warna termasuk enam warna aktivitas, text style, radius, bayangan |
| Komponen | Sepuluh komponen dasar dan empat komponen khas Healthy Life |
| Mobile | 19 frame 390 × 844, termasuk enam lembar tambah catatan dan dua frame sesi latihan pernapasan |
| Web | 8 frame 1440 × 900 |
| Alur | Satu diagram perpindahan layar |
