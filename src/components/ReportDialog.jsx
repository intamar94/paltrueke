import { useState } from "react";
import { MOTIVOS_REPORTE } from "../data/categories";

export default function ReportDialog({ onCancel, onSubmit }) {
  const [motivo, setMotivo] = useState(MOTIVOS_REPORTE[0].id);
  const [detalle, setDetalle] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    setSending(true);
    try {
      await onSubmit({ motivo, detalle });
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(74,51,40,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 30, padding: 20 }}
      onClick={onCancel}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 22, padding: 22, maxWidth: 360, width: "100%", boxShadow: "0 10px 30px rgba(74,51,40,0.2)" }}>
        <h3 className="disp" style={{ fontSize: 19, fontWeight: 700, margin: "0 0 12px", color: "var(--ink)" }}>Reportar publicación</h3>

        <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 5, color: "var(--muted)" }}>Motivo</label>
        <select
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          style={{ width: "100%", padding: "11px 13px", borderRadius: 14, border: "1.5px solid var(--border)", fontSize: 14, marginBottom: 12 }}
        >
          {MOTIVOS_REPORTE.map((m) => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>

        <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, marginBottom: 5, color: "var(--muted)" }}>Detalle (opcional)</label>
        <textarea
          value={detalle}
          onChange={(e) => setDetalle(e.target.value)}
          style={{ width: "100%", minHeight: 60, padding: "11px 13px", borderRadius: 14, border: "1.5px solid var(--border)", fontSize: 14, marginBottom: 18, resize: "vertical" }}
          maxLength={280}
        />

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "12px 0", borderRadius: 14, border: "1.5px solid var(--border)", background: "#fff", color: "var(--ink)", fontWeight: 600, fontSize: 14 }}>
            Cancelar
          </button>
          <button
            onClick={submit}
            disabled={sending}
            style={{ flex: 1, padding: "12px 0", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #d3654a, var(--rojo))", color: "#fff", fontWeight: 600, fontSize: 14, opacity: sending ? 0.7 : 1 }}
          >
            {sending ? "Enviando…" : "Reportar"}
          </button>
        </div>
      </div>
    </div>
  );
}
