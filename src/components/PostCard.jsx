import { useState } from "react";
import { MapPin, Phone, MessageCircle, Check, HeartHandshake, Flag, Pencil, Trash2, Unlock, Clock, AlertTriangle } from "lucide-react";
import { catInfo, tipoInfo, priorityColor } from "../data/categories";
import { parseContacto } from "../lib/contact";

function timeAgo(date) {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

export default function PostCard({ post, mine, isHelper, onMarkHelping, onResolve, onReport, onRelease, onEdit, onDelete }) {
  const c = catInfo(post.categoria);
  const t = tipoInfo(post.tipo);
  const contact = parseContacto(post.contacto);
  const [showContact, setShowContact] = useState(false);
  const isResolved = post.estado === "resuelta";
  const inProgress = post.estado === "en_proceso";
  const accent = priorityColor(post);

  return (
    <article style={{ background: "#fff", borderRadius: 18, border: `1.5px solid ${post.urgente ? "#e7b7a9" : "var(--border)"}`, overflow: "hidden", boxShadow: "0 2px 9px rgba(74,51,40,0.06)", opacity: isResolved ? 0.72 : 1 }}>
      <div style={{ height: 4, background: accent }} />
      <div style={{ padding: "14px 15px 13px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
            <span style={{ fontSize: 20 }}>{c.emoji}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: t.color }}>{t.label}</span>
                {post.urgente && <span style={{ fontSize: 10.5, fontWeight: 800, color: "#fff", background: "var(--rojo)", padding: "3px 7px", borderRadius: 10 }}>URGENTE</span>}
                {inProgress && <span style={{ fontSize: 10.5, fontWeight: 700, color: "#fff", background: "var(--verde)", padding: "3px 7px", borderRadius: 10 }}>AYUDA EN CAMINO</span>}
                {isResolved && <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--verde)", background: "#edf5ee", padding: "3px 7px", borderRadius: 10 }}>RESUELTO</span>}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 2 }}>{c.label} · {timeAgo(post.created_at)}</div>
            </div>
          </div>
          <span style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap" }}>{post.municipio}</span>
        </div>

        <p style={{ fontSize: 15, lineHeight: 1.45, color: "var(--ink)", margin: "11px 0 7px", whiteSpace: "pre-wrap" }}>{post.descripcion}</p>

        <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap", color: "var(--muted)", fontSize: 11.5 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MapPin size={12} /> {post.departamento}{post.sector ? ` · ${post.sector}` : ""}</span>
          {post.remoto && <span style={{ display: "flex", alignItems: "center", gap: 3, color: "var(--verde)" }}>🌍 Desde {post.origen || "otra ubicación"}</span>}
        </div>

        {showContact && !isResolved && (
          <div style={{ marginTop: 12, padding: 11, borderRadius: 14, background: "#f7f1e8", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 7 }}>Contacto</div>
            <div style={{ display: "flex", gap: 7 }}>
              {contact.telHref && <a href={contact.telHref} style={contactBtn}> <Phone size={15} /> Llamar</a>}
              {contact.waHref && <a href={contact.waHref} target="_blank" rel="noreferrer" style={contactBtn}> <MessageCircle size={15} /> WhatsApp</a>}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 7, marginTop: 13, flexWrap: "wrap" }}>
          {!isResolved && !mine && post.tipo === "necesito" && !inProgress && (
            <button onClick={onMarkHelping} style={primaryBtn("var(--verde)")}><HeartHandshake size={15} /> Voy a ayudar</button>
          )}
          {!isResolved && (mine || isHelper) && (
            <button onClick={onResolve} style={primaryBtn("var(--verde)")}><Check size={15} /> Resuelto</button>
          )}
          {!isResolved && inProgress && (mine || isHelper) && (
            <button onClick={onRelease} style={secondaryBtn}><Unlock size={14} /> Liberar</button>
          )}
          {!isResolved && contact.isPhoneLike && (
            <button onClick={() => setShowContact((v) => !v)} style={secondaryBtn}>
              {showContact ? "Ocultar contacto" : "Contactar"}
            </button>
          )}
          {mine && !isResolved && <button onClick={onEdit} style={iconBtn} aria-label="Editar"><Pencil size={15} /></button>}
          {mine && !isResolved && <button onClick={onDelete} style={{ ...iconBtn, color: "var(--rojo)" }} aria-label="Eliminar"><Trash2 size={15} /></button>}
          {!mine && !isResolved && <button onClick={onReport} style={iconBtn} aria-label="Reportar"><Flag size={14} /></button>}
        </div>
      </div>
    </article>
  );
}

const contactBtn = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "9px 5px", borderRadius: 11, background: "#fff", color: "var(--ink)", textDecoration: "none", fontSize: 12, fontWeight: 700, border: "1px solid var(--border)" };
const primaryBtn = (bg) => ({ display: "flex", alignItems: "center", gap: 5, border: "none", borderRadius: 11, padding: "9px 12px", background: bg, color: "#fff", fontSize: 12, fontWeight: 700 });
const secondaryBtn = { display: "flex", alignItems: "center", gap: 5, border: "1px solid var(--border)", borderRadius: 11, padding: "9px 12px", background: "#fff", color: "var(--ink)", fontSize: 12, fontWeight: 600 };
const iconBtn = { width: 34, height: 34, border: "1px solid var(--border)", borderRadius: 11, background: "#fff", color: "var(--muted)", display: "grid", placeItems: "center" };
