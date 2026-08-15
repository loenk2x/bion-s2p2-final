# Design System Healthy Life

Satu design system dipakai bersama oleh aplikasi web dan aplikasi mobile. Nilai di dokumen ini adalah sumber kebenaran: web menurunkannya jadi CSS variable di `web/src/styles/tokens.css`, mobile menurunkannya jadi objek tema di `mobile/src/theme.js`, dan Figma menurunkannya jadi variable dan style.

Mode terang saja. Tidak ada mode gelap.

## Prinsip yang dipegang

1. **Mobile-first.** Tata letak dirancang untuk lebar 390px dulu, baru dilebarkan lewat breakpoint. Web bukan desain desktop yang dikecilkan.
2. **Satu wajah di dua platform.** Warna, tipografi, jarak, dan bentuk kartu identik. Yang berbeda hanya cara berpindah halaman dan cara memicu aksi, karena mobile punya gestur dan web punya kursor.
3. **Konten lebih dulu.** Di halaman riwayat, yang harus terlihat pertama adalah riwayatnya, bukan formulir pengisian.
4. **Warna dipakai untuk arti, bukan hiasan.** Hijau berarti aksi utama, jingga berarti aksen, merah berarti galat. Enam warna jenis aktivitas hanya boleh muncul di kartu riwayat, cincin harian, dan lembar pencatatan.

## Warna

### Warna utama dan aksen

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `hijau-700` | `#0E6E49` | Keadaan ditekan pada tombol primer, teks di atas latar hijau muda |
| `hijau-600` | `#128A5B` | Tombol primer, tautan, chip aktif, ikon tab aktif, tombol tambah |
| `hijau-500` | `#19A96F` | Aksen grafik |
| `hijau-100` | `#DCF3E8` | Latar lembut, cincin fokus |
| `hijau-50` | `#F1FAF5` | Latar kartu bersorot, panel cuplikan di landing |
| `jingga-500` | `#F2762E` | Aksen, lencana tipe video |
| `jingga-100` | `#FDE8DA` | Latar lembut aksen |

### Warna netral dan status

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `tinta-900` | `#12211B` | Judul dan teks utama |
| `tinta-600` | `#4B5B54` | Teks sekunder, keterangan |
| `tinta-400` | `#84968D` | Teks nonaktif, placeholder, ikon tab tidak aktif |
| `garis` | `#E2EBE6` | Garis pembatas, batas input |
| `putih` | `#FFFFFF` | Permukaan kartu, isi input |
| `latar` | `#F6FBF8` | Latar halaman, putih kehijauan |
| `bahaya` | `#D2453C` | Pesan galat, tombol hapus, panel geser hapus |
| `bahaya-100` | `#FBE4E2` | Latar kotak galat |
| `peringatan` | `#C9820A` | Peringatan ringan |

### Warna jenis aktivitas

Enam warna ini menandai jenis catatan harian. Dipakai di kartu riwayat, cincin harian, pilihan tombol tambah, dan lembar pencatatan — tidak di tempat lain.

| Jenis | Kunci di database | Token | Nilai | Ikon | Satuan |
|---|---|---|---|---|---|
| Langkah | `steps` | `ak-langkah` | `#F2762E` | jejak kaki | langkah |
| Olahraga | `exercise` | `ak-olahraga` | `#19A96F` | orang berlari | menit |
| Air minum | `water` | `ak-air` | `#2D7FF9` | tetes air | gelas |
| Tidur | `sleep` | `ak-tidur` | `#7A5AF8` | bulan sabit | jam |
| Latihan pernapasan | `breathing` | `ak-napas` | `#0E9DA8` | tiga cincin sepusat | menit |
| Berat badan | `weight` | `ak-berat` | `#C9820A` | timbangan | kg |

Enam jenis ini adalah seluruh jenis yang bisa dicatat aplikasi. Tidak ada jenis lain.

**Mood bukan jenis tersendiri.** Mengikuti pola Huawei Health, mood hanya ditanyakan di akhir sesi latihan pernapasan dan disimpan sebagai field tambahan pada catatan `breathing`. Tidak ada tombol "catat mood" yang berdiri sendiri di mana pun.

### Warna lencana tipe konten

