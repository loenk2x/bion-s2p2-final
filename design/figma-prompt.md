# Prompt Figma untuk Healthy Life

Berkas ini berisi prompt siap tempel supaya Anda tidak menggambar dari nol di Figma. Nilai warna, ukuran, dan teks di dalamnya sama persis dengan `design-system.md` dan `mockups.html`, jadi hasil di Figma akan konsisten dengan aplikasi yang nanti dibangun.

## Cara memakainya

1. Buat file Figma baru bernama **Healthy Life — Final LO4**.
2. Buka **Figma AI → First Draft** (ikon bintang di toolbar, atau tekan `Ctrl+K` lalu pilih First Draft).
3. Tempel **Prompt 1** dulu untuk membuat fondasinya, lalu jalankan prompt layar satu per satu.
4. Setelah frame jadi, rapikan manual: samakan nama layer, jadikan komponen untuk kartu dan tombol, lalu susun frame berurutan sesuai peta alur di bagian akhir.

Kalau hasil Figma AI meleset dari yang diminta, buka `mockups.html` di browser berdampingan dengan Figma dan pakai sebagai acuan visual saat merapikan.

## Prompt 1 — Fondasi design system

```
Buatkan halaman "Design System" untuk aplikasi edukasi kesehatan bernama Healthy Life.
Bahasa antarmuka: Bahasa Indonesia. Mode terang saja, tanpa mode gelap.

Buat color variables dengan nama dan nilai persis seperti ini:
hijau-700 #0E6E49, hijau-600 #128A5B, hijau-500 #19A96F, hijau-100 #DCF3E8, hijau-50 #F1FAF5,
jingga-500 #F2762E, jingga-100 #FDE8DA,
tinta-900 #12211B, tinta-600 #4B5B54, tinta-400 #84968D,
garis #E2EBE6, putih #FFFFFF, latar #F6FBF8,
bahaya #D2453C, bahaya-100 #FBE4E2, peringatan #C9820A.

Buat text styles memakai font Inter:
judul-besar 28/34 Bold, judul-1 22/28 Bold, judul-2 18/24 SemiBold,
badan 15/22 Regular, badan-tebal 15/22 SemiBold, kecil 13/18 Regular,
label 12/16 SemiBold, angka-besar 26/30 Bold.

Buat effect styles:
bayang-1 = drop shadow 0 1 2 rgba(18,33,27,0.06) ditambah 0 1 3 rgba(18,33,27,0.04),
bayang-2 = drop shadow 0 4 12 rgba(18,33,27,0.08).

Radius yang dipakai: 8 untuk input dan lencana, 12 untuk kartu dan tombol,
16 untuk modal, 999 untuk chip dan avatar.
Skala jarak kelipatan empat: 4, 8, 12, 16, 20, 24, 32, 40, 48.

Tampilkan semuanya sebagai papan contoh: baris swatch warna dengan nama dan kode hex di bawahnya,
daftar contoh text style, dan contoh kotak untuk tiap radius dan tiap bayangan.
```

## Prompt 2 — Komponen

