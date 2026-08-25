import { useState } from "react";
import { Phone, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { TrustDoodle } from "./Doodles";

const PRIVACY_ACCEPTED_KEY = "paltrueke_privacy_accepted_v1";

// Pide el teléfono solo en el momento en que hace falta de verdad
// (publicar o comprometerse a ayudar) — nunca antes de dejar ver el feed.
export default function PhoneGateModal({ userId, onDone, onClose }) {
  const [telefono, setTelefono] = useState("");
  const [accepted, setAccepted] = useState(() => localStorage.getItem(PRIVACY_ACCEPTED_KEY) === "1");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const digits = telefono.replace(/\D/g, "");
    if (digits.length < 7) {
      setError("Escribe un número de teléfono válido.");
      return;
    }
    if (!accepted) {
      setError("Lee y acepta la información sobre tratamiento de datos para continuar.");
      return;
    }
    localStorage.setItem(PRIVACY_ACCEPTED_KEY, "1");
    setSaving(true);
    setError("");
    const { error: err } = await supabase.from("profiles").insert({ id: userId, telefono: telefono.trim() });
    if (err) {
      setError("No se pudo guardar. Revisa tu conexión e intenta de nuevo.");
      setSaving(false);
      return;
    }
    onDone(telefono.trim());
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(74,51,40,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }} onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} style={{ background: "var(--bg)", borderRadius: 24, padding: "18px 20px 22px", maxWidth: 380, width: "100%", boxShadow: "0 14px 34px rgba(74,51,40,0.28)", maxHeight: "92vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button type="button" onClick={onClose} aria-label="Cerrar" style={{ border: "none", background: "#fff", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 6px rgba(74,51,40,0.1)" }}><X size={16} color="var(--ink)" /></button>
        </div>

        <div style={{ margin: "0 0 8px" }}><TrustDoodle /></div>
        <p style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", textAlign: "center", margin: "0 0 6px" }}>No estás solo/a</p>
        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, textAlign: "center", margin: "0 0 20px" }}>Para publicar o para ayudar, necesitamos un número donde puedan contactarte — así la red sabe que hay una persona real detrás de cada pedido.</p>

        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "var(--muted)", marginBottom: 7 }}><Phone size={14} /> Tu número de WhatsApp o teléfono</label>
        <input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Ej: 300 123 4567" style={{ width: "100%", padding: "13px 14px", borderRadius: 14, border: "1.5px solid var(--border)", fontSize: 16 }} inputMode="tel" autoFocus />

        <label style={{ display: "flex", alignItems: "flex-start", gap: 9, marginTop: 13, color: "var(--ink-soft)", fontSize: 11.5, lineHeight: 1.45, cursor: "pointer" }}>
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} style={{ marginTop: 2, accentColor: "var(--naranja)" }} />
          <span>He leído la <a href="/privacidad" target="_blank" rel="noreferrer" style={{ color: "var(--naranja)", fontWeight: 700 }}>Política de privacidad</a> y entiendo que mi teléfono puede ser utilizado para coordinar ayudas y quedar visible como contacto de las publicaciones que realice.</span>
        </label>
        {error && <p style={{ color: "var(--rojo)", fontSize: 12.5, marginTop: 8 }}>{error}</p>}

        <button type="submit" disabled={saving} style={{ width: "100%", marginTop: 16, padding: "15px 0", borderRadius: 16, border: "none", background: "linear-gradient(135deg, #ec7a3f, var(--naranja))", color: "#fff", fontWeight: 700, fontSize: 16, opacity: saving ? 0.7 : 1, boxShadow: "0 5px 14px rgba(232,89,12,0.28)" }}>{saving ? "Guardando…" : "Continuar"}</button>

        <p style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 14 }}>Es gratuito. Solo se usa para que te contacten y para el uso responsable de la red — no se vende ni se utiliza para publicidad personalizada.</p>
      </form>
    </div>
  );
}
