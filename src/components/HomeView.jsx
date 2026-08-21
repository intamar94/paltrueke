import { HandHeart, HeartHandshake, Megaphone, Radio } from "lucide-react";
import EmergencyBanner from "./EmergencyBanner";
import { HeroDoodle } from "./Doodles";

// Pantalla de inicio: números de emergencia + accesos directos a
// publicar (Necesito/Ofrezco/Informo) + resumen del estado de la red.
export default function HomeView({ counts, onTipo, onVerTodo }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "22px 18px 100px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, var(--naranja), #d9a441)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 10px rgba(196,87,60,0.3)" }}>
          <Radio size={22} color="#fff" strokeWidth={2.5} />
        </div>
        <h1 className="disp" style={{ fontSize: 30, fontWeight: 800, margin: 0, lineHeight: 1, color: "var(--ink)" }}>PA'L TRUEKE</h1>
      </div>

      <div style={{ margin: "6px 0 10px" }}>
        <HeroDoodle />
      </div>

      <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5, textAlign: "center" }}>
        Red vecinal <strong>gratuita</strong> para pedir u ofrecer ayuda en emergencias: agua, comida, refugio, transporte y más. Una herramienta hecha por y para la comunidad — cuidémosla entre todos.
      </p>

      <div style={{ marginBottom: 18 }}>
        <EmergencyBanner />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Necesitan ayuda", value: counts.necesito, col: "var(--rojo)" },
          { label: "Ayuda disponible", value: counts.ofrezco, col: "var(--verde)" },
          { label: "Información", value: counts.informo, col: "var(--info)" },
        ].map((s) => (
          <div key={s.label} style={{ flex: 1, background: "#fff", border: `1.5px solid ${s.col}33`, borderRadius: 16, padding: "12px 6px", textAlign: "center", boxShadow: "0 2px 8px rgba(74,51,40,0.06)" }}>
            <div className="disp" style={{ fontSize: 24, fontWeight: 700, color: s.col, lineHeight: 1 }}>{s.value ?? "—"}</div>
            <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)", marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <button onClick={() => onTipo("necesito")} style={bigBtn("linear-gradient(135deg, #d3654a, var(--rojo))", "rgba(196,87,60,0.3)")}>
        <HandHeart size={24} />
        <span className="disp" style={{ fontSize: 20, fontWeight: 700 }}>NECESITO</span>
      </button>

      <button onClick={() => onTipo("ofrezco")} style={{ ...bigBtn("linear-gradient(135deg, #5c8a62, var(--verde))", "rgba(76,122,82,0.28)"), marginTop: 12 }}>
        <HeartHandshake size={24} />
        <span className="disp" style={{ fontSize: 20, fontWeight: 700 }}>OFREZCO</span>
      </button>

      <button onClick={() => onTipo("informo")} style={{ ...bigBtn("linear-gradient(135deg, #6c7684, var(--info))", "rgba(91,100,112,0.25)"), marginTop: 12 }}>
        <Megaphone size={24} />
        <span className="disp" style={{ fontSize: 20, fontWeight: 700 }}>INFORMO</span>
      </button>

      <button onClick={onVerTodo} style={{ width: "100%", marginTop: 18, padding: "13px 0", borderRadius: 18, border: "1.5px solid var(--border)", background: "#fff", color: "var(--ink)", fontWeight: 600, fontSize: 14 }}>
        Ver publicaciones
      </button>
    </div>
  );
}

const bigBtn = (bg, shadowColor) => ({
  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
  padding: "19px 0", borderRadius: 22, border: "none", background: bg, color: "#fff",
  boxShadow: `0 6px 16px ${shadowColor}`,
});