```
Di halaman "Komponen", buatkan komponen berikut untuk Healthy Life memakai variable
dan text style yang sudah ada. Semua sudut membulat sesuai radius yang disebut.

1. Tombol, tinggi 44, radius 12, padding kiri kanan 20, teks badan-tebal. Lima varian:
   primer (latar hijau-600, teks putih), sekunder (latar putih, teks hijau-600, garis 1px hijau-600),
   netral (latar putih, teks tinta-900, garis 1px garis), bahaya (latar putih, teks bahaya, garis 1px bahaya),
   teks (tanpa latar, teks hijau-600). Tambahkan varian nonaktif: latar garis, teks tinta-400.
   Buat juga ukuran kecil tinggi 36 padding 14.

2. Input, tinggi 48, radius 8, garis 1px garis, latar putih, padding kiri kanan 14.
   Label di atas input memakai label warna tinta-600.
   Keadaan fokus: garis hijau-600 ditambah cincin luar 3px hijau-100.
   Keadaan galat: garis bahaya, ditambah teks galat 12/16 warna bahaya di bawah input.

3. Chip kategori, tinggi 34, radius penuh, padding 14, teks kecil.
   Tidak aktif: latar putih, garis 1px garis, teks tinta-600.
   Aktif: latar hijau-600, teks putih, tanpa garis.

4. Lencana tipe konten, tinggi 22, radius 8, padding 8, teks label. Tiga varian:
   Artikel (latar #DCF3E8, teks #0E6E49), Video (latar #FDE8DA, teks #9A3F0B),
   Infografis (latar #DDEAFB, teks #1A4E8A).

5. Avatar inisial: lingkaran berisi dua huruf tebal warna putih, ukuran 40, 56, dan 80.
   Warna latar diambil dari lima nilai: #128A5B, #F2762E, #2D7FF9, #7A5AF8, #0E9DA8.

6. Kartu konten lebar 340: gambar sampul rasio 16:9 di atas, lencana tipe di pojok kiri atas gambar,
   tombol simpan berbentuk lingkaran putih 36 di pojok kanan atas gambar,
   lalu bagian teks dengan padding 16 berisi judul judul-2 maksimal dua baris,
   kutipan kecil warna tinta-600 maksimal dua baris, dan baris keterangan
   "Olahraga · 5 menit baca" memakai label warna tinta-400.
   Latar putih, radius 12, efek bayang-1.

7. Baris konten mendatar: gambar 96x72 radius 8 di kiri, judul dua baris dan keterangan di tengah,
   tombol simpan di kanan. Latar putih, radius 12, padding 10, efek bayang-1.

8. Kotak ringkasan: label kecil di atas, angka besar di bawah, satuan kecil di samping angka.
   Latar putih, radius 12, padding 16, efek bayang-1.

9. Bottom tab mobile, lebar 390, tinggi 64, latar putih, garis atas 1px garis, efek bayang-2.
   Empat item: Beranda, Favorit, Catatan, Profil. Ikon 24 di atas label 12/16.
   Item aktif hijau-600, item lain tinta-400.

10. Keadaan kosong: ikon garis 48 warna tinta-400, judul judul-2, satu kalimat kecil warna tinta-600,
    dan satu tombol primer. Rata tengah, jarak antarunsur 12.
```

## Prompt 3 — Tujuh layar mobile

Ukuran frame: **390 × 844**. Jalankan satu per satu, jangan digabung dalam satu prompt.

### Register

```
Frame mobile 390x844 bernama "Mobile / Register", latar #F6FBF8.
Isi dari atas: logo Healthy Life (kotak hijau-600 radius 9 berisi ikon daun putih, di sampingnya
teks "Healthy Life" 17 Bold), judul "Buat akun" judul-besar, kalimat penjelas
"Daftar dulu untuk membuka semua artikel, video, dan infografis kesehatan." memakai badan warna tinta-600.
Lalu empat input berlabel: Nama lengkap berisi "Wiguno", Email berisi "wiguno@email.com",
Password dalam keadaan fokus, dan Konfirmasi password dalam keadaan galat dengan pesan
"Konfirmasi password belum sama".
Di bawahnya tombol primer selebar layar bertuliskan "Daftar",
lalu teks rata tengah "Sudah punya akun? Masuk" dengan kata "Masuk" berwarna hijau-600.
Padding kiri kanan 16, jarak antar-input 16. Tanpa bottom tab.
```

### Login

```
Frame mobile 390x844 bernama "Mobile / Login", latar #F6FBF8.
Bagian atas rata tengah: kotak hijau-600 64x64 radius 20 berisi ikon daun putih,
judul "Healthy Life" judul-besar, kalimat "Masuk untuk melanjutkan" badan warna tinta-600.
Lalu input Email berisi "demo@healthylife.id" dan input Password berisi titik-titik dengan ikon mata di kanan.
Di kanan bawah input password ada tautan teks "Lupa password?" warna hijau-600.
Lalu tombol primer selebar layar "Masuk", di bawahnya tombol sekunder selebar layar "Isi akun demo".
Paling bawah teks rata tengah "Belum punya akun? Daftar" dengan kata "Daftar" berwarna hijau-600.
Tanpa bottom tab.
```

### Beranda

```
Frame mobile 390x844 bernama "Mobile / Beranda", latar #F6FBF8.
Baris atas: di kiri sapaan "Halo, Wiguno" judul-1 dan tanggal "Sabtu, 15 Agustus 2026" kecil warna tinta-600,
di kanan avatar inisial 40 berwarna #128A5B berisi "WG".
Lalu dua kotak ringkasan bersebelahan: "Langkah hari ini" bernilai 6.240 dan "Air minum" bernilai 5 gelas.
Lalu kolom pencarian tinggi 48 dengan ikon kaca pembesar dan placeholder
"Cari artikel, video, infografis".
Lalu deret chip kategori mendatar: Semua dalam keadaan aktif, lalu Pola Hidup Sehat, Gizi Seimbang,
Olahraga, Kesehatan Mental, Pencegahan Penyakit.
Lalu tab tipe konten berbentuk pil dengan latar #EDF3F0 berisi empat pilihan:
Semua yang aktif berlatar putih, lalu Artikel, Video, Infografis.
Lalu dua kartu konten bertumpuk:
kartu pertama berjudul "Manfaat Jalan Kaki 30 Menit Setiap Hari", lencana Artikel,
keterangan "Olahraga · 5 menit baca", tombol simpan dalam keadaan tersimpan;
kartu kedua berjudul "Manfaat Olahraga Sesuai Usia", lencana Video,
keterangan "Olahraga · 2 menit", tombol simpan dalam keadaan belum tersimpan.
Paling bawah pasang bottom tab dengan tab Beranda aktif.
Padding kiri kanan 16.
```

