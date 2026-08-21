import { useState } from "react";
import { X } from "lucide-react";
import { CATEGORIAS, TIPOS } from "../data/categories";

const EMPTY = {
  tipo: "necesito",
  categoria: "agua",
  descripcion: "",
  urgente: false,
  pais: "Colombia",
  departamento: "",
  municipio: "",
  sector: "",
  remoto: false,
  origen: "",
  contacto: "",
  confirmo: false,
};

// Formulario corto de publicación. El contacto no se pide ni se muestra
// acá: viene fijo del teléfono con el que la persona se registró (ver
// PhoneGateModal) y ya se explicó ahí, así que no hace falta repetirlo.
// Si se le pasa "editingPost", se precarga con esos datos y al guardar
// actualiza en vez de crear una publicación nueva.
export default function PostForm({ initialTipo, defaultContacto, editingPost, onClose, onSubmit }) {
  const [draft, setDraft] = useState(
    editingPost
      ? {
          tipo: editingPost.tipo,
          categoria: editingPost.categoria,
          descripcion: editingPost.descripcion || "",
          urgente: editingPost.urgente,
          pais: editingPost.pais || "Colombia",
          departamento: editingPost.departamento || "",
          municipio: editingPost.municipio || "",
          sector: editingPost.sector || "",
          remoto: editingPost.remoto || false,
          origen: editingPost.origen || "",
          contacto: editingPost.contacto,
          confirmo: true,
        }
      : { ...EMPTY, tipo: initialTipo || "necesito", contacto: defaultContacto || "" }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }));

  const submit = async (e) => {
    e.preventDefault();
    if (!draft.descripcion.trim() || !draft.municipio.trim() || !draft.contacto.trim()) {
      setError("Completa descripción, municipio y contacto.");
      return;
    }
    if (!draft.confirmo) {
      setError("Confirma que la información es real para poder publicar.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit(draft);
    } catch (err) {
      setError(err?.message || "No se pudo publicar. Revisa tu conexión y prueba de nuevo.");
      setSaving(false);
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(74,51,40,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 20 }}
      onClick={onClose}
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--bg)", width: "100%", maxWidth: 480, borderRadius: "26px 26px 0 0", maxHeight: "88vh", display: "flex", flexDirection: "column" }}
      >
        <div style={{ overflowY: "auto", padding: "22px 20px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 className="disp" style={{ fontSize: 22, fontWeight: 700, margin: 0, color: "var(--ink)" }}>{editingPost ? "Editar publicación" : "Publicar"}</h2>
            <button type="button" onClick={onClose} style={{ border: "none", background: "#fff", width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(74,51,40,0.1)" }} aria-label="Cerrar">
              <X size={18} color="var(--ink)" />
            </button>
          </div>

          <div style={{ display: "flex", gap: 7, marginBottom: 16, background: "#fff", padding: 5, borderRadius: 18 }}>
            {TIPOS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => set({ tipo: t.id })}
                style={{
                  flex: 1, padding: "10px 0", borderRadius: 14, fontWeight: 700, fontSize: 13,
                  border: "none",
                  background: draft.tipo === t.id ? "linear-gradient(135deg, #ec7a3f, var(--rojo))" : "transparent",
                  color: draft.tipo === t.id ? "#fff" : "var(--muted)",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <label style={lbl}>Categoría</label>
          <select value={draft.categoria} onChange={(e) => set({ categoria: e.target.value })} style={inp}>
            {CATEGORIAS.map((c) => (
              <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
            ))}
          </select>

          <label style={lbl}>Descripción</label>
          <textarea
            value={draft.descripcion}
            onChange={(e) => set({ descripcion: e.target.value })}
            placeholder="Cuenta qué pasa: para cuántas personas, urgencia, horarios…"
            style={{ ...inp, minHeight: 80, resize: "vertical" }}
            maxLength={280}
          />

          {draft.tipo !== "informo" && (
            <label style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0 4px", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
              <input type="checkbox" checked={draft.urgente} onChange={(e) => set({ urgente: e.target.checked })} style={{ width: 18, height: 18, accentColor: "var(--rojo)" }} />
              🔴 Es urgente
            </label>
          )}

          {draft.tipo === "ofrezco" && (
            <>
              <label style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0 4px", fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                <input
                  type="checkbox"
                  checked={draft.remoto}
                  onChange={(e) => set({ remoto: e.target.checked, origen: e.target.checked ? draft.origen : "" })}
                  style={{ width: 18, height: 18, accentColor: "var(--verde)" }}
                />
                🌍 Ofrezco esto desde otra ciudad o país
              </label>
              {draft.remoto && (
                <input
                  value={draft.origen}
                  onChange={(e) => set({ origen: e.target.value })}
                  placeholder="¿Desde dónde ofreces esto? Ej: Bogotá"
                  style={{ ...inp, marginTop: 8 }}
                  maxLength={60}
                />
              )}
              <p style={{ fontSize: 12, color: "var(--muted)", margin: "6px 0 0", fontStyle: "italic" }}>
                {draft.remoto
                  ? "En Ubicación pon la zona a la que puedes enviar la ayuda — así aparece en los filtros de esa comunidad."
                  : "Pon la ubicación desde donde ofreces esto — así te pueden contactar y coordinar cómo retirarlo o recibirlo."}
              </p>
            </>
          )}

          <label style={{ ...lbl, marginTop: 16 }}>Ubicación</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={draft.pais} onChange={(e) => set({ pais: e.target.value })} placeholder="País" style={{ ...inp, flex: 1 }} maxLength={40} />
            <input value={draft.departamento} onChange={(e) => set({ departamento: e.target.value })} placeholder="Departamento" style={{ ...inp, flex: 1 }} maxLength={40} />
          </div>
          <input value={draft.municipio} onChange={(e) => set({ municipio: e.target.value })} placeholder="Municipio" style={{ ...inp, marginTop: 8 }} maxLength={60} />
          <input value={draft.sector} onChange={(e) => set({ sector: e.target.value })} placeholder="Barrio / vereda / sector (opcional)" style={{ ...inp, marginTop: 8 }} maxLength={60} />
        </div>

        <div style={{ padding: "12px 20px 20px", borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12, fontSize: 12.5, color: "var(--ink-soft)" }}>
            <input type="checkbox" checked={draft.confirmo} onChange={(e) => set({ confirmo: e.target.checked })} style={{ width: 18, height: 18, marginTop: 1, flexShrink: 0, accentColor: "var(--rojo)" }} />
            <span>Confirmo que esta información es real. Esta red funciona porque la comunidad confía en lo que se publica.</span>
          </label>
          {error && <p style={{ color: "var(--rojo)", fontSize: 12.5, margin: "0 0 8px" }}>{error}</p>}
          <button
            type="submit"
            disabled={saving}
            style={{ width: "100%", padding: "16px 0", borderRadius: 18, border: "none", background: "linear-gradient(135deg, #ec7a3f, var(--naranja))", color: "#fff", fontWeight: 700, fontSize: 16, opacity: saving ? 0.7 : 1, boxShadow: "0 6px 16px rgba(232,89,12,0.3)" }}
          >
            {saving ? "Guardando…" : editingPost ? "Guardar cambios" : "Publicar"}
          </button>
        </div>
      </form>
    </div>
  );
}

const lbl = { display: "block", fontSize: 12.5, fontWeight: 600, margin: "10px 0 4px", color: "var(--muted)" };
const inp = { width: "100%", padding: "12px 14px", borderRadius: 14, border: "1.5px solid var(--border)", fontSize: 15, background: "#fff", color: "var(--ink)" };
