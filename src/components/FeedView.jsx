import { useState } from "react";
import { ArrowLeft, RefreshCw, HeartHandshake } from "lucide-react";
import FilterBar from "./FilterBar";
import PostCard from "./PostCard";
import { priorityRank } from "../data/categories";
import { EmptyDoodle } from "./Doodles";
import FeedSkeleton from "./FeedSkeleton";

function normaliza(txt) {
  return (txt || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function FeedView({
  title, posts, loading, error, filters, setFilters, myId,
  onBack, onRefresh, onMarkHelping, onResolve, onReport, onRelease, onEdit, onDelete,
}) {
  const [showResolved, setShowResolved] = useState(false);

  const base = (posts || []).filter((p) => {
    if (filters.tipo !== "todo" && p.tipo !== filters.tipo) return false;
    if (filters.urgente && !p.urgente) return false;
    if (filters.categoria && p.categoria !== filters.categoria) return false;
    if (filters.mine && p.owner_id !== myId) return false;
    if (filters.zona && filters.zona.trim()) {
      const z = normaliza(filters.zona.trim());
      const haystack = normaliza([p.municipio, p.sector, p.departamento, p.pais].filter(Boolean).join(" "));
      if (!haystack.includes(z)) return false;
    }
    return true;
  });

  const list = base.filter((p) => p.estado !== "resuelta").sort((a, b) => priorityRank(a) - priorityRank(b) || new Date(b.created_at) - new Date(a.created_at));
  const resolvedList = base.filter((p) => p.estado === "resuelta").sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const hayFiltrosActivos = filters.tipo !== "todo" || filters.urgente || filters.categoria || filters.mine || (filters.zona && filters.zona.trim());

  const cardProps = (p) => ({
    post: p,
    mine: p.owner_id === myId,
    isHelper: p.helper_id === myId,
    onMarkHelping: () => onMarkHelping(p),
    onResolve: () => onResolve(p),
    onReport: () => onReport(p),
    onRelease: () => onRelease(p),
    onEdit: () => onEdit(p),
    onDelete: () => onDelete(p),
  });

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "18px 16px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, border: "none", background: "none", fontWeight: 600, fontSize: 14, color: "var(--ink)" }}><ArrowLeft size={18} /> {title}</button>
        <button onClick={onRefresh} aria-label="Actualizar" style={{ width: 36, height: 36, borderRadius: 9, border: "1px solid var(--border)", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><RefreshCw size={16} className={loading ? "spin" : ""} /></button>
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: "#fff", border: "1px solid var(--border)", borderRadius: 16, padding: "12px 14px", marginBottom: 16 }}>
        <HeartHandshake size={15} color="var(--verde)" style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.4 }}>Esta red funciona por la confianza entre vecinos: ayuda con solidaridad, y pide solo lo que realmente necesitas.</span>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} />
      {error && <div style={{ background: "#FDECE5", color: "var(--rojo)", padding: "8px 12px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{error}</div>}

      {posts === null ? (
        <FeedSkeleton />
      ) : list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 20px", background: "#fff", border: "1.5px dashed var(--border)", borderRadius: 18 }}>
          <EmptyDoodle />
          <p style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink)", margin: "10px 0 4px" }}>Todavía no hay nada aquí</p>
          <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 auto", lineHeight: 1.5, maxWidth: 320 }}>{hayFiltrosActivos ? "Prueba con otro filtro o zona — puede que haya publicaciones que no calzan con estos exactos." : "Sé la primera persona en publicar. Alguien en tu zona puede estar esperando justo esto."}</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{list.map((p) => <PostCard key={p.id} {...cardProps(p)} />)}</div>
      )}

      {resolvedList.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <button onClick={() => setShowResolved((v) => !v)} style={{ border: "none", background: "none", color: "var(--muted)", fontSize: 13, fontWeight: 600, padding: "8px 0" }}>{showResolved ? "Ocultar" : "Ver"} resueltas ({resolvedList.length})</button>
          {showResolved && <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>{resolvedList.map((p) => <PostCard key={p.id} {...cardProps(p)} />)}</div>}
        </div>
      )}
    </div>
  );
}