### Detail konten

```
Frame mobile 390x844 bernama "Mobile / Detail konten", latar #F6FBF8.
Paling atas gambar sampul selebar layar setinggi 220, dengan tombol kembali berbentuk
lingkaran putih 40 di pojok kiri atas gambar.
Di bawahnya lencana Artikel, judul "Manfaat Jalan Kaki 30 Menit Setiap Hari" judul-besar,
baris keterangan "Olahraga · 5 menit baca · Tim Healthy Life" memakai label warna tinta-400.
Lalu dua paragraf isi memakai badan dengan satu subjudul judul-2 bertuliskan "Apa yang terjadi pada tubuh".
Lalu kotak sumber: latar putih, garis 1px garis, radius 12, berisi label "SUMBER" warna tinta-400
dan teks "Kementerian Kesehatan RI — ayosehat.kemkes.go.id" warna hijau-600.
Di atas bottom tab, tempel bilah putih menempel berisi tombol primer selebar layar
bertuliskan "Tersimpan di Favorit" dengan ikon bookmark terisi.
Paling bawah bottom tab dengan tab Beranda aktif.
Padding kiri kanan 16.
```

### Favorit

```
Frame mobile 390x844 bernama "Mobile / Favorit", latar #F6FBF8.
Header putih tinggi 64 dengan judul "Favorit" judul-2 di kiri, garis bawah 1px garis.
Di bawahnya teks "4 KONTEN DISIMPAN" memakai label warna tinta-400.
Lalu empat baris konten mendatar bertumpuk dengan jarak 8, masing-masing berisi gambar,
judul dua baris, keterangan, dan tombol simpan dalam keadaan tersimpan. Judulnya:
"Manfaat Jalan Kaki 30 Menit Setiap Hari" keterangan "Olahraga · Artikel · 5 menit",
"Infografis Isi Piringku: Panduan Porsi Makan Sehari-hari" keterangan "Gizi Seimbang · Infografis · 3 menit",
"Pentingnya Tidur Cukup untuk Kesehatan" keterangan "Pola Hidup Sehat · Artikel · 4 menit",
"Mengelola Stres dalam Kehidupan Sehari-hari" keterangan "Kesehatan Mental · Artikel · 5 menit".
Paling bawah bottom tab dengan tab Favorit aktif. Padding kiri kanan 16.
```

### Catatan harian

```
Frame mobile 390x844 bernama "Mobile / Catatan harian", latar #F6FBF8.
Header putih tinggi 64 dengan judul "Catatan Harian".
Lalu label "RINGKASAN 7 HARI" warna tinta-400, diikuti dua kotak ringkasan bersebelahan:
"Total langkah" bernilai 41.870 dan "Rata-rata tidur" bernilai 7,1 jam.
Lalu satu kartu putih radius 12 padding 16 berjudul "Catat aktivitas" berisi
empat input dalam susunan dua kolom: Langkah berisi 3.120, Gelas air berisi 3,
Jam tidur kosong dengan placeholder 7, Menit olahraga berisi 25.
Di bawahnya baris Mood berisi empat kotak pilihan emoji 😞 😐 🙂 😄
dengan pilihan ketiga aktif bergaris hijau-600 dan latar hijau-50.
Lalu input Catatan dengan placeholder "Jalan pagi keliling komplek",
dan tombol primer selebar kartu bertuliskan "Simpan catatan".
Di bawah kartu, riwayat dikelompokkan per tanggal: label "HARI INI · 15 AGUSTUS"
diikuti dua kartu catatan, masing-masing berisi jam di atas dan ringkasan angka di bawah.
Paling bawah bottom tab dengan tab Catatan aktif. Padding kiri kanan 16.
```

Buat juga satu frame kembar bernama **Mobile / Catatan harian — tergulir** yang hanya berisi header dan daftar riwayat tiga kelompok tanggal, karena di layar 844 riwayatnya berada di bawah lipatan.

