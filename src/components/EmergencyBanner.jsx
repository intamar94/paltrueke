import { PhoneCall } from "lucide-react";

const EMERGENCIAS = [
  { label: "Emergencias", numero: "123" },
  { label: "Cruz Roja", numero: "132" },
  { label: "Bomberos", numero: "119" },
  { label: "Defensa Civil", numero: "144" },
];

export default function EmergencyBanner() {
  return (
    <aside
      aria-labelledby="emergency-title"
      style={{
        background: "#FDF3E9",
        border: "1px solid #EFCBAE",
        borderRadius: 18,
        padding: "14px 16px",
      }}
    >
      <div style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13.5, marginBottom: 10, color: "#5A4A3A" }}>
        <PhoneCall size={16} color="var(--rojo)" style={{ flexShrink: 0, marginTop: 2 }} aria-hidden="true" />
        <div>
          <strong id="emergency-title" style={{ display: "block", marginBottom: 2 }}>¿Es una emergencia?</strong>
          <span>
            Si existe <strong>peligro inmediato para la vida</strong>, llama a los servicios oficiales. Pa'l Trueke es una red de ayuda comunitaria y no sustituye a bomberos, policía, Defensa Civil ni Cruz Roja.
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }} aria-label="Líneas de emergencia en Colombia">
        {EMERGENCIAS.map((e) => (
          <a
            key={e.numero}
            href={`tel:${e.numero}`}
            aria-label={`Llamar a ${e.label}, ${e.numero}`}
            style={{
              display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700,
              color: "var(--rojo)", background: "#fff", border: "1px solid #EFCBAE",
              borderRadius: 20, padding: "6px 11px", textDecoration: "none",
            }}
          >
            <PhoneCall size={11} aria-hidden="true" /> {e.label} {e.numero}
          </a>
        ))}
      </div>
    </aside>
  );
}
