export default function Loading({ message = "Memuat…" }) {
  return (
    <div className="memuat" role="status" aria-live="polite">
      <span className="memuat-putar" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export function CardSkeleton({ count = 4 }) {
  return (
    <div className="grid-konten" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="kerangka-kartu">
          <div className="kerangka kerangka-sampul" />
          <div className="kerangka-isi">
            <div className="kerangka kerangka-baris" />
            <div className="kerangka kerangka-baris pendek" />
          </div>
        </div>
      ))}
    </div>
  );
}
