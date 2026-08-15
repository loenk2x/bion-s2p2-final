// Mengangkat CSS komponen dari design/mockups.html menjadi web/src/styles/komponen.css.
// Tujuannya satu: aplikasi web memakai CSS yang tampilannya sudah terbukti di mockup,
// bukan CSS baru yang ditulis ulang dan pasti melenceng.
//
// Yang dibuang: bingkai HP, bilah browser palsu, dan seluruh chrome dokumentasi.
// Yang diubah: nama variable disesuaikan dengan tokens.css.
//
// Jalankan: node design/build-css.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirDesign = path.dirname(fileURLToPath(import.meta.url));
const sumber = fs.readFileSync(path.join(dirDesign, "mockups.html"), "utf8");
const keluar = path.join(dirDesign, "..", "web", "src", "styles", "komponen.css");

// ---------- pisahkan aturan dengan penghitung kurung ----------
function pecahAturan(css) {
  const aturan = [];
  let i = 0;
  while (i < css.length) {
    const buka = css.indexOf("{", i);
    if (buka === -1) break;
    const selektor = css.slice(i, buka).trim();
    let dalam = 1, j = buka + 1;
    while (j < css.length && dalam > 0) {
      if (css[j] === "{") dalam++;
      else if (css[j] === "}") dalam--;
      j++;
    }
    aturan.push({ selektor, isi: css.slice(buka + 1, j - 1), penuh: css.slice(i, j).trim() });
    i = j;
  }
  return aturan;
}

// ---------- selektor yang hanya milik mockup ----------
const BUANG_PERSIS = new Set([".papan", ".doc", ".rak", ".slot", ".jenis-tombol", ".lembarkerja"]);
const BUANG_AWALAN = [
  ".doc-nav", ".doc ", ".hp", ".wb", ".slot", ".rak-lembar", ".rak ", ".papan ", ".papan.",
  ".sw", ".grid-swatch", ".mini-tabel", ".catatan-rev", ".label-mini", ".spesimen",
  ".lembar-contoh", ".blok-figma", ".tajuk-figma", ".pilih", ".tanya", ".kartu-cincin", ".ket"
];
const buang = (sel) =>
  sel.split(",").every((s) => {
    const t = s.trim();
    if (BUANG_PERSIS.has(t)) return true;
    return BUANG_AWALAN.some((a) => t === a.trim() || t.startsWith(a));
  });

// ---------- nama variable mockup disesuaikan ke tokens.css ----------
const PETA_VAR = {
  "--r-sm": "--radius-sm",
  "--r-md": "--radius-md",
  "--r-lg": "--radius-lg",
  "--r-full": "--radius-penuh",
  "--b1": "--bayang-1",
  "--b2": "--bayang-2",
  "--b3": "--bayang-3",
  "--biru-t": "--len-infografis-teks",
  "--biru-l": "--len-infografis-latar"
};
const samakanVar = (teks) =>
  Object.entries(PETA_VAR).reduce(
    (t, [lama, baru]) => t.replaceAll(`var(${lama})`, `var(${baru})`),
    teks
  );

// ---------- kumpulkan ----------
const semuaCss = [...sumber.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");
const aturan = pecahAturan(semuaCss);

const dipakai = [];
const dibuang = [];

for (const a of aturan) {
  const sel = a.selektor;

  // :root tidak ikut — token warna sudah ada di tokens.css
  if (sel === ":root" || sel.startsWith("html") || sel === "*" || sel === "body") { dibuang.push(sel); continue; }

  // @keyframes yang benar-benar dipakai komponen
  if (sel.startsWith("@keyframes")) {
    if (/denyut|kedip|putar/.test(sel)) dipakai.push(a);
    else dibuang.push(sel);
    continue;
  }

  // dari seluruh @media, hanya prefers-reduced-motion yang relevan untuk aplikasi
  if (sel.startsWith("@media")) {
    if (sel.includes("prefers-reduced-motion")) dipakai.push(a);
    else dibuang.push(sel);
    continue;
  }

  if (buang(sel)) { dibuang.push(sel); continue; }
  dipakai.push(a);
}

const kepala = `/* DIBANGKITKAN OTOMATIS — jangan diedit langsung.
   Sumber: design/mockups.html
   Perintah: node design/build-css.mjs

   Berisi CSS komponen yang tampilannya sudah terbukti di mockup: tombol, input,
   chip kategori, tab tipe konten, lencana, kartu konten, baris konten, kartu
   aktivitas, cincin harian, lembar pencatatan, papan tombol angka, tombol tambah,
   dan geser hapus.

   Bingkai HP, bilah browser palsu, dan chrome dokumentasi tidak ikut.
   Nama variable sudah disesuaikan dengan tokens.css.

   Tata letak responsif aplikasi ada di layout.css, bukan di sini. */

`;

fs.writeFileSync(keluar, kepala + dipakai.map((a) => samakanVar(a.penuh)).join("\n") + "\n");

const kb = (fs.statSync(keluar).size / 1024).toFixed(1);
console.log(`komponen.css ditulis: ${dipakai.length} aturan, ${kb} KB`);
console.log(`dibuang: ${dibuang.length} aturan milik mockup saja`);
console.log(`\nkelas yang tersedia untuk dipakai di JSX:`);
const kelas = [...new Set(
  dipakai.flatMap((a) => [...a.selektor.matchAll(/\.([a-z0-9-]+)/gi)].map((m) => m[1]))
)].sort();
console.log(kelas.join(" "));
