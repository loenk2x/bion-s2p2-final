# Berkas siap impor ke Figma

Dua puluh lima berkas HTML di folder ini dibuat khusus untuk diimpor ke Figma lewat plugin **html.to.design**. Isinya sama persis dengan `../mockups.html`, tapi dibersihkan supaya hasil impornya rapi.

## Bedanya dengan mockups.html

| Hal | `mockups.html` | Berkas di folder ini |
|---|---|---|
| Isi satu berkas | Semua layar sekaligus, plus penjelasan | Satu layar saja |
| Ukuran bingkai HP | 390 × 844 termasuk bezel hitam 10px | 390 × 844 bersih tanpa bezel |
| Ukuran halaman web | 1180px diperkecil 58% supaya muat dibaca | 1440 × 900 ukuran asli, tanpa penskalaan |
| Bilah browser palsu | Ada | Dihilangkan |
| Judul, tabel, catatan | Ada | Dihilangkan |
| CSS design system | Satu berkas dipakai bersama | Disalin penuh ke dalam tiap berkas |
| Gambar | Berkas terpisah di `../img/` | Disematkan sebagai data URI |

Karena CSS dan gambarnya sudah menyatu, tiap berkas bisa ditempel apa adanya ke plugin tanpa membawa berkas pendamping.

## Cara mengimpor

1. Pasang plugin **html.to.design** di Figma.
2. Buka plugin, pilih tab **HTML/CSS**.
3. Buka salah satu berkas di folder ini dengan editor teks, salin seluruh isinya, tempel ke plugin, lalu jalankan.
4. Ulangi untuk berkas berikutnya. Tiap berkas menghasilkan satu frame.

Kalau plugin gagal membaca gambar yang disematkan, pakai jalur kedua: pasang ekstensi browser html.to.design, buka berkasnya di browser, lalu kirim halamannya ke plugin lewat ekstensi itu.

## Urutan yang disarankan

Impor dua berkas fondasi lebih dulu, supaya warna dan komponennya sudah ada saat layar-layarnya masuk.

| Berkas | Isi |
|---|---|
| `figma-00-fondasi.html` | Swatch warna utama, warna jenis aktivitas, skala tipografi, radius, bayangan |
| `figma-01-komponen.html` | Tombol, input, chip kategori, tab tipe konten, cincin harian, enam kartu aktivitas, enam lembar tambah catatan, baris geser hapus, tombol tambah |

Lalu lima belas layar mobile, `figma-mobile-01` sampai `figma-mobile-14`, dan delapan halaman web, `figma-web-01` sampai `figma-web-08`.

## Yang tetap harus dirapikan manual

Plugin ini menghasilkan layer, bukan design system. Setelah semua masuk:

1. **Color variable.** Warna masuk sebagai nilai hex lepas. Buat variable bernama `hijau-600`, `ak-langkah`, dan seterusnya dari `figma-00-fondasi.html`, lalu tautkan.
2. **Component.** Kartu konten, kartu aktivitas, tombol, input, chip, dan avatar perlu dijadikan component dengan variant.
3. **Blend mode cincin harian.** Pastikan Multiply hanya menempel pada tiga lingkaran aktif, bukan pada lingkaran bayangan target.
4. **Denyut cincin.** Animasinya hanya hidup di kode dan tidak ikut terimpor. Kalau perlu diperagakan, buat dua frame kembar dengan lingkaran aktif berbeda 4,5 persen lalu hubungkan dengan Smart Animate 1,8 detik, easing Ease In And Out.
5. **Penamaan frame.** Ganti nama frame hasil impor menjadi `Mobile / Beranda`, `Web / Beranda`, dan seterusnya.

## Membangun ulang

Berkas di folder ini dihasilkan otomatis dan tidak untuk diedit langsung. Setiap `../mockups.html` berubah, jalankan:

```bash
node design/build-figma.mjs
```

Perintah itu menghapus isi folder ini lalu menuliskannya kembali dari mockup yang terbaru.