### Profil

```
Frame mobile 390x844 bernama "Mobile / Profil", latar #F6FBF8.
Header putih tinggi 64 dengan judul "Profil".
Bagian atas rata tengah: avatar inisial 80 berwarna #128A5B berisi "WG",
nama "Wiguno" judul-1, email "wiguno@email.com" kecil warna tinta-600.
Lalu dua kotak ringkasan bersebelahan: "Favorit" bernilai 4 dan "Catatan" bernilai 12.
Lalu kartu putih berisi input Nama berisi "Wiguno", input Bio dengan placeholder
"Ceritakan sedikit tentang Anda", dan tombol primer selebar kartu "Simpan perubahan".
Lalu kartu putih berjudul "Keamanan" berisi tombol netral selebar kartu "Ganti password".
Paling bawah tombol bahaya selebar layar bertuliskan "Keluar" dengan ikon keluar.
Lalu bottom tab dengan tab Profil aktif. Padding kiri kanan 16.
```

## Prompt 4 — Tujuh halaman web

Ukuran frame: **1440 × 900**, isi ditaruh di tengah dengan lebar maksimum 1120.

### Register dan Login

```
Frame desktop 1440x900 bernama "Web / Register".
Bagi layar jadi dua kolom sama lebar.
Kolom kiri berlatar hijau-600: logo Healthy Life warna putih di atas,
judul putih 40/48 Bold "Belajar hidup sehat, satu langkah tiap hari.",
dan paragraf putih 17/26 "20 artikel, video, dan infografis dari sumber tepercaya.
Simpan yang penting, catat aktivitas harian Anda."
Kolom kanan berlatar #F6FBF8 berisi form selebar 400 rata tengah:
judul "Buat akun" 34/40 Bold, kalimat "Registrasi wajib sebelum membuka konten.",
input Nama lengkap, Email, Password, dan Konfirmasi password,
tombol primer selebar form "Daftar", lalu teks "Sudah punya akun? Masuk".
```

Untuk Login, pakai prompt yang sama dengan tiga perubahan: nama frame **Web / Login**, judul kolom kiri menjadi "Selamat datang kembali." dengan paragraf "Favorit dan catatan harian Anda tersimpan dan hanya bisa dilihat oleh Anda sendiri.", dan form kanan berisi Email, Password, tombol primer "Masuk", tombol sekunder "Isi akun demo", lalu teks "Belum punya akun? Daftar".

### Beranda

```
Frame desktop 1440x900 bernama "Web / Beranda", latar #F6FBF8.
Header putih tinggi 64 dengan garis bawah 1px garis: logo Healthy Life di kiri,
menu mendatar Beranda Favorit "Catatan Harian" di sampingnya dengan Beranda aktif berwarna hijau-600,
lalu di kanan nama "Wiguno" dan avatar inisial 40.
Isi ditaruh di tengah dengan lebar 1120 dan padding atas 28.
Baris pertama: di kiri judul "Halo, Wiguno" 34/40 Bold dan kalimat
"Sabtu, 15 Agustus 2026 — sudah 6.240 langkah hari ini.", di kanan kolom pencarian lebar 340.
Lalu empat kotak ringkasan sejajar: Langkah hari ini 6.240, Air minum 5 gelas,
Olahraga 25 menit, Favorit 4 konten.
Lalu satu baris berisi enam chip kategori dengan chip Semua aktif.
Lalu satu baris berisi tab tipe konten lebar 340 dan teks "20 KONTEN" di sampingnya.
Lalu grid kartu konten tiga kolom dengan jarak 20, berisi enam kartu.
```

### Detail konten

```
Frame desktop 1440x900 bernama "Web / Detail konten", latar #F6FBF8.
Header sama seperti Beranda.
Di bawah header, tautan "← Kembali ke Beranda" warna hijau-600.
Lalu dua kolom: kolom kiri lebar sisa, kolom kanan tetap 320, jarak antar-kolom 32.
Kolom kiri: pemutar video rasio 16:9 berlatar gelap dengan tombol putar bundar putih di tengah,
lalu lencana Video, judul "Manfaat Olahraga Sesuai Usia" 34/40 Bold,
keterangan "Olahraga · 2 menit · CNN Indonesia", lalu dua paragraf isi
dengan lebar teks dibatasi 68 karakter dan satu subjudul "Poin utama".
Kolom kanan: kotak sumber berisi "CNN Indonesia — youtube.com",
tombol primer selebar kolom "Simpan ke Favorit",
lalu label "KONTEN LAIN DI OLAHRAGA" dan dua baris konten mendatar.
```