| Tipe | Teks lencana | Warna teks | Warna latar |
|---|---|---|---|
| `article` | Artikel | `#0E6E49` | `#DCF3E8` |
| `video` | Video | `#9A3F0B` | `#FDE8DA` |
| `infographic` | Infografis | `#1A4E8A` | `#DDEAFB` |

Kategori konten tidak punya warna sendiri. Chip kategori memakai netral saat tidak aktif dan `hijau-600` saat aktif.

## Tipografi

Font: **Inter**. Kalau tidak tersedia, jatuh ke `-apple-system, "Segoe UI", Roboto, Arial, sans-serif`.

| Token | Ukuran / tinggi baris | Tebal | Dipakai untuk |
|---|---|---|---|
| `judul-besar` | 28 / 34 | 700 | Judul halaman detail, judul Register dan Login |
| `judul-1` | 22 / 28 | 700 | Sapaan di Beranda, judul lembar pencatatan |
| `judul-2` | 18 / 24 | 600 | Judul kartu konten, judul kelompok |
| `badan` | 15 / 22 | 400 | Teks isi, isi input |
| `badan-tebal` | 15 / 22 | 600 | Label tombol |
| `kecil` | 13 / 18 | 400 | Kutipan kartu, keterangan |
| `label` | 12 / 16 | 600 | Label input, teks lencana, label tab, jam pada kartu aktivitas |
| `angka-besar` | 26 / 30 | 700 | Angka pada kotak ringkasan |
| `angka-aktivitas` | 22 / 28 | 700 | Angka pada kartu aktivitas |
| `angka-sorot` | 44 / 48 | 700 | Angka pada lembar pencatatan |

Di layar 1024px ke atas, `judul-besar` naik ke 34 / 40 dan `judul-1` naik ke 26 / 32. Panjang baris teks isi dibatasi 68 karakter.

## Jarak, bentuk, dan bayangan

Skala jarak kelipatan 4: **4, 8, 12, 16, 20, 24, 32, 40, 48**. Padding dalam kartu 16, jarak antarkartu 8 sampai 12, padding kiri kanan layar mobile 16, jarak antarbagian 24. Lebar isi maksimum di web 1120px.

| Token | Nilai |
|---|---|
| `radius-sm` | 8px — input, lencana, gambar kecil |
| `radius-md` | 12px — kartu, tombol, kartu aktivitas |
| `radius-lg` | 16px — kartu cincin harian, lembar dari bawah |
| `radius-penuh` | 999px — chip, avatar, tombol tambah, tombol ikon bulat |
| `bayang-1` | `0 1px 2px rgba(18,33,27,.06), 0 1px 3px rgba(18,33,27,.04)` |
| `bayang-2` | `0 4px 12px rgba(18,33,27,.08)` |
| `bayang-3` | `0 8px 24px rgba(18,33,27,.16)` — tombol tambah dan lembar dari bawah |

## Breakpoint

| Nama | Lebar | Perubahan tata letak |
|---|---|---|
| Dasar | 0–639px | Satu kolom, navigasi lewat bottom tab, tombol tambah mengambang |
| `sm` | 640px | Daftar konten dua kolom |
| `lg` | 1024px | Daftar konten tiga kolom, bottom tab diganti header, tombol tambah pindah ke header |

## Komponen

### Tombol

| Jenis | Latar | Teks | Batas |
|---|---|---|---|
| Primer | `hijau-600` | `putih` | tidak ada |
| Sekunder | `putih` | `hijau-600` | 1px `hijau-600` |
| Netral | `putih` | `tinta-900` | 1px `garis` |
| Bahaya | `putih` | `bahaya` | 1px `bahaya` |
| Teks | tanpa latar | `hijau-600` | tidak ada |

Tinggi 44px, ukuran kecil 36px, radius `radius-md`, padding 20. Ukuran sentuh minimum 44 × 44px.

### Tombol ikon bulat

Lingkaran 40px, latar `putih`, batas 1px `garis`, ikon 20px warna `tinta-600`. Keadaan aktif memakai ikon `hijau-600`, latar `hijau-50`, batas `hijau-100`. Dipakai untuk simpan favorit, bagikan, dan kembali.

Saat berada di atas gambar sampul, batasnya dihilangkan dan latarnya menjadi putih 94% dengan `bayang-1`.

### Input

Tinggi 48px, radius `radius-sm`, batas 1px `garis`, padding 14. Label di atas input memakai `label` warna `tinta-600`. Fokus: batas `hijau-600` dengan cincin 3px `hijau-100`. Galat: batas `bahaya` dan pesan galat 12/16 warna `bahaya` di bawahnya.

