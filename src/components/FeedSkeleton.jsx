import { SearchDoodle } from "./Doodles";

export default function FeedSkeleton() {
  return (
    <div style={{ padding: "10px 0" }}>
      <SearchDoodle />
      <p style={{ textAlign: "center", fontSize: 14, fontWeight: 700, color: "var(--ink)", margin: "4px 0 16px" }}>
        Buscando publicaciones cerca de ti…
      </p>
      <style>{`@keyframes paltruekeSkeletonPulse { 0%, 100% { opacity: .38; } 50% { opacity: .72; } }`}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[1, 2, 3].map((card) => (
          <div key={card} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 14, animation: "paltruekeSkeletonPulse 1.5s ease-in-out infinite", animationDelay: `${card * 120}ms` }}>
            <div style={{ width: "27%", height: 11, borderRadius: 6, background: "#E8DCCF", marginBottom: 13 }} />
            <div style={{ width: "48%", height: 15, borderRadius: 7, background: "#E8DCCF", marginBottom: 10 }} />
            <div style={{ width: "92%", height: 10, borderRadius: 6, background: "#EFE7DE", marginBottom: 7 }} />
            <div style={{ width: "68%", height: 10, borderRadius: 6, background: "#EFE7DE", marginBottom: 14 }} />
            <div style={{ width: "35%", height: 10, borderRadius: 6, background: "#E8DCCF" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
