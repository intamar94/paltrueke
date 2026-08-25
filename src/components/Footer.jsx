import { ShieldCheck, FileText, HeartHandshake, Mail, Scale } from "lucide-react";

const links = [
  ["Aviso legal", "/contacto", Scale],
  ["Privacidad", "/privacidad", ShieldCheck],
  ["Términos", "/terminos", FileText],
  ["Seguridad", "/seguridad", HeartHandshake],
  ["Contacto", "/contacto", Mail],
];

export default function Footer({ onNavigate }) {
  const go = (path) => {
    window.history.pushState({}, "", path);
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer style={{ maxWidth: 720, margin: "0 auto", padding: "28px 18px 34px", color: "var(--muted)" }}>
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 16px", marginBottom: 14 }}>
          {links.map(([label, path, Icon]) => (
            <button key={`${label}-${path}`} onClick={() => go(path)} style={{ border: "none", background: "transparent", color: "var(--ink-soft)", fontSize: 12.5, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5, padding: 4 }}>
              <Icon size={13} strokeWidth={2} /> {label}
            </button>
          ))}
        </div>
        <p style={{ margin: 0, textAlign: "center", fontSize: 11.5, lineHeight: 1.55 }}>
          © 2026 Pa'l Trueke · Red comunitaria de Colombia
        </p>
        <p style={{ margin: "5px 0 0", textAlign: "center", fontSize: 11.5 }}>
          Contacto: <a href="mailto:info@paltrueke.co" style={{ color: "var(--naranja)", fontWeight: 600 }}>info@paltrueke.co</a>
        </p>
      </div>
    </footer>
  );
}
