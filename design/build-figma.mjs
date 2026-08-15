// Membangun berkas figma-*.html dari mockups.html.
// Tiap berkas berdiri sendiri: CSS design system disalin ke dalamnya, sprite ikon ikut,
// dan gambar diubah jadi data URI supaya tetap muncul walau isinya ditempel ke plugin.
//
// Jalankan: node design/build-figma.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dirDesign = path.dirname(fileURLToPath(import.meta.url));
const dirKeluar = path.join(dirDesign, "figma");
const sumber = fs.readFileSync(path.join(dirDesign, "mockups.html"), "utf8");

// ---------- pengambil blok div yang seimbang ----------
function ambilBlok(teks, indexMulai) {
  const bukaTag = teks.indexOf(">", indexMulai) + 1;
  let dalam = 1, i = bukaTag;
  while (dalam > 0 && i < teks.length) {
    const buka = teks.indexOf("<div", i);
    const tutup = teks.indexOf("</div>", i);
    if (tutup === -1) break;
    if (buka !== -1 && buka < tutup) { dalam++; i = buka + 4; }
    else { dalam--; i = tutup + 6; }
  }
  return { html: teks.slice(indexMulai, i), akhir: i };
}

function semuaBlok(teks, penanda) {
  const hasil = [];
  let i = 0;
  while (true) {
    const m = teks.indexOf(penanda, i);
    if (m === -1) break;
    const b = ambilBlok(teks, m);
    hasil.push({ html: b.html, mulai: m });
    i = b.akhir;
  }
  return hasil;
}

// ---------- bahan bersama ----------
const gayaSemua = [...sumber.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]);
const cssDasar = gayaSemua.join("\n");
const sprite = sumber.match(/<svg width="0" height="0"[\s\S]*?<\/svg>/)[0];

const gambarCache = new Map();
function dataUri(rel) {
  if (gambarCache.has(rel)) return gambarCache.get(rel);
  const buf = fs.readFileSync(path.join(dirDesign, rel));
  const uri = `data:image/jpeg;base64,${buf.toString("base64")}`;
  gambarCache.set(rel, uri);
  return uri;
}
const sematkanGambar = html =>
  html.replace(/src="(img\/[^"]+)"/g, (_, rel) => `src="${dataUri(rel)}"`);

const CSS_TIMPA = `
/* --- penyesuaian khusus ekspor Figma --- */
html,body{margin:0;padding:0;background:#fff}
body{padding:0}
.lembarkerja{display:flex;flex-wrap:wrap;gap:64px;padding:0;align-items:flex-start}
/* bingkai tidak boleh menyusut kalau jendela sempit — ukurannya harus tepat saat diimpor */
.lembarkerja>*{flex:0 0 auto}
.hp,.wb{flex:0 0 auto}
/* bingkai HP jadi ukuran artboard sebenarnya, tanpa bezel */
.hp-layar{border:0!important;border-radius:0!important;box-shadow:none!important;width:390px;height:844px}
.hp-tab{border-radius:0!important}
.lembar{border-radius:var(--r-lg) var(--r-lg) 0 0!important}
.papan-tombol{border-radius:0!important}
/* bingkai web jadi 1440x900, tanpa bilah browser palsu dan tanpa penskalaan */
.wb{transform:none!important;width:1440px;height:900px;border:0!important;border-radius:0!important;box-shadow:none!important}
.wb-bar{display:none!important}
.slot{width:auto;height:auto;margin:0}
/* dokumentasi tidak ikut diekspor */
.doc-nav,.doc h1,.doc h2,.doc p.ket,.mini-tabel,.catatan-rev,.hp-nama{display:none}
.papan{border:0;box-shadow:none;padding:0;margin:0}
.doc{max-width:none;margin:0;padding:0}
`;