### Dua penyaring yang sengaja dibedakan

Kategori dan tipe konten adalah dua sumbu penyaringan yang berbeda, jadi bentuknya harus berbeda jauh supaya tidak tertukar.

- **Chip kategori** — pil tinggi 34, radius penuh, disusun mendatar dan bisa digeser. Tidak aktif: latar putih, batas `garis`, teks `tinta-600`. Aktif: latar `hijau-600`, teks putih.
- **Tab tipe konten** — tab bergaris bawah, tanpa latar, teks 14/18 tebal. Tidak aktif: `tinta-400`. Aktif: `hijau-700` dengan garis bawah 2px `hijau-600`. Selalu diletakkan di bawah chip kategori dan menempel pada garis pembatas.

### Kartu konten

Gambar sampul 16:9, lencana tipe di pojok kiri atas, tombol simpan bulat 36px di pojok kanan atas. Bagian teks padding 16: judul `judul-2` maksimal 2 baris, kutipan `kecil` warna `tinta-600` maksimal 2 baris, baris keterangan `label` warna `tinta-400`. Latar putih, radius `radius-md`, `bayang-1`.

### Baris konten

Gambar 96 × 72 radius `radius-sm` di kiri, judul dua baris dan keterangan di tengah. Latar putih, radius `radius-md`, padding 10, `bayang-1`.

### Baris geser hapus

Baris konten yang bisa digeser ke kiri sejauh 84px, memunculkan panel `bahaya` berisi ikon keranjang 22px dan kata "Hapus" 11/14 warna putih. Hanya di mobile.

Di web tidak ada gestur geser. Sebagai gantinya, tombol ikon bulat berwarna `bahaya` muncul di ujung kanan baris saat kursor berada di atasnya, dan bayangan baris naik ke `bayang-2`.

### Cincin harian

Tiga pasang lingkaran bertumpuk dalam satu kartu putih radius `radius-lg`, mengikuti pola Huawei Health. Tiap sumbu punya dua lingkaran di posisi yang sama: **bayangan** yang selalu sebesar target dan tidak pernah berubah, dan **lingkaran aktif** di atasnya yang ukurannya mengikuti capaian. Jarak antara tepi keduanya itulah sisa yang belum tercapai.

Kanvasnya `viewBox="0 0 240 160"`.

| Sumbu | Warna | Posisi | Jari-jari target | Isi | Target bawaan |
|---|---|---|---|---|---|
| Gerak | `ak-langkah` `#F2762E` | 120, 54 | 46 | jumlah seluruh catatan `steps` hari itu | 10.000 langkah |
| Tidur | `ak-tidur` `#7A5AF8` | 82, 106 | 40 | catatan `sleep` terakhir hari itu | 8 jam |
| Relaksasi | `ak-napas` `#0E9DA8` | 158, 106 | 33 | jumlah catatan `breathing` hari itu | 3 sesi |

**Bayangan** digambar dua lapis: isian warna sumbunya pada opasitas 10%, ditambah garis tepi 1,5px warna yang sama pada opasitas 28%. Bayangan tidak memakai blend mode dan tidak ikut bergerak.

**Lingkaran aktif** memakai warna sumbunya pada opasitas 80% dengan `mix-blend-mode: multiply`, sehingga bagian yang bertumpuk menggelap dan ketiganya terbaca sebagai satu bentuk.

Ukurannya dihitung dari luas, bukan dari lebar:

```
r = rTarget × max(0,18, √(capaian ÷ target))
```

Akar kuadratnya dipakai supaya luas lingkaran sebanding dengan capaian. Kalau jari-jari yang disebandingkan langsung, capaian 50% hanya menghasilkan seperempat luas bayangan dan pagi hari terasa jauh lebih kosong daripada kenyataannya. Batas bawah 18% menjaga capaian nol tetap terlihat sebagai titik, bukan hilang sama sekali.

Kalau target terlampaui, lingkaran berhenti di ukuran bayangan supaya ketiganya tidak saling menabrak, dan kelebihannya ditandai cincin putih 1,5px pada opasitas 75% di dalam tepinya. Angka di legenda tetap menampilkan nilai sebenarnya.

