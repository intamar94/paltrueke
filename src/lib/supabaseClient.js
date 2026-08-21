import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!supabaseConfigured) {
  // Esto solo debería pasar si falta configurar el archivo .env (local)
  // o las Environment Variables en Vercel (producción).
  console.error(
    "Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. Revisa tu archivo .env (ver .env.example) o, en Vercel, Settings → Environment Variables."
  );
}

export const supabase = supabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
