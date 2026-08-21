import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, AlertTriangle } from "lucide-react";
import { supabase, supabaseConfigured } from "./lib/supabaseClient";
import { ensureSession } from "./lib/auth";
import { usePosts } from "./hooks/usePosts";
import { catInfo } from "./data/categories";
import HomeView from "./components/HomeView";
import FeedView from "./components/FeedView";
import PostForm from "./components/PostForm";
import ConfirmDialog from "./components/ConfirmDialog";
import ReportDialog from "./components/ReportDialog";
import PhoneGateModal from "./components/PhoneGateModal";
import Toast from "./components/Toast";

const EMPTY_FILTERS = { tipo: "todo", urgente: false, categoria: null, mine: false, zona: "" };

export default function App() {
  const [userId, setUserId] = useState(null);
  const [authError, setAuthError] = useState("");
  const [telefono, setTelefono] = useState(undefined); // undefined = cargando, null = falta pedirlo
  const [phoneGateOpen, setPhoneGateOpen] = useState(false);
  const pendingActionRef = useRef(null);
  const [view, setView] = useState("home"); // home | feed
  const [feedTitle, setFeedTitle] = useState("Inicio");
  const [formTipo, setFormTipo] = useState(null); // abre el form si no es null
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [confirming, setConfirming] = useState(null); // { post, action }
  const [reporting, setReporting] = useState(null); // post
  const [editingPost, setEditingPost] = useState(null); // post que se está editando, o null
  const [actionError, setActionError] = useState("");
  const [toast, setToast] = useState(null);

  const { posts, loading, error, reload } = usePosts();

  // Al abrir la app: crea/recupera la sesión anónima y busca si esta persona
  // ya tiene un teléfono guardado. Ya no bloquea la pantalla mientras tanto:
  // Inicio y el feed se ven de inmediato, sin pedir nada primero.
  useEffect(() => {
    ensureSession()
      .then(async (user) => {
        setUserId(user.id);
        const { data } = await supabase.from("profiles").select("telefono").eq("id", user.id).maybeSingle();
        setTelefono(data?.telefono || null);
      })
      .catch(() => setAuthError("No se pudo conectar. Revisa tu conexión e intenta de nuevo."));
  }, []);

  // El aviso de "gracias" se borra solo, para no obligar a nadie a cerrarlo
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  // Solo pedimos el teléfono en el momento en que hace falta de verdad
  // (publicar o comprometerse a ayudar) — nunca antes de dejar ver el feed.
  const requirePhone = (action) => {
    if (telefono) { action(); return; }
    if (!userId) { setActionError("Danos un segundo, estamos preparando tu sesión, e intenta de nuevo."); return; }
    pendingActionRef.current = action;
    setPhoneGateOpen(true);
  };
  const closePhoneGate = () => { pendingActionRef.current = null; setPhoneGateOpen(false); };
  const handlePhoneDone = (t) => {
    setTelefono(t);
    setPhoneGateOpen(false);
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    if (action) action();
  };

  // Navega al feed con un filtro de tipo ya aplicado
  const goFeed = (tipoFiltro, title) => {
    setFilters({ ...EMPTY_FILTERS, tipo: tipoFiltro || "todo" });
    setFeedTitle(title || "Inicio");
    setView("feed");
  };

  // Contadores para las tarjetas del Inicio
  const counts = {
    necesito: (posts || []).filter((p) => p.tipo === "necesito" && p.estado !== "resuelta").length,
    ofrezco: (posts || []).filter((p) => p.tipo === "ofrezco" && p.estado !== "resuelta").length,
    informo: (posts || []).filter((p) => p.tipo === "informo").length,
  };

  // Publicaciones "en proceso" hace más de 2 días: se le avisa a la
  // persona (dueño o ayudante) para que confirme si ya se resolvió
  const DOS_DIAS_MS = 1000 * 60 * 60 * 48;
  const olvidadas = (posts || []).filter(
    (p) =>
      p.estado === "en_proceso" &&
      (p.owner_id === userId || p.helper_id === userId) &&
      p.updated_at &&
      Date.now() - new Date(p.updated_at).getTime() > DOS_DIAS_MS
  );

  // Crea una publicación nueva. La base de datos todavía pide un "título"
  // (no se le pregunta a la persona, para no repetir la categoría), así
  // que se genera solo a partir de la categoría elegida. Si la base de
  // datos rechaza el pedido (por ejemplo, por el límite de publicaciones),
  // el error sube tal cual hasta PostForm para mostrárselo a la persona.
  const createPost = useCallback(
    async (draft) => {
      const { error: err } = await supabase.from("posts").insert({
        owner_id: userId,
        tipo: draft.tipo,
        categoria: draft.categoria,
        titulo: catInfo(draft.categoria).label,
        descripcion: draft.descripcion.trim() || null,
        pais: draft.pais.trim() || "Colombia",
        departamento: draft.departamento.trim() || draft.pais.trim() || "Colombia",
        municipio: draft.municipio.trim(),
        sector: draft.sector.trim() || null,
        urgente: draft.urgente,
        contacto: draft.contacto.trim(),
        remoto: Boolean(draft.remoto),
        origen: draft.remoto ? (draft.origen || "").trim() || null : null,
      });
      if (err) throw err;
      setFormTipo(null);
      // Después de publicar, la persona ve de inmediato que su pedido ya
      // está vivo en la red — nada de quedarse pensando "¿sí se envió?".
      setToast(draft.tipo === "necesito" ? "¡Publicado! Ya saben que necesitas ayuda." : "¡Publicado! Ya lo pueden ver tus vecinos.");
      setFilters({ ...EMPTY_FILTERS, mine: true });
      setFeedTitle("Lo que has publicado");
      setView("feed");
      await reload();
    },
    [userId, reload]
  );

  // Edita una publicación existente (solo campos de contenido; el dueño,
  // el contacto fijo y el estado no cambian desde acá).
  const updatePost = useCallback(
    async (post, draft) => {
      const { error: err } = await supabase
        .from("posts")
        .update({
          tipo: draft.tipo,
          categoria: draft.categoria,
          titulo: catInfo(draft.categoria).label,
          descripcion: draft.descripcion.trim() || null,
          pais: draft.pais.trim() || "Colombia",
          departamento: draft.departamento.trim() || draft.pais.trim() || "Colombia",
          municipio: draft.municipio.trim(),
          sector: draft.sector.trim() || null,
          urgente: draft.urgente,
          remoto: Boolean(draft.remoto),
          origen: draft.remoto ? (draft.origen || "").trim() || null : null,
        })
        .eq("id", post.id);
      if (err) throw err;
      setEditingPost(null);
      setToast("Cambios guardados.");
      await reload();
    },
    [reload]
  );

  // Borra una publicación propia sin vuelta atrás
  const deletePost = async (post) => {
    setActionError("");
    const { error: err } = await supabase.from("posts").delete().eq("id", post.id);
    if (err) setActionError(err.message);
    await reload(true);
    setConfirming(null);
  };

  // Las siguientes tres funciones llaman a las funciones (RPC) de la
  // base de datos que hacen los chequeos de permisos del lado del servidor.
  // Si el servidor rechaza la acción, se lo mostramos a la persona en vez
  // de fallar en silencio.
  const markHelping = async (post) => {
    setActionError("");
    const { error: err } = await supabase.rpc("mark_helping", { p_id: post.id });
    if (err) { setActionError(err.message); return; }
    setToast("Gracias por dar el paso. Coordina por WhatsApp o llamada para llevar la ayuda.");
    await reload(true);
  };

  const resolve = async (post) => {
    setActionError("");
    const { error: err } = await supabase.rpc("mark_resolved", { p_id: post.id });
    if (err) { setActionError(err.message); setConfirming(null); return; }
    setToast("Publicación resuelta. Gracias por cerrar el círculo.");
    await reload(true);
    setConfirming(null);
  };

  const releasePost = async (post) => {
    setActionError("");
    const { error: err } = await supabase.rpc("release_helper", { p_id: post.id });
    if (err) { setActionError(err.message); setConfirming(null); return; }
    setToast("Publicación liberada, vuelve a estar disponible para que alguien más ayude.");
    await reload(true);
    setConfirming(null);
  };

  const submitReport = async ({ motivo, detalle }) => {
    setActionError("");
    const { error: err } = await supabase.from("reports").insert({
      post_id: reporting.id,
      reporter_id: userId,
      motivo,
      detalle: detalle.trim() || null,
    });
    if (err) {
      setActionError(err.message);
      return;
    }
    setReporting(null);
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Sin variables de entorno, no tiene sentido mostrar nada más */}
      {!supabaseConfigured && (
        <div style={{ maxWidth: 480, margin: "60px auto", padding: "0 20px", textAlign: "center" }}>
          <AlertTriangle size={32} color="var(--rojo)" style={{ marginBottom: 12 }} />
          <h2 className="disp" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Falta configurar Supabase</h2>
          <p style={{ fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5 }}>
            No se encontraron <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code>.
            En Vercel: Settings → Environment Variables, agrégalas y vuelve a desplegar (Deployments → Redeploy).
            En local: copia <code>.env.example</code> a <code>.env</code> y complétalo.
          </p>
        </div>
      )}

      {authError && (
        <div style={{ background: "#FDECE5", color: "var(--rojo)", padding: "10px 16px", fontSize: 13, textAlign: "center" }}>
          {authError}
        </div>
      )}

      {actionError && (
        <div style={{ maxWidth: 720, margin: "12px auto 0", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#FDECE5", border: "1px solid var(--rojo)", borderRadius: 10, padding: "10px 12px" }}>
            <AlertTriangle size={16} color="var(--rojo)" style={{ flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: "var(--ink)", flex: 1 }}>{actionError}</span>
            <button onClick={() => setActionError("")} style={{ border: "none", background: "none", color: "var(--rojo)", fontWeight: 700 }}>✕</button>
          </div>
        </div>
      )}

      {olvidadas.length > 0 && view === "home" && (
        <div style={{ maxWidth: 720, margin: "12px auto 0", padding: "0 16px" }}>
          <button
            onClick={() => { setFilters({ ...EMPTY_FILTERS, mine: true }); setFeedTitle("¿Ya se resolvieron?"); setView("feed"); }}
            style={{
              width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 10,
              background: "#FFF6E8", border: "1px solid #E8590C", borderRadius: 10, padding: "10px 12px",
            }}
          >
            <AlertTriangle size={18} color="var(--naranja)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "var(--ink)" }}>
              Tienes {olvidadas.length} {olvidadas.length === 1 ? "publicación que lleva" : "publicaciones que llevan"} más de 2 días con ayuda en camino. ¿Ya se resolvió? Toca para revisar.
            </span>
          </button>
        </div>
      )}

      {view === "home" && (
        <HomeView
          counts={counts}
          onTipo={(t) => requirePhone(() => setFormTipo(t))}
          onVerTodo={() => goFeed("todo", "Todas las publicaciones")}
        />
      )}

      {view === "feed" && (
        <FeedView
          title={feedTitle}
          posts={posts}
          loading={loading}
          error={error}
          filters={filters}
          setFilters={setFilters}
          myId={userId}
          onBack={() => setView("home")}
          onRefresh={() => reload()}
          onMarkHelping={(post) => requirePhone(() => setConfirming({ post, action: "helping" }))}
          onResolve={(post) => setConfirming({ post, action: "resolve" })}
          onReport={(post) => setReporting(post)}
          onRelease={(post) => setConfirming({ post, action: "release" })}
          onEdit={(post) => setEditingPost(post)}
          onDelete={(post) => setConfirming({ post, action: "delete" })}
        />
      )}

      <button
        onClick={() => requirePhone(() => setFormTipo("necesito"))}
        aria-label="Publicar"
        style={{
          position: "fixed", bottom: 20, right: 20, width: 60, height: 60, borderRadius: 30,
          background: "var(--naranja)", border: "none", color: "#fff",
          boxShadow: "0 4px 14px rgba(232,89,12,0.4)", display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <Plus size={28} />
      </button>

      {(formTipo || editingPost) && (
        <PostForm
          initialTipo={formTipo}
          defaultContacto={telefono}
          editingPost={editingPost}
          onClose={() => { setFormTipo(null); setEditingPost(null); }}
          onSubmit={editingPost ? (draft) => updatePost(editingPost, draft) : createPost}
        />
      )}

      {phoneGateOpen && <PhoneGateModal userId={userId} onDone={handlePhoneDone} onClose={closePhoneGate} />}

      {confirming && (
        <ConfirmDialog
          title={
            confirming.action === "resolve" ? "¿Marcar como resuelto?" :
            confirming.action === "helping" ? "¿Vas a ayudar con esto?" :
            confirming.action === "delete" ? "¿Eliminar esta publicación?" :
            "¿Liberar este pedido?"
          }
          description={
            confirming.action === "resolve"
              ? "Se va a quitar de la lista principal. Esta acción no se puede deshacer."
              : confirming.action === "helping"
              ? "Los demás van a ver que ya alguien está en camino. Cuando la ayuda llegue, marca \"Resuelto\" (tú o quien publicó, cualquiera de los dos puede hacerlo)."
              : confirming.action === "delete"
              ? "Se borra por completo, no se puede recuperar. Si solo pusiste un dato mal, mejor usa \"Editar\" en vez de esto."
              : "Va a volver a estar disponible para que otra persona ayude. Úsalo si te equivocaste, ya no puedes ayudar, o la otra parte no te contactó."
          }
          onCancel={() => setConfirming(null)}
          onConfirm={() => {
            if (confirming.action === "resolve") resolve(confirming.post);
            else if (confirming.action === "helping") { markHelping(confirming.post); setConfirming(null); }
            else if (confirming.action === "delete") deletePost(confirming.post);
            else releasePost(confirming.post);
          }}
        />
      )}

      {reporting && <ReportDialog onCancel={() => setReporting(null)} onSubmit={submitReport} />}

      <Toast message={toast} />
    </div>
  );
}
