// Ikon garis dan padat 24px, sama dengan yang dipakai di mockup dan di berkas Figma.

const jalur = {
  beranda: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>,
  favorit: <path d="M6 3h12v18l-6-4.5L6 21z" />,
  catatan: <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  profil: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" /></>,
  cari: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  kembali: <path d="m15 5-7 7 7 7" />,
  tambah: <path d="M12 5v14M5 12h14" />,
  bagikan: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 10.6 6.8-4M8.6 13.4l6.8 4" /></>,
  hapus: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /><path d="M10 11v6M14 11v6" /></>,
  keluar: <><path d="M9 21H5V3h4" /><path d="m15 8 4 4-4 4M19 12H9" /></>,
  gembok: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  daun: <><path d="M20 4c0 9-6 14-13 14" /><path d="M20 4C9 4 4 9 4 15a5 5 0 0 0 5 5c6 0 11-5 11-16Z" /></>,
  napas: <><circle cx="12" cy="12" r="3.2" /><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="10.6" /></>
};

const padat = {
  "favorit-isi": <path d="M6 3h12v18l-6-4.5L6 21z" />,
  putar: <path d="M8 5.5v13l11-6.5z" />,
  langkah: <path d="M8.6 2.2c1.8 0 2.9 1.6 2.9 3.7 0 1.6-.5 3-.5 4.3 0 1 .4 1.7.4 2.7 0 1.6-1.2 2.6-2.8 2.6-1.9 0-3-1.3-3-3.2 0-1.3.4-2.3.4-3.6 0-1.4-.6-2.6-.6-4C5.4 3.4 6.7 2.2 8.6 2.2Zm.1 15.1c1.4 0 2.4.9 2.4 2.2 0 1.4-1 2.3-2.5 2.3s-2.5-.9-2.5-2.3c0-1.3 1.1-2.2 2.6-2.2ZM16.2 6.6c1.7 0 2.7 1.4 2.7 3.4 0 1.5-.5 2.8-.5 4 0 1 .4 1.6.4 2.5 0 1.5-1.1 2.4-2.6 2.4-1.8 0-2.8-1.2-2.8-3 0-1.2.4-2.1.4-3.3 0-1.3-.6-2.4-.6-3.7 0-1.4 1.2-2.3 3-2.3Z" />,
  olahraga: <path d="M15.5 4.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8.9 8.2 6 10.6l1.4 1.8 3-2.4 2 2.2-2.6 4.2L6 20.9l1.7 1.6 4.6-5.4 3 3.3v3.1h2.2v-4.2l-3.2-3.5 1.5-4 2.3 2.4h3.4v-2.2h-2.5l-3.2-3.4c-.5-.5-1.1-.8-1.8-.8-.6 0-1.1.2-1.6.5l-3.5 2.9Z" />,
  air: <path d="M12 2.5c3.6 4.3 6.5 7.6 6.5 11.2A6.5 6.5 0 0 1 5.5 13.7C5.5 10.1 8.4 6.8 12 2.5Z" />,
  tidur: <path d="M20.5 14.3A8.6 8.6 0 0 1 9.7 3.5 8.6 8.6 0 1 0 20.5 14.3Z" />,
  berat: <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm7 3a3.6 3.6 0 0 0-3.5 3.6h1.9c0-.9.7-1.7 1.6-1.7s1.6.8 1.6 1.7h1.9A3.6 3.6 0 0 0 12 6Zm-4 6.5h8v1.8H8v-1.8Z" />
};

export default function Ikon({ nama, ukuran = 24, ...sisa }) {
  const isiPadat = padat[nama];
  const isiGaris = jalur[nama];
  if (!isiPadat && !isiGaris) return null;

  return (
    <svg
      width={ukuran} height={ukuran} viewBox="0 0 24 24" aria-hidden="true" focusable="false"
      fill={isiPadat ? "currentColor" : "none"}
      stroke={isiPadat ? "none" : "currentColor"}
      strokeWidth={isiPadat ? undefined : 1.8}
      strokeLinecap="round" strokeLinejoin="round"
      {...sisa}
    >
      {isiPadat || isiGaris}
    </svg>
  );
}

// Peta jenis catatan ke ikon dan warnanya, sejalan dengan objek aktivitas di server.
export const AKTIVITAS_UI = {
  steps: { ikon: "langkah", warna: "var(--ak-langkah)" },
  exercise: { ikon: "olahraga", warna: "var(--ak-olahraga)" },
  water: { ikon: "air", warna: "var(--ak-air)" },
  sleep: { ikon: "tidur", warna: "var(--ak-tidur)" },
  breathing: { ikon: "napas", warna: "var(--ak-napas)" },
  weight: { ikon: "berat", warna: "var(--ak-berat)" }
};