function berkas(judul, isi, { lebarkerja = true } = {}) {
  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${judul}</title>
<style>
${cssDasar}
${CSS_TIMPA}
</style>
</head>
<body>
${sprite}
${lebarkerja ? `<div class="lembarkerja">\n${isi}\n</div>` : isi}
</body>
</html>
`;
}

function namaBerkas(awalan, label) {
  const m = label.match(/^([0-9]+[a-z]?)\s*·\s*(.+)$/i);
  const nomor = m ? m[1].padStart(2, "0") : "00";
  const sisa = (m ? m[2] : label)
    .toLowerCase()
    .replace(/[—–]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 46);
  return `figma-${awalan}-${nomor}-${sisa}.html`;
}

// ---------- kumpulkan label ----------
const label = [...sumber.matchAll(/<p class="hp-nama"[^>]*>([\s\S]*?)<\/p>/g)]
  .map(m => ({ teks: m[1].replace(/\s+/g, " ").trim(), mulai: m.index }));
const labelSebelum = posisi => {
  let pilih = null;
  for (const l of label) if (l.mulai < posisi) pilih = l; else break;
  return pilih ? pilih.teks : "tanpa-nama";
};

fs.rmSync(dirKeluar, { recursive: true, force: true });
fs.mkdirSync(dirKeluar, { recursive: true });

const dibuat = [];
function tulis(nama, judul, isi) {
  fs.writeFileSync(path.join(dirKeluar, nama), berkas(judul, sematkanGambar(isi)));
  const kb = (fs.statSync(path.join(dirKeluar, nama)).size / 1024).toFixed(0);
  dibuat.push({ nama, judul, kb });
}

// ---------- 1. layar mobile, satu berkas per layar ----------
for (const b of semuaBlok(sumber, '<div class="hp-layar">')) {
  const teks = labelSebelum(b.mulai);
  tulis(namaBerkas("mobile", teks), "Mobile — " + teks.replace(/^[0-9a-z]+\s*·\s*/i, ""),
    `<div class="hp">${b.html}</div>`);
}

// ---------- 2. halaman web, satu berkas per halaman ----------
for (const b of semuaBlok(sumber, '<div class="wb">')) {
  const teks = labelSebelum(b.mulai);
  tulis(namaBerkas("web", teks), "Web — " + teks.replace(/^[0-9a-z]+\s*·\s*/i, ""), b.html);
}

// ---------- 3. fondasi dan komponen ----------
function potongAntara(mulaiPenanda, akhirPenanda) {
  const a = sumber.indexOf(mulaiPenanda);
  const b = sumber.indexOf(akhirPenanda);
  return sumber.slice(a, b);
}
function bersihkanDok(html) {
  return html
    .replace(/<style>[\s\S]*?<\/style>/g, "")
    .replace(/<p class="ket"[^>]*>[\s\S]*?<\/p>/g, "")
    .replace(/<p class="label-mini"[^>]*>[\s\S]*?<\/p>/g, "")
    .replace(/<table class="mini-tabel">[\s\S]*?<\/table>/g, "")
    .replace(/<div class="catatan-rev">[\s\S]*?<\/div>/g, "")
    .replace(/<h2[^>]*>[\s\S]*?<\/h2>/g, "")
    .replace(/<h3>([\s\S]*?)<\/h3>/g, '<p class="tajuk-figma">$1</p>');
}

const CSS_TAJUK = `<style>
.tajuk-figma{font:600 13px/18px var(--font);color:#4B5B54;text-transform:uppercase;
  letter-spacing:.06em;margin:0 0 12px}
.blok-figma{margin-bottom:48px}
.lembarkerja{display:block}
</style>`;

fs.writeFileSync(path.join(dirKeluar, "figma-00-fondasi.html"),
  berkas("Fondasi — warna, tipografi, radius, bayangan",
    CSS_TAJUK + `<div class="blok-figma">` +
    sematkanGambar(bersihkanDok(potongAntara('<h2 id="fondasi">', '<h2 id="komponen">'))) +
    `</div>`, { lebarkerja: false }));
dibuat.push({ nama: "figma-00-fondasi.html", judul: "Fondasi",
  kb: (fs.statSync(path.join(dirKeluar, "figma-00-fondasi.html")).size / 1024).toFixed(0) });

fs.writeFileSync(path.join(dirKeluar, "figma-01-komponen.html"),
  berkas("Komponen — tombol, input, kartu, cincin, lembar",
    CSS_TAJUK + gayaSemua.slice(1).map(g => `<style>${g}</style>`).join("") +
    `<div class="blok-figma">` +
    sematkanGambar(bersihkanDok(potongAntara('<h2 id="komponen">', '<h2 id="mobile">'))) +
    `</div>`, { lebarkerja: false }));
dibuat.push({ nama: "figma-01-komponen.html", judul: "Komponen",
  kb: (fs.statSync(path.join(dirKeluar, "figma-01-komponen.html")).size / 1024).toFixed(0) });

// ---------- laporan ----------
dibuat.sort((a, b) => a.nama.localeCompare(b.nama));
console.log(dibuat.map(d => `${d.kb.padStart(5)} KB  ${d.nama}`).join("\n"));
console.log(`\n${dibuat.length} berkas di design/figma/`);
