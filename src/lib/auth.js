import { supabase } from "./supabaseClient";

/**
 * Cada dispositivo recibe una sesión anónima estable de Supabase (sin
 * pedir registro, correo ni contraseña). Esto permite:
 *  - saber qué publicaciones son "mías" en este dispositivo,
 *  - que solo el autor pueda editar/resolver su propia publicación,
 * gracias a las políticas de seguridad (RLS) definidas en supabase/schema.sql.
 *
 * Requiere habilitar "Anonymous Sign-Ins" en
 * Supabase → Authentication → Providers.
 */
export async function ensureSession() {
  if (!supabase) {
    throw new Error("Supabase no está configurado (faltan las variables de entorno).");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) return session.user;

  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.error("No se pudo crear una sesión anónima:", error.message);
    throw error;
  }
  return data.user;
}