Di dalam tiap lingkaran ada ikon putih 20–24px: orang berlari, bulan sabit, dan tiga cincin sepusat.

#### Denyut

Lingkaran aktif tidak tumbuh dari nol saat layar dibuka. Ia langsung digambar sebesar capaian, lalu mengembang dan mengempis pelan di sekitar ukuran itu.

```css
@keyframes denyut { 0%, 100% { transform: scale(1) } 50% { transform: scale(1.045) } }
.cincin-aktif {
  transform-box: fill-box;
  transform-origin: center;
  mix-blend-mode: multiply;
  animation: denyut 3.6s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) { .cincin-aktif { animation: none } }
```

Jeda awal tiap lingkaran dibuat berbeda — `0s`, `-1.2s`, dan `-2.4s` — supaya ketiganya tidak berdenyut serempak seperti satu benda. Jangkar penskalaannya di pusat masing-masing lingkaran, jadi bayangan target tetap diam dan sisa capaian tetap terbaca.

#### Legenda

Di bawah grafik ada tiga kolom yang dipisah garis tipis. Tiap kolom berisi tiga baris:

1. Titik warna 8px dan nama sumbu, memakai `label` warna `tinta-600`
2. Angka capaian 19/24 tebal warna `tinta-900`, langsung diikuti target berukuran 12/16 tebal warna `tinta-400` — misalnya **6.240**/10.000
3. Satuan 11/15 warna `tinta-400`

Target sengaja lebih kecil dan lebih pudar supaya terbaca sebagai konteks, bukan sebagai angka kedua yang setara. Tidak ada lagi lencana pil "sekian dari tiga target" di pojok kartu; targetnya sudah tertulis per sumbu.

Mengetuk lingkaran Relaksasi membuka jalur latihan pernapasan, sama seperti memilihnya dari tombol tambah.

Alasan tiap pilihan di atas, beserta perbandingan yang membuatnya dipilih, tercatat di `design/cincin-harian.html`.

### Kartu aktivitas

Satu kartu untuk satu catatan, bukan satu kartu berisi semua angka. Latar putih, radius `radius-md`, padding 14, `bayang-1`, dengan tiga penanda jenis:

1. Batang warna jenis aktivitas selebar 4px menempel di sisi kiri kartu.
2. Ikon jenis aktivitas berukuran 96px di pojok kanan bawah dengan opasitas 13%, terpotong tepi kartu, sebagai gambar latar.
3. Nama jenis aktivitas 12/16 tebal berwarna sesuai jenisnya.

Isi kartu dari atas: jam pencatatan `label` warna `tinta-400`, nilai `angka-aktivitas` dengan satuan `kecil` warna `tinta-400` di sampingnya, nama jenis, lalu catatan opsional `kecil` warna `tinta-600`.

Keenam jenis memakai susunan yang sama persis; yang berbeda hanya warna, ikon, angka, dan satuannya:

| Jenis | Contoh isi kartu | Baris catatan |
|---|---|---|
| Langkah | 3.120 langkah | catatan bebas kalau diisi |
| Olahraga | 25 menit | catatan bebas kalau diisi |
| Air minum | 3 gelas | catatan bebas kalau diisi |
| Tidur | 7,1 jam | catatan bebas kalau diisi |
| Latihan pernapasan | 3 menit | "Perasaan setelah sesi: 🙂 Biasa saja" |
| Berat badan | 68,4 kg | catatan bebas kalau diisi |

Kartu latihan pernapasan adalah satu-satunya yang memakai baris catatan untuk menampilkan mood, karena mood memang tersimpan di catatan itu.

### Tombol tambah dan pilihan jenis catatan

Lingkaran 56px warna `hijau-600` dengan ikon tambah putih, `bayang-3`, menempel 16px dari kanan dan 102px dari bawah supaya tidak bertabrakan dengan bottom tab. Muncul di Beranda dan Catatan Harian.

Saat ditekan, latar ditutup tirai `rgba(18,33,27,.55)`, ikon tambah berputar 45 derajat menjadi tanda silang, dan enam pilihan muncul bertumpuk di atasnya — mengikuti pola tombol tambah Strava. Tiap pilihan berupa label putih radius `radius-sm` di kiri dan lingkaran putih 48px berisi ikon jenis aktivitas di kanan.

Urutan pilihan dari bawah ke atas: Berat badan, Latihan pernapasan, Tidur, Air minum, Olahraga, Langkah.

