import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, AlertTriangle, Bell } from "lucide-react";
import { supabase, supabaseConfigured } from "./lib/supabaseClient";
import { ensureSession } from "./lib/auth";
import { usePosts } from "./hooks/usePosts";
import { catInfo } from "./data/categories";
import { isPushSupported, subscribeToPush } from "./lib/push";
import HomeView from "./components/HomeView";
import FeedView from "./components/FeedView";
import PostForm from "./components/PostForm";
import ConfirmDialog from "./components/ConfirmDialog";
import ReportDialog from "./components/ReportDialog";
import PhoneGateModal from "./components/PhoneGateModal";
import Toast from "./components/Toast";

const EMPTY_FILTERS = { tipo: "todo", urgente: false, categoria: null, mine: false, zona: "" };
const PUSH_PROMPT_KEY = "paltrueke_push_prompted";

export default function App() {
  const [userId, setUserId] = useState(null);
  const [authError, setAuthError] = useState("");
  const [telefono, setTelefono] = useState(undefined);
  const [phoneGateOpen, setPhoneGateOpen] = useState(false);
  const [pushOffer, setPushOffer] = useState(false);
  const pendingActionRef = useRef(null);
  const topRef = useRef(null);
  const [view, setView] = useState("home");
  const [feedTitle, setFeedTitle] = useState("Inicio");
  const [formTipo, setFormTipo] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [confirming, setConfirming] = useState(null);
  const [reporting, setReporting] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [actionError, setActionError] = useState("");
  const [toast, setToast] = useState(null);
  const [feedEntering, setFeedEntering] = useState(false);
  const { posts, loading, error, reload } = usePosts();

  useEffect(() => { ensureSession().then(async (user) => { setUserId(user.id); const { data } = await supabase.from("profiles").select("telefono").eq("id", user.id).maybeSingle(); setTelefono(data?.telefono || null); }).catch(() => setAuthError("No se pudo conectar. Revisa tu conexión e intenta de nuevo.")); }, []);
  useEffect(() => { if (telefono === undefined || !telefono || !userId || !isPushSupported()) return; if (Notification.permission !== "default" || localStorage.getItem(PUSH_PROMPT_KEY)) return; const timer = setTimeout(() => setPushOffer(true), 1200); return () => clearTimeout(timer); }, [telefono, userId]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3200); return () => clearTimeout(t); }, [toast]);
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
  }, [view]);

  const dismissPushOffer = () => { localStorage.setItem(PUSH_PROMPT_KEY, "1"); setPushOffer(false); };
  const enablePush = async () => { localStorage.setItem(PUSH_PROMPT_KEY, "1"); setPushOffer(false); try { const subscription = await subscribeToPush(userId); if (subscription) setToast("Notificaciones de Pa'l Trueke activadas. Te van a llegar al celular aunque tengas la app cerrada."); } catch (_) {} };
  const requirePhone = (action) => { if (telefono) { action(); return; } if (!userId) { setActionError("Danos un segundo, estamos preparando tu sesión, e intenta de nuevo."); return; } pendingActionRef.current = action; setPhoneGateOpen(true); };
  const closePhoneGate = () => { pendingActionRef.current = null; setPhoneGateOpen(false); };
  const handlePhoneDone = (t) => { setTelefono(t); setPhoneGateOpen(false); const action = pendingActionRef.current; pendingActionRef.current = null; if (action) action(); };
  const enterFeed = useCallback(async (tipoFiltro, title, nextFilters = null) => { setFeedEntering(true); if (nextFilters) setFilters(nextFilters); else setFilters({ ...EMPTY_FILTERS, tipo: tipoFiltro || "todo" }); setFeedTitle(title || "Inicio"); setView("feed"); try { await reload(); } finally { setFeedEntering(false); } }, [reload]);
  const goFeed = (tipoFiltro, title) => enterFeed(tipoFiltro, title);
  const counts = { necesito: (posts || []).filter((p) => p.tipo === "necesito" && p.estado !== "resuelta").length, ofrezco: (posts || []).filter((p) => p.tipo === "ofrezco" && p.estado !== "resuelta").length, informo: (posts || []).filter((p) => p.tipo === "informo").length };
  const DOS_DIAS_MS = 1000 * 60 * 60 * 48;
  const olvidadas = (posts || []).filter((p) => p.estado === "en_proceso" && (p.owner_id === userId || p.helper_id === userId) && p.updated_at && Date.now() - new Date(p.updated_at).getTime() > DOS_DIAS_MS);
  const createPost = useCallback(async (draft) => { const { error: err } = await supabase.from("posts").insert({ owner_id: userId, tipo: draft.tipo, categoria: draft.categoria, titulo: catInfo(draft.categoria).label, descripcion: draft.descripcion.trim() || null, pais: "Colombia", departamento: draft.departamento.trim() || "Colombia", municipio: draft.municipio.trim(), sector: draft.sector.trim() || null, urgente: draft.urgente, contacto: draft.contacto.trim() }); if (err) { const motivo = err.message?.includes("3 pedidos") ? "3 pedidos" : err.message?.includes("6 publicaciones") ? "6 publicaciones" : null; if (motivo) { try { await supabase.from("blocked_attempts").insert({ owner_id: userId, motivo }); } catch (_) {} } throw err; } setFormTipo(null); setToast(draft.tipo === "necesito" ? "¡Publicado! Ya saben que necesitas ayuda." : "¡Publicado! Ya lo pueden ver tus vecinos."); setFilters({ ...EMPTY_FILTERS, mine: true }); setFeedTitle("Lo que has publicado"); setFeedEntering(true); setView("feed"); try { await reload(); } finally { setFeedEntering(false); } }, [userId, reload]);
  const updatePost = useCallback(async (post, draft) => { const { error: err } = await supabase.from("posts").update({ tipo: draft.tipo, categoria: draft.categoria, titulo: catInfo(draft.categoria).label, descripcion: draft.descripcion.trim() || null, pais: "Colombia", departamento: draft.departamento.trim() || "Colombia", municipio: draft.municipio.trim(), sector: draft.sector.trim() || null, urgente: draft.urgente }).eq("id", post.id); if (err) throw err; setEditingPost(null); setToast("Cambios guardados."); await reload(); }, [reload]);
  const deletePost = async (post) => { setActionError(""); const { error: err } = await supabase.from("posts").delete().eq("id", post.id); if (err) setActionError(err.message); await reload(true); setConfirming(null); };
  const markHelping = async (post) => { setActionError(""); const { error: err } = await supabase.rpc("mark_helping", { p_id: post.id }); if (err) { setActionError(err.message); return; } setToast("Gracias por dar el paso. Coordina por WhatsApp o llamada para llevar la ayuda."); supabase.functions.invoke("send-push", { body: { postId: post.id, event: "helping" } }).catch(() => {}); await reload(true); };
  const resolve = async (post) => { setActionError(""); const { error: err } = await supabase.rpc("mark_resolved", { p_id: post.id }); if (err) { setActionError(err.message); setConfirming(null); return; } let message = "Publicación resuelta. Gracias por cerrar el círculo."; if (post.helper_id) { const soyOwner = post.owner_id === userId; const otraParteYaConfirmo = soyOwner ? post.confirmado_helper : post.confirmado_owner; message = otraParteYaConfirmo ? "Publicación resuelta. Gracias a los dos por confirmar." : "Tu confirmación quedó registrada. Falta que la otra persona también confirme."; } setToast(message); supabase.functions.invoke("send-push", { body: { postId: post.id, event: "confirmed" } }).catch(() => {}); await reload(true); setConfirming(null); };
  const releasePost = async (post) => { setActionError(""); const { error: err } = await supabase.rpc("release_helper", { p_id: post.id }); if (err) { setActionError(err.message); setConfirming(null); return; } setToast("Publicación liberada, vuelve a estar disponible para que otra persona ayude."); await reload(true); setConfirming(null); };
  const submitReport = async ({ motivo, detalle }) => { setActionError(""); const { error: err } = await supabase.from("reports").insert({ post_id: reporting.id, reporter_id: userId, motivo, detalle: detalle.trim() || null }); if (err) { setActionError(err.message); return; } setReporting(null); };

  const anyModalOpen = Boolean(formTipo || editingPost || phoneGateOpen || confirming || reporting);

  return <div ref={topRef} style={{ minHeight: "100vh" }}>
    {!supabaseConfigured && <div style={{ maxWidth: 480, margin: "60px auto", padding: "0 20px", textAlign: "center" }}><AlertTriangle size={32} color="var(--rojo)" style={{ marginBottom: 12 }} /><h2 className="disp" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Falta configurar Supabase</h2><p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5 }}>No se encontraron <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>. En Vercel: Settings → Environment Variables, agrégalas y vuelve a desplegar.</p></div>}
    {authError && <div style={{ background: "#FDECE5", color: "var(--rojo)", padding: "10px 16px", fontSize: 13, textAlign: "center" }}>{authError}</div>}
    {actionError && <div style={{ maxWidth: 720, margin: "12px auto 0", padding: "0 16px" }}><div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#FDECE5", border: "1px solid var(--rojo)", borderRadius: 10, padding: "10px 12px" }}><AlertTriangle size={16} color="var(--rojo)" style={{ flexShrink: 0, marginTop: 1 }} /><span style={{ fontSize: 13, color: "var(--ink)", flex: 1 }}>{actionError}</span><button onClick={() => setActionError("")} style={{ border: "none", background: "none", color: "var(--rojo)", fontWeight: 700 }}>✕</button></div></div>}
    {pushOffer && !anyModalOpen && <div style={{ maxWidth: 720, margin: "12px auto 0", padding: "0 16px" }}><div style={{ background: "#fff", border: "1.5px solid var(--naranja)", borderRadius: 18, padding: "14px 16px", boxShadow: "0 4px 14px rgba(232,89,12,0.14)", display: "flex", gap: 10, alignItems: "flex-start" }}><Bell size={19} color="var(--naranja)" style={{ flexShrink: 0, marginTop: 2 }} /><div style={{ flex: 1 }}><strong style={{ display: "block", color: "var(--ink)", fontSize: 14, marginBottom: 4 }}>¿Quieres notificaciones Pa'l Trueke?</strong><span style={{ display: "block", color: "var(--muted)", fontSize: 12.5, lineHeight: 1.4 }}>Te avisamos cuando alguien vaya a ayudarte, confirme una ayuda, o pase algo importante — aunque tengas la app cerrada.</span><div style={{ display: "flex", gap: 8, marginTop: 10 }}><button onClick={enablePush} style={{ border: "none", borderRadius: 12, padding: "8px 12px", background: "var(--naranja)", color: "#fff", fontWeight: 700, fontSize: 12.5 }}>Activar</button><button onClick={dismissPushOffer} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "8px 12px", background: "#fff", color: "var(--muted)", fontWeight: 600, fontSize: 12.5 }}>Ahora no</button></div></div></div></div>}
    {olvidadas.length > 0 && view === "home" && <div style={{ maxWidth: 720, margin: "12px auto 0", padding: "0 16px" }}><button onClick={() => enterFeed(null, "¿Ya se resolvieron?", { ...EMPTY_FILTERS, mine: true })} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 10, background: "#FFF6E8", border: "1px solid #E8590C", borderRadius: 10, padding: "10px 12px" }}><AlertTriangle size={18} color="var(--naranja)" style={{ flexShrink: 0 }} /><span style={{ fontSize: 13, color: "var(--ink)" }}>Tienes {olvidadas.length} {olvidadas.length === 1 ? "publicación que lleva" : "publicaciones que llevan"} más de 2 días con ayuda en camino. ¿Ya se resolvió? Toca para revisar.</span></button></div>}
    {view === "home" && <HomeView counts={counts} onTipo={(t) => requirePhone(() => setFormTipo(t))} onVerTodo={() => goFeed("todo", "Todas las publicaciones")} />}
    {view === "feed" && <FeedView title={feedTitle} posts={posts} loading={loading} feedEntering={feedEntering} error={error} filters={filters} setFilters={setFilters} myId={userId} onBack={() => setView("home")} onRefresh={() => reload()} onMarkHelping={(post) => requirePhone(() => setConfirming({ post, action: "helping" }))} onResolve={(post) => setConfirming({ post, action: "resolve" })} onReport={(post) => setReporting(post)} onRelease={(post) => setConfirming({ post, action: "release" })} onEdit={(post) => setEditingPost(post)} onDelete={(post) => setConfirming({ post, action: "delete" })} />}
    <button onClick={() => requirePhone(() => setFormTipo("necesito"))} aria-label="Publicar" style={{ position: "fixed", bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30, background: "var(--naranja)", border: "none", color: "#fff", boxShadow: "0 4px 14px rgba(232,89,12,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={28} /></button>
    {(formTipo || editingPost) && <PostForm initialTipo={formTipo} defaultContacto={telefono} editingPost={editingPost} onClose={() => { setFormTipo(null); setEditingPost(null); }} onSubmit={editingPost ? (draft) => updatePost(editingPost, draft) : createPost} />}
    {phoneGateOpen && <PhoneGateModal userId={userId} onDone={handlePhoneDone} onClose={closePhoneGate} />}
    {confirming && <ConfirmDialog title={confirming.action === "resolve" ? "¿Marcar como resuelto?" : confirming.action === "helping" ? "¿Vas a ayudar con esto?" : confirming.action === "delete" ? "¿Eliminar esta publicación?" : "¿Liberar este pedido?"} description={confirming.action === "resolve" && confirming.post.helper_id ? "Vas a confirmar que de tu parte ya se resolvió. Si la otra persona también confirma, se cierra automáticamente. Si no, queda pendiente su confirmación." : confirming.action === "resolve" ? "Se va a quitar de la lista principal. Esta acción no se puede deshacer." : confirming.action === "helping" ? "Los demás van a ver que ya alguien está en camino. Cuando la ayuda llegue, marca \"Resuelto\" (tú o quien publicó, cualquiera de los dos puede hacerlo)." : confirming.action === "delete" ? "Se borra por completo, no se puede recuperar. Si solo pusiste un dato mal, mejor usa \"Editar\" en vez de esto." : "Va a volver a estar disponible para que otra persona ayude. Úsalo si te equivocaste, ya no puedes ayudar, o la otra parte no te contactó."} onCancel={() => setConfirming(null)} onConfirm={() => { if (confirming.action === "resolve") resolve(confirming.post); else if (confirming.action === "helping") { markHelping(confirming.post); setConfirming(null); } else if (confirming.action === "delete") deletePost(confirming.post); else releasePost(confirming.post); }} />}
    {reporting && <ReportDialog onCancel={() => setReporting(null)} onSubmit={submitReport} />}
    <Toast message={toast} />
  </div>;
}
