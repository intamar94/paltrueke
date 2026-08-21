export default function ConfirmDialog({ title, description, onCancel, onConfirm }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(74,51,40,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 30, padding: 20 }}
      onClick={onCancel}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 22, padding: 22, maxWidth: 340, width: "100%", boxShadow: "0 10px 30px rgba(74,51,40,0.2)" }}>
        <h3 className="disp" style={{ fontSize: 19, fontWeight: 700, margin: "0 0 6px", color: "var(--ink)" }}>{title}</h3>
        {description && <p style={{ fontSize: 13.5, color: "var(--ink-soft)", margin: "0 0 18px" }}>{description}</p>}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "12px 0", borderRadius: 14, border: "1.5px solid var(--border)", background: "#fff", color: "var(--ink)", fontWeight: 600, fontSize: 14 }}>
            Cancelar
          </button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "12px 0", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #6c5646, var(--ink))", color: "#fff", fontWeight: 600, fontSize: 14 }}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