Di web, tombol ini menjadi tombol primer ukuran kecil bertuliskan "Tambah catatan" di header, dan pilihannya muncul sebagai modal di tengah layar.

### Lembar pencatatan

Lembar yang naik dari bawah, radius `radius-lg` di sudut atas, `bayang-3`, dengan pegangan 40 × 4px di tengah atas. Susunan dasarnya:

1. Baris judul: lingkaran 40px berisi ikon jenis aktivitas dengan latar 10% warna jenisnya, lalu nama jenis `judul-1` dan tanggal beserta jam `kecil` warna `tinta-600`.
2. Bagian pengisian, berbeda-beda menurut jenisnya.
3. Input catatan opsional.
4. Tombol primer "Simpan" selebar lembar, lalu tombol netral "Batal".

Satu lembar hanya mengisi satu jenis aktivitas. Tidak ada formulir gabungan.

Tidak ada tombol tambah-kurang. Angka diketik lewat satu **input angka** setinggi 76px, radius `radius-md`, batas `hijau-600` dengan cincin 3px `hijau-100` karena ia selalu dalam keadaan terfokus begitu lembar terbuka. Isinya angka `angka-sorot` rata tengah, diikuti kursor tegak 2px dan satuan `badan` warna `tinta-400` yang menempel di garis dasar angka.

Papan tombol perangkat muncul hanya selama input itu sedang diisi, lalu lembarnya naik ke atas papan tombol. Jenis papan tombolnya mengikuti kebutuhan desimal tiap jenis:

| Jenis | Papan tombol | Contoh nilai | Pintasan cepat |
|---|---|---|---|
| Langkah | Angka bulat, tanpa koma | 3.120 | +500, +1.000, +2.000 |
| Olahraga | Angka bulat, tanpa koma | 25 | +5, +15, +30 |
| Air minum | Angka bulat, tanpa koma | 3 | tidak ada |
| Tidur | Angka desimal, ada tombol koma | 7,1 | tidak ada |
| Berat badan | Angka desimal, ada tombol koma | 68,4 | tidak ada |
| Latihan pernapasan | tidak ada input angka | — | tidak ada |

Di web, `inputMode` dan `type` diatur sesuai kolom di atas. Di mobile, `keyboardType` bernilai `number-pad` untuk tiga jenis pertama dan `decimal-pad` untuk tidur dan berat badan.

Pintasan cepat berupa tiga tombol netral setinggi 36px di bawah input angka. Fungsinya menambah nilai yang sedang diketik, bukan menggantikan papan tombol.

Lembar latihan pernapasan tidak punya input angka maupun input catatan. Sebagai gantinya ada tiga kotak pilihan durasi setinggi 72px berisi angka 1, 3, dan 5 dengan kata "menit" di bawahnya; kotak terpilih memakai batas `ak-napas`, latar `#EAF7F8`, dan cincin luar 2px `#CDECEF`. Tombol utamanya "Mulai sesi", bukan "Simpan", karena angkanya lahir dari sesi yang dijalani.

### Sesi latihan pernapasan

Layar penuh berlatar gradien `#0E9DA8` ke `#095E66`, mengikuti pola latihan pernapasan Huawei Health. Isinya:

1. Baris atas: judul "Latihan pernapasan" putih dan tombol tutup bulat 36px dengan latar putih 18%.
2. Di tengah: tiga lingkaran putih sepusat beropasitas 14%, 22%, dan 34% dengan diameter 260, 210, dan 160px, mengelilingi inti putih 120px. Inti berisi aba-aba "Tarik napas", "Tahan", atau "Buang napas" dan hitungan mundur detik `angka-sorot` warna `#0B7C86`. Ketiga lingkaran membesar saat menarik napas dan mengecil saat membuang napas.
3. Kalimat pemandu di bawah lingkaran: "Ikuti lingkarannya. Tarik napas saat membesar, buang napas saat mengecil."
4. Bagian bawah: garis kemajuan setinggi 4px, keterangan durasi sesi dan sisa waktu, lalu tombol "Selesai lebih awal" berlatar putih 18%.

### Lembar akhir sesi

Begitu sesi selesai, lembar dari bawah muncul di atas halaman Catatan Harian:

