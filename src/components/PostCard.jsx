import {
  AlertTriangle, MapPin, Clock, MessageCircle,
  CheckCircle2, HandHeart, Flag, BadgeCheck, Star, XCircle, Pencil, Trash2,
} from "lucide-react";
import { catInfo } from "../data/categories";
import { parseContacto } from "../lib/contact";

function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "ahora";
  const m = Math.floor(s / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.floor(h / 24)} d`;
}

const TIPO_BG = { necesito: "var(--rojo)", ofrezco: "var(--verde)", informo: "var(--info)" };
const TIPO_TINT = { necesito: "#FBEEE8", ofrezco: "#F0F6F1", informo: "#F0F1F3" };
const TIPO_BORDER = { necesito: "#F0D9CE", ofrezco: "#C7DECB", informo: "#D6D8DB" };
const TIPO_LABEL = { necesito: "Necesita", ofrezco: "Ofrece", informo: "Informa" };

export default function PostCard({ post, mine, isHelper, onMarkHelping, onResolve, onReport, onRelease, onEdit, onDelete }) {
  const { emoji, label } = catInfo(post.categoria);
  const contacto = parseContacto(post.contacto);
  const resuelta = post.estado === "resuelta";
  const canClose = mine || isHelper;
  const esCartel = post.tipo === "informo";

  return (
    <div
      style={{
        background: resuelta ? "#fff" : TIPO_TINT[post.tipo],
        borderRadius: 12,
        padding: 0,
        overflow: "hidden",
        border:
          !resuelta && post.urgente
            ? "1.5px dashed var(--rojo)"
            : `1px solid ${TIPO_BORDER[post.tipo]}`,
        borderLeft: `5px solid ${TIPO_BG[post.tipo]}`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        opacity: resuelta ? 0.65 : 1,
      }}
    >
      {esCartel && (
        <div style={{ background: "var(--info)", color: "#fff", padding: "7px 14px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13 }}>📢</span>
          <span className="disp" style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: "0.03em" }}>INFORMACIÓN COMUNITARIA</span>
        </div>
      )}
      <div style={{ padding: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {!esCartel && (
            <span
              style={{
                fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
                padding: "3px 8px", borderRadius: 5, background: TIPO_BG[post.tipo], color: "#fff",
              }}
            >
              {TIPO_LABEL[post.tipo]}
            </span>
          )}
          {mine && (
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10.5, fontWeight: 700, color: "var(--naranja)" }}>
              <Star size={11} fill="var(--naranja)" /> TUYA
            </span>
          )}
          {post.verificado && (
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10.5, fontWeight: 700, color: "var(--verde)" }}>
              <BadgeCheck size={13} /> VERIFICADO
            </span>
          )}
          {!resuelta && post.urgente && (
            <span style={{ display: "flex", alignItems: "center", gap: 3, color: "var(--rojo)", fontSize: 11, fontWeight: 700 }}>
              <AlertTriangle size={12} /> URGENTE
            </span>
          )}
          {post.estado === "en_proceso" && !resuelta && (
            <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--naranja)" }}>ALGUIEN ESTÁ AYUDANDO</span>
          )}
        </div>
        <span style={{ fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
          <Clock size={11} /> {timeAgo(post.created_at)}
        </span>
      </div>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, margin: "8px 0 8px", padding: "5px 11px 5px 8px", borderRadius: 20, background: "#F3F1EC", border: `1.5px solid ${TIPO_BG[post.tipo]}` }}>
        <span style={{ fontSize: 15 }}>{emoji}</span>
        <span className="disp" style={{ fontSize: esCartel ? 18 : 16, fontWeight: 700, color: "var(--ink)" }}>{label}</span>
      </div>
      {post.descripcion && (
        <p style={{ fontSize: esCartel ? 16 : 13.5, color: "#33362F", margin: "0 0 10px", lineHeight: 1.45, fontWeight: esCartel ? 500 : 400 }}>{post.descripcion}</p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--ink-soft)", fontSize: esCartel ? 14 : 12.5, fontWeight: esCartel ? 600 : 400, marginBottom: 10 }}>
        <MapPin size={13} />
        {[post.municipio, post.departamento, post.sector].filter(Boolean).join(" · ")}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {contacto.waHref && (
            <a href={contacto.waHref} target="_blank" rel="noopener noreferrer" style={btnGreen}>
              <MessageCircle size={14} /> WhatsApp
            </a>
          )}
          {!contacto.waHref && (
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--naranja)", border: "1px solid var(--naranja)", borderRadius: 8, padding: "8px 10px" }}>
              {post.contacto}
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!resuelta && post.tipo === "necesito" && post.estado === "activa" && !mine && (
            <button onClick={onMarkHelping} style={btnOrange}>
              <HandHeart size={15} /> Ayudar
            </button>
          )}
          {!resuelta && mine && post.estado === "en_proceso" && (
            <button onClick={onRelease} style={btnRedOutline} title="Si no te contactó o no llegó la ayuda">
              No llegó, liberar
            </button>
          )}
          {!resuelta && isHelper && !mine && post.estado === "en_proceso" && (
            <button onClick={onRelease} style={btnRedOutline} title="Si te equivocaste o ya no puedes ayudar">
              No puedo ayudar
            </button>
          )}
          {!resuelta && canClose && !esCartel && (
            <button onClick={onResolve} style={btnGreenOutline}>
              <CheckCircle2 size={15} /> Marcar resuelto
            </button>
          )}
          {!resuelta && mine && esCartel && (
            <button onClick={onResolve} style={btnGrayOutline} title="Si esta información ya no aplica">
              <XCircle size={13} /> Retirar información
            </button>
          )}
          {mine && (
            <button onClick={onEdit} style={btnGrayOutline} title="Editar">
              <Pencil size={13} /> Editar
            </button>
          )}
          {mine && (
            <button onClick={onDelete} style={btnRedOutline} title="Eliminar">
              <Trash2 size={13} /> Eliminar
            </button>
          )}
          {!mine && (
            <button onClick={onReport} style={btnGrayOutline} title="Reportar">
              <Flag size={13} /> Reportar
            </button>
          )}
        </div>
      </div>
      {esCartel && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed var(--border)", display: "flex", alignItems: "center", gap: 6, color: "var(--muted)", fontSize: 10.5 }}>
          <span>📡 PalTrueke</span>
          {post.municipio && <span>· {post.municipio}{post.departamento ? `, ${post.departamento}` : ""}</span>}
        </div>
      )}
      </div>
    </div>
  );
}

const btnGreen = {
  display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700,
  color: "#fff", background: "var(--verde)", borderRadius: 9, padding: "10px 14px", textDecoration: "none",
};
const btnOrange = {
  display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700,
  color: "#fff", background: "var(--naranja)", border: "none", borderRadius: 9, padding: "10px 14px",
};
const btnGreenOutline = {
  display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700,
  color: "var(--verde)", background: "#fff", border: "1.5px solid var(--verde)", borderRadius: 9, padding: "9px 13px",
};
const btnRedOutline = {
  display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700,
  color: "var(--rojo)", background: "#fff", border: "1.5px solid var(--rojo)", borderRadius: 9, padding: "9px 13px",
};
const btnGrayOutline = {
  display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700,
  color: "var(--ink-soft)", background: "#fff", border: "1.5px solid var(--border)", borderRadius: 9, padding: "9px 13px",
};
