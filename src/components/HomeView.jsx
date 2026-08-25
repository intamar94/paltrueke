import { HandHeart, HeartHandshake, Megaphone, Radio, ShieldCheck, Users, MapPin, Share2, Download } from "lucide-react";
import EmergencyBanner from "./EmergencyBanner";
import { HeroDoodle } from "./Doodles";

const statConfig = [
  { key: "necesito", label: "Necesitan ayuda", action: "Ver necesidades", col: "var(--rojo)" },
  { key: "ofrezco", label: "Ayuda disponible", action: "Ver ayudas", col: "var(--verde)" },
  { key: "informo", label: "Información", action: "Ver información", col: "var(--info)" },
];

export default function HomeView({ counts, onTipo, onVerTodo, onVerTipo }) {
  const shareSite = async () => {
    const shareData = {
      title: "Pa'l Trueke",
      text: "Una red comunitaria para pedir, ofrecer y compartir ayuda en Colombia.",
      url: "https://paltrueke.co",
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard?.writeText(shareData.url);
    } catch (_) {
      // El usuario puede cancelar el diálogo nativo de compartir sin que sea un error de la aplicación.
    }
  };

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "22px 18px 100px" }}>
      <header>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg, var(--naranja), #d9a441)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 10px rgba(196,87,60,0.3)" }} aria-hidden="true">
            <Radio size={22} color="#fff" strokeWidth={2.5} />
          </div>
          <h1 className="disp" style={{ fontSize: 30, fontWeight: 800, margin: 0, lineHeight: 1, color: "var(--ink)" }}>PA'L TRUEKE</h1>
        </div>

        <div style={{ margin: "6px 0 10px" }} aria-hidden="true">
          <HeroDoodle />
        </div>

        <p style={{ margin: "0 0 8px", fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.55, textAlign: "center" }}>
          <strong>Una red comunitaria gratuita para pedir, ofrecer y compartir ayuda en Colombia.</strong>
        </p>
        <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5, textAlign: "center" }}>
          Conecta necesidades reales con personas dispuestas a ayudar. Comparte agua, alimentos, transporte, refugio, medicamentos, información y otros recursos con tu comunidad.
        </p>
      </header>

      <div style={{ marginBottom: 16 }}>
        <EmergencyBanner />
      </div>

      <section aria-labelledby="network-status-title" style={{ marginBottom: 22 }}>
        <h2 id="network-status-title" className="sr-only">Actividad actual de la red</h2>
        <div style={{ display: "flex", gap: 10 }}>
          {statConfig.map((s) => (
            <button
              key={s.key}
              onClick={() => onVerTipo?.(s.key)}
              aria-label={`${s.action}: ${counts[s.key] ?? 0}`}
              style={{ flex: 1, background: "#fff", border: `1.5px solid ${s.col}33`, borderRadius: 16, padding: "12px 6px", textAlign: "center", boxShadow: "0 2px 8px rgba(74,51,40,0.06)", color: "inherit" }}
            >
              <div className="disp" style={{ fontSize: 24, fontWeight: 700, color: s.col, lineHeight: 1 }}>{counts[s.key] ?? "—"}</div>
              <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)", marginTop: 3 }}>{s.label}</div>
              <div style={{ fontSize: 10.5, color: s.col, marginTop: 5, fontWeight: 700 }}>{s.action}</div>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="main-actions-title">
        <h2 id="main-actions-title" className="sr-only">Acciones principales</h2>
        <button onClick={() => onTipo("necesito")} style={bigBtn("linear-gradient(135deg, #d3654a, var(--rojo))", "rgba(196,87,60,0.3)")}>
          <HandHeart size={24} />
          <span className="disp" style={{ fontSize: 20, fontWeight: 700 }}>NECESITO AYUDA</span>
        </button>

        <button onClick={() => onTipo("ofrezco")} style={{ ...bigBtn("linear-gradient(135deg, #5c8a62, var(--verde))", "rgba(76,122,82,0.28)"), marginTop: 12 }}>
          <HeartHandshake size={24} />
          <span className="disp" style={{ fontSize: 20, fontWeight: 700 }}>PUEDO AYUDAR</span>
        </button>

        <button onClick={() => onTipo("informo")} style={{ ...bigBtn("linear-gradient(135deg, #6c7684, var(--info))", "rgba(91,100,112,0.25)"), marginTop: 12 }}>
          <Megaphone size={24} />
          <span className="disp" style={{ fontSize: 20, fontWeight: 700 }}>COMPARTIR INFORMACIÓN</span>
        </button>

        <button onClick={onVerTodo} style={{ width: "100%", marginTop: 16, padding: "13px 0", borderRadius: 18, border: "1.5px solid var(--border)", background: "#fff", color: "var(--ink)", fontWeight: 600, fontSize: 14 }}>
          Explorar todas las publicaciones
        </button>
      </section>

      <section aria-labelledby="share-title" style={{ marginTop: 30, padding: "22px 18px", borderRadius: 22, background: "linear-gradient(145deg, #fffaf1, #fff)", border: "1px solid #e8d8bf", boxShadow: "0 4px 16px rgba(74,51,40,0.06)" }}>
        <div style={{ textAlign: "center" }}>
          <h2 id="share-title" className="disp" style={{ margin: "0 0 6px", fontSize: 24, color: "var(--ink)" }}>Compártelo con tus vecinos</h2>
          <p style={{ margin: "0 auto 18px", maxWidth: 500, fontSize: 13, lineHeight: 1.5, color: "var(--ink-soft)" }}>
            Escanea el código QR de Pa'l Trueke para abrir la red. También puedes guardarlo o compartir el enlace para que más personas de tu comunidad conozcan la red.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ width: 190, height: 190, padding: 12, background: "#fff", borderRadius: 18, border: "1px solid #eadfce", boxShadow: "0 5px 18px rgba(74,51,40,0.09)" }}>
            <img src="/qr-paltrueke.svg" alt="Código QR para abrir paltrueke.co" width="166" height="166" style={{ display: "block", width: "100%", height: "100%" }} />
          </div>
        </div>

        <p style={{ margin: "0 0 14px", textAlign: "center", fontSize: 12, color: "var(--muted)" }}>paltrueke.co</p>

        <div style={{ display: "flex", gap: 9, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={shareSite} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, border: "none", borderRadius: 13, padding: "10px 14px", background: "var(--naranja)", color: "#fff", fontWeight: 700, fontSize: 13 }}>
            <Share2 size={17} />
            Compartir
          </button>
          <a href="/qr-paltrueke.svg" download="qr-paltrueke.svg" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, border: "1px solid var(--border)", borderRadius: 13, padding: "10px 14px", background: "#fff", color: "var(--ink)", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
            <Download size={17} />
            Guardar QR
          </a>
        </div>
      </section>

      <section aria-labelledby="how-title" style={{ marginTop: 30, padding: "20px 18px", borderRadius: 20, background: "rgba(255,255,255,0.72)", border: "1px solid var(--border)" }}>
        <h2 id="how-title" className="disp" style={{ margin: "0 0 7px", fontSize: 24, color: "var(--ink)" }}>¿Cómo funciona Pa'l Trueke?</h2>
        <p style={{ margin: "0 0 16px", fontSize: 13, lineHeight: 1.55, color: "var(--ink-soft)" }}>
          La idea es sencilla: una persona publica lo que necesita o puede ofrecer, y la comunidad ayuda a conectar ambas partes.
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          {[
            [Users, "Publica", "Cuenta qué necesitas, qué puedes ofrecer o qué información quieres compartir."],
            [MapPin, "Conecta", "Las publicaciones permiten encontrar oportunidades de ayuda dentro de la comunidad."],
            [ShieldCheck, "Cierra el círculo", "Coordina la ayuda de forma responsable y marca la publicación como resuelta cuando termine."],
          ].map(([Icon, title, text]) => (
            <div key={title} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "#faf4e9", color: "var(--naranja)", flexShrink: 0 }}>
                <Icon size={18} />
              </div>
              <div>
                <strong style={{ display: "block", fontSize: 13.5, marginBottom: 2 }}>{title}</strong>
                <span style={{ fontSize: 12.5, lineHeight: 1.45, color: "var(--ink-soft)" }}>{text}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="categories-title" style={{ marginTop: 18 }}>
        <h2 id="categories-title" className="disp" style={{ margin: "0 0 6px", fontSize: 22 }}>Ayuda que puedes pedir u ofrecer</h2>
        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: "var(--ink-soft)" }}>
          Agua, alimentos, transporte, refugio, medicamentos, ropa, información y otros recursos que puedan ser útiles para alguien de tu comunidad.
        </p>
      </section>

      <section aria-labelledby="faq-title" style={{ marginTop: 24 }}>
        <h2 id="faq-title" className="disp" style={{ margin: "0 0 10px", fontSize: 22 }}>Preguntas frecuentes</h2>
        <div style={{ display: "grid", gap: 7 }}>
          {[
            ["¿Pa'l Trueke es gratuito?", "Sí. La red está pensada para facilitar la ayuda comunitaria sin cobrar por publicar una necesidad o una oferta."],
            ["¿Pa'l Trueke sustituye a los servicios de emergencia?", "No. Ante un peligro inmediato para la vida, debes contactar a los servicios oficiales de emergencia. Pa'l Trueke es una red comunitaria complementaria."],
            ["¿Qué puedo publicar?", "Puedes pedir ayuda, ofrecer recursos o compartir información útil, siempre respetando las normas de la comunidad y la seguridad de las personas."],
            ["¿Dónde funciona Pa'l Trueke?", "La plataforma está orientada a Colombia y puede crecer por ciudades y comunidades a medida que aumente la participación local."],
          ].map(([question, answer]) => (
            <details key={question} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 13, padding: "11px 13px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 13.5 }}>{question}</summary>
              <p style={{ margin: "8px 0 0", fontSize: 12.5, lineHeight: 1.5, color: "var(--ink-soft)" }}>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

const bigBtn = (bg, shadowColor) => ({
  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
  padding: "19px 10px", borderRadius: 22, border: "none", background: bg, color: "#fff",
  boxShadow: `0 6px 16px ${shadowColor}`,
});