1. Lingkaran 56px berisi ikon pernapasan, judul "Sesi selesai", dan kalimat "3 menit latihan pernapasan tercatat."
2. Pertanyaan "Bagaimana perasaan Anda sekarang?" diikuti empat kotak emoji setinggi 52px: 😞 😐 🙂 😄, dengan label Buruk, Kurang, Biasa saja, dan Senang di bawahnya. Label pilihan yang aktif berwarna `hijau-700`.
3. Tombol primer "Simpan" dan tombol teks "Lewati pencatatan mood".

Melewati pencatatan mood tetap menyimpan catatan `breathing`; yang kosong hanya field moodnya.

### Bottom tab, khusus mobile

Tinggi total 86px: 64px area tab ditambah 22px ruang aman di bawah untuk garis indikator perangkat. Sudut bawahnya mengikuti lengkung layar sebesar 28px supaya labelnya tidak terpotong. Latar putih, garis atas 1px `garis`, `bayang-2`.

Empat tab: Beranda, Favorit, Catatan, Profil. Ikon 24px dengan label `label` di bawahnya. Tab aktif `hijau-600`, tab lain `tinta-400`.

### Header

Tinggi 64px, latar putih, garis bawah 1px `garis`.

Di mobile berisi judul layar dan, pada halaman detail video atau infografis, tombol kembali di kiri serta tombol bagikan dan simpan di kanan. Di halaman detail artikel, ketiga tombol itu mengambang di atas gambar sampul tanpa header.

Di web mulai 1024px berisi logo, menu mendatar, tombol "Tambah catatan", tombol pintas ke Favorit, dan avatar inisial.

### Avatar inisial

Lingkaran berisi satu atau dua huruf pertama nama, teks tebal putih. Ukuran 40px di header, 56px di daftar, 80px di halaman Profil. Warna latar dipilih dari lima nilai berdasarkan huruf nama, sehingga satu nama selalu mendapat warna yang sama: `#128A5B`, `#F2762E`, `#2D7FF9`, `#7A5AF8`, `#0E9DA8`.

### Kotak ringkasan

Label `label` warna `tinta-600`, angka `angka-besar`, satuan `kecil` warna `tinta-400`. Latar putih, radius `radius-md`, padding 16, `bayang-1`. Dipakai untuk ringkasan 7 hari di halaman Catatan Harian versi web dan untuk angka di landing. **Tidak dipakai di halaman Profil.**

### Keadaan kosong dan kerangka pemuatan

Keadaan kosong: ikon garis 48px warna `tinta-400`, judul `judul-2`, satu kalimat `kecil` warna `tinta-600`, satu tombol primer. Rata tengah, jarak 12.

Kerangka pemuatan: kotak `#EDF3F0` dengan radius yang sama dan animasi berkedip lembut, sebanyak kartu yang biasanya muncul.

## Susunan layar

Sembilan layar. Satu bisa dibuka tanpa login, delapan sisanya wajib login.

| Layar | Perlu login | Isi utama |
|---|---|---|
| Landing | tidak | Tujuan aplikasi, angka jumlah konten, cuplikan tiga konten dengan satu dalam keadaan terkunci, tombol Daftar dan Masuk |
| Register | tidak | Nama, email, password, konfirmasi password |
| Login | tidak | Email, password, tombol isi akun demo |
| Beranda | ya | Sapaan, cincin harian, pencarian, chip kategori, tab tipe konten, daftar kartu konten, tombol tambah |
| Detail Konten | ya | Tiga tampilan berbeda menurut tipe konten |
| Favorit | ya | Baris konten yang bisa digeser untuk dihapus |
| Catatan Harian | ya | Riwayat kartu aktivitas dikelompokkan per tanggal, tombol tambah |
| Sesi latihan pernapasan | ya | Layar penuh berlatar gradien, lingkaran pemandu napas, lalu lembar pencatatan mood di akhir |
| Profil | ya | Avatar inisial, ubah nama dan bio, ganti password, tombol keluar |

### Tiga tampilan halaman Detail Konten

| Tipe | Bagian atas | Isi |
|---|---|---|
| Artikel | Gambar sampul 220px dengan tombol kembali, bagikan, dan simpan mengambang di atasnya | Lencana, judul, keterangan, teks isi dengan subjudul, kotak sumber |
| Video | Header biasa berisi tombol, lalu pemutar YouTube 16:9 selebar layar | Lencana, judul, keterangan, ringkasan isi video, poin utama, kotak sumber |
| Infografis | Header biasa, lalu gambar tinggi dalam bingkai gelap dengan tombol "Ketuk untuk memperbesar" di pojok kanan bawah | Lencana, judul, keterangan, penjelasan isi, angka kunci, kotak sumber |

