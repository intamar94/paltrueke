import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

const REFRESH_MS = 20000; // actualización periódica razonable, sin saturar la base de datos

// Carga las publicaciones y las mantiene al día con un refresco periódico
export function usePosts() {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const firstLoad = useRef(true);

  const load = useCallback(async (silent) => {
    if (!supabase) {
      setPosts([]);
      setError("Falta configurar Supabase (variables de entorno). Esto lo resuelve quien desplegó la app.");
      setLoading(false);
      return;
    }
    if (!silent) setLoading(true);
    const { data, error: err } = await supabase
      .from("posts")
      .select("*")
      .order("urgente", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(300);

    if (err) {
      if (firstLoad.current) setPosts([]);
      setError("No se pudieron cargar las publicaciones. Revisa tu conexión y actualiza.");
    } else {
      setPosts(data || []);
      setError("");
    }
    firstLoad.current = false;
    setLoading(false);
  }, []);

  // Primera carga + refresco automático cada REFRESH_MS
  useEffect(() => {
    load();
    const id = setInterval(() => load(true), REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  return { posts, loading, error, reload: load };
}
