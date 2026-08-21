import { PhoneCall } from "lucide-react";

const EMERGENCIAS = [
  { label: "Emergencias", numero: "123" },
  { label: "Cruz Roja", numero: "132" },
  { label: "Bomberos", numero: "119" },
  { label: "Gestión del riesgo", numero: "144" },
];

export default function EmergencyBanner() {
  return (
    <div
      style={{
        background: "#FDF3E9",
        border: "1px solid #EFCBAE",
        borderRadius: 18,
        padding: "14px 16px",
      }}
    >
      <div style={{ display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13.5, marginBottom: 10, color: "#5A4A3A" }}>
        <PhoneCall size={16} color="var(--rojo)" style={{ flexShrink: 0, marginTop: 2 }} />
        <span>
          Si existe <strong>peligro inmediato para la vida</strong>, llama ya. PalTrueke es una red
          de ayuda vecinal y no sustituye a bomberos, policía, Defensa Civil ni Cruz Roja.
        </span>
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {EMERGENCIAS.map((e) => (
          <a
            key={e.numero}
            href={`tel:${e.numero}`}
            style={{
              display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700,
              color: "var(--rojo)", background: "#fff", border: "1px solid #EFCBAE",
              borderRadius: 20, padding: "6px 11px", textDecoration: "none",
            }}
          >
            <PhoneCall size={11} /> {e.label} {e.numero}
          </a>
        ))}
      </div>
    </div>
  );
}