### Apa yang boleh dilihat tanpa login

Landing hanya menampilkan judul, kategori, tipe, dan gambar sampul dari tiga konten. Isi lengkap tidak ikut dikirim ke halaman itu. Satu di antara ketiganya digambar buram dengan ikon gembok, sebagai penanda bahwa selebihnya perlu akun.

Membuka alamat konten mana pun tanpa token tetap dilempar ke Login, lalu dikembalikan ke alamat yang tadi dituju setelah berhasil masuk.

## Alur perpindahan layar

```
Tanpa login
  Landing ──▶ Register
  Landing ──▶ Login
  Login  ⇄  Register
    └── berhasil masuk ──▶ Beranda

Sudah masuk
  Beranda ──▶ Detail Konten ──▶ kembali ke Beranda
  Beranda ⇄ Favorit ⇄ Catatan Harian ⇄ Profil     bottom tab di mobile, menu header di web
  Beranda ──▶ tombol tambah ──▶ Lembar catat satu jenis aktivitas
  Catatan Harian ──▶ tombol tambah ──▶ lembar yang sama
  tombol tambah ──▶ Latihan pernapasan ──▶ pilih durasi ──▶ Sesi berjalan
                                            └──▶ Lembar akhir sesi, catat mood ──▶ tersimpan
  Beranda ──▶ ketuk lingkaran Relaksasi ──▶ jalur latihan pernapasan yang sama
  Favorit ──▶ Detail Konten
  Favorit ──▶ geser ke kiri ──▶ hapus dari favorit
  Profil  ──▶ keluar ──▶ Landing
```

## Aturan menulis teks antarmuka

- Seluruhnya Bahasa Indonesia. Istilah yang tidak punya padanan lazim boleh tetap Inggris, misalnya `email`.
- Tombol memakai kata kerja: "Simpan catatan", bukan "Submit".
- Pesan galat menyebut apa yang harus dilakukan: "Password minimal 8 karakter".
- Sapaan memakai nama depan pengguna: "Halo, Wiguno".
- Angka dipisah dari satuannya: "6.240 langkah", "8 gelas", "7,1 jam". Desimal memakai koma.

## Cara nilai ini dipakai di kode

**Web**, `web/src/styles/tokens.css`:

```css
:root {
  --hijau-600: #128A5B;
  --jingga-500: #F2762E;
  --tinta-900: #12211B;
  --latar: #F6FBF8;
  --ak-langkah: #F2762E;
  --ak-air: #2D7FF9;
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
export const aktivitas = {
  steps:     { warna: "#F2762E", nama: "Langkah",            satuan: "langkah", langkah: 100 },
  exercise:  { warna: "#19A96F", nama: "Olahraga",           satuan: "menit",   langkah: 5   },
  water:     { warna: "#2D7FF9", nama: "Air minum",          satuan: "gelas",   langkah: 1   },
  sleep:     { warna: "#7A5AF8", nama: "Tidur",              satuan: "jam",     langkah: 0.5 },
  breathing: { warna: "#0E9DA8", nama: "Latihan pernapasan", satuan: "menit",   sesi: [1,3,5] },
  weight:    { warna: "#C9820A", nama: "Berat badan",        satuan: "kg",      langkah: 0.1 },
};
export const mood = [
  { nilai: 1, emoji: "😞", label: "Buruk" },
  { nilai: 2, emoji: "😐", label: "Kurang" },
  { nilai: 3, emoji: "🙂", label: "Biasa saja" },
  { nilai: 4, emoji: "😄", label: "Senang" },
];
export const radius = { sm: 8, md: 12, lg: 16, penuh: 999 };
export const jarak = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
```

Objek `aktivitas` di atas dipakai bersama oleh kartu riwayat, pilihan tombol tambah, lembar pencatatan, dan cincin harian, sehingga nama jenis dan satuannya cukup ditulis satu kali. Kuncinya sama dengan nilai field `type` di collection `healthlogs`.

Nilai mentah seperti `#128A5B` tidak boleh ditulis langsung di komponen. Selalu lewat token.
