import { Star, AlertTriangle, MapPin, X, Tag } from "lucide-react";
import { CATEGORIAS, TIPOS } from "../data/categories";

export default function FilterBar({ filters, setFilters }) {
  const chip = (active) => ({
    flexShrink: 0, display: "flex", alignItems: "center", gap: 5, padding: "7px 13px",
    borderRadius: 20, fontSize: 12.5, fontWeight: 600, border: "1.5px solid",
    background: active ? "var(--naranja)" : "#fff",
    color: active ? "#fff" : "var(--ink-soft)",
    borderColor: active ? "var(--naranja)" : "var(--border)",
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 7, marginBottom: 12, background: "#fff", padding: 5, borderRadius: 18 }}>
        {[{ id: "todo", label: "Todo" }, ...TIPOS].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilters((f) => ({ ...f, tipo: t.id }))}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 14, border: "none",
              background: filters.tipo === t.id ? "linear-gradient(135deg, #ec7a3f, var(--rojo))" : "transparent",
              color: filters.tipo === t.id ? "#fff" : "var(--muted)", fontWeight: 700, fontSize: 13,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <button onClick={() => setFilters((f) => ({ ...f, urgente: !f.urgente }))} style={chip(filters.urgente)}>
          <AlertTriangle size={13} /> Urgente
        </button>
        <button onClick={() => setFilters((f) => ({ ...f, mine: !f.mine }))} style={chip(filters.mine)}>
          <Star size={13} fill={filters.mine ? "#fff" : "none"} /> Mis publicaciones
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, background: "#fff", border: "1.5px solid var(--border)", borderRadius: 14, padding: "9px 14px" }}>
        <MapPin size={15} color="var(--muted)" style={{ flexShrink: 0 }} />
        <input
          value={filters.zona}
          onChange={(e) => setFilters((f) => ({ ...f, zona: e.target.value }))}
          placeholder="Filtrar por municipio, barrio o departamento…"
          style={{ flex: 1, border: "none", outline: "none", fontSize: 13.5, background: "transparent", color: "var(--ink)" }}
        />
        {filters.zona && (
          <button onClick={() => setFilters((f) => ({ ...f, zona: "" }))} style={{ border: "none", background: "none", color: "var(--muted)", display: "flex" }} aria-label="Borrar zona">
            <X size={14} />
          </button>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid var(--border)", borderRadius: 14, padding: "10px 14px", marginBottom: 16 }}>
        <Tag size={15} color="var(--muted)" style={{ flexShrink: 0 }} />
        <select
          value={filters.categoria || ""}
          onChange={(e) => setFilters((f) => ({ ...f, categoria: e.target.value || null }))}
          style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent", color: "var(--ink)" }}
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((c) => (
            <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