### Favorit, Catatan harian, Profil

```
Frame desktop 1440x900 bernama "Web / Favorit", latar #F6FBF8, header sama seperti Beranda
dengan menu Favorit yang aktif. Judul halaman "Favorit" 34/40 Bold,
kalimat "4 konten disimpan. Hanya Anda yang bisa melihat daftar ini.",
lalu grid kartu konten tiga kolom berisi empat kartu, semuanya dalam keadaan tersimpan.
```

```
Frame desktop 1440x900 bernama "Web / Catatan harian", latar #F6FBF8, header dengan menu
"Catatan Harian" aktif. Judul halaman "Catatan Harian",
kalimat "Boleh mencatat beberapa kali dalam sehari. Catatan ini privat."
Lalu empat kotak ringkasan sejajar: Total langkah 7 hari 41.870, Rata-rata tidur 7,1 jam,
Total olahraga 185 menit, Rata-rata air 6,4 gelas.
Lalu dua kolom: kiri lebar 400 berisi kartu "Catat aktivitas" lengkap dengan empat input,
baris mood, input catatan, dan tombol "Simpan catatan";
kanan berisi riwayat yang dikelompokkan per tanggal dengan judul kelompok
"HARI INI · 15 AGUSTUS — 2 CATATAN", "14 AGUSTUS — 1 CATATAN", "13 AGUSTUS — 2 CATATAN",
masing-masing berisi kartu catatan dengan jam dan ringkasan angka.
```

```
Frame desktop 1440x900 bernama "Web / Profil", latar #F6FBF8, header sama seperti Beranda.
Judul halaman "Profil" dan kalimat "Data akun dan ringkasan aktivitas Anda."
Lalu dua kolom: kiri lebar 340 berisi kartu putih rata tengah dengan avatar inisial 80,
nama, email, dua kotak ringkasan Favorit 4 dan Catatan 12, serta tombol bahaya "Keluar";
kanan berisi kartu "Data diri" dengan input Nama, input Email dalam keadaan tidak bisa diubah,
input Bio, dan tombol primer "Simpan perubahan", lalu kartu "Ganti password" berisi
input Password lama, input Password baru, dan tombol netral "Perbarui password".
```

## Prompt 5 — Papan alur layar

```
Buatkan satu halaman bernama "Alur" berisi diagram alur perpindahan layar Healthy Life,
memakai kotak radius 12 berlatar putih dengan bayangan halus dan panah warna tinta-400.

Kelompok pertama berjudul "Belum masuk": kotak Login dan Register saling terhubung dua arah,
lalu panah dari Login ke Beranda dengan label "berhasil masuk".

Kelompok kedua berjudul "Sudah masuk": kotak Beranda, Favorit, Catatan Harian, dan Profil
saling terhubung dua arah dengan label "bottom tab di mobile, menu header di web".
Panah dari Beranda ke Detail Konten dan dari Favorit ke Detail Konten.
Panah dari Profil ke Login dengan label "keluar".

Di bawah diagram, tulis satu catatan:
"Membuka alamat mana pun tanpa token akan dilempar ke Login,
lalu dikembalikan ke alamat yang tadi dituju setelah berhasil masuk."
```

## Yang perlu dirapikan sendiri setelah Figma AI selesai

Figma AI biasanya tidak sempurna di empat hal ini:

1. **Gambar sampul.** Ganti gambar bawaan dengan gambar yang sesuai topik. Kalau ingin sama persis dengan aplikasi, ambil `imageUrl` dari berkas JSON di folder `content/`.
2. **Pemotongan teks.** Judul kartu harus dibatasi dua baris dan kutipan juga dua baris. Atur lewat properti truncate di panel text.
3. **Komponen.** Ubah kartu konten, tombol, input, chip, dan avatar menjadi component dengan variant, supaya perubahan warna cukup dilakukan sekali.
4. **Penamaan frame.** Samakan dengan nama di prompt, misalnya `Mobile / Beranda` dan `Web / Beranda`, supaya urutannya rapi saat dikumpulkan.

## Daftar frame yang harus ada saat dikumpulkan

| Halaman Figma | Isi |
|---|---|
| Design System | Swatch warna, text style, radius, bayangan |
| Komponen | Sepuluh komponen dari Prompt 2 |
| Mobile | 8 frame 390 × 844, termasuk Catatan harian keadaan tergulir |
| Web | 7 frame 1440 × 900 |
| Alur | Satu diagram perpindahan layar |
