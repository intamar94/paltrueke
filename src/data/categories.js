export const CATEGORIAS = [
  { id: "agua", label: "Agua", emoji: "💧" },
  { id: "alimentos", label: "Alimentos", emoji: "🍚" },
  { id: "refugio", label: "Refugio", emoji: "🏠" },
  { id: "medicamentos", label: "Medicamentos", emoji: "💊" },
  { id: "bebes_ninos", label: "Bebés y niños", emoji: "👶" },
  { id: "adultos_mayores", label: "Adultos mayores", emoji: "👵" },
  { id: "animales", label: "Animales", emoji: "🐕" },
  { id: "ropa_abrigo", label: "Ropa y abrigo", emoji: "👕" },
  { id: "transporte", label: "Transporte", emoji: "🚗" },
  { id: "herramientas", label: "Herramientas", emoji: "🔧" },
  { id: "materiales_reconstruccion", label: "Materiales de reconstrucción", emoji: "🧱" },
  { id: "mano_de_obra", label: "Mano de obra", emoji: "👷" },
  { id: "comunicacion", label: "Comunicación", emoji: "📡" },
  { id: "donacion_sangre", label: "Donación de sangre", emoji: "🩸" },
  { id: "profesionales", label: "Profesionales", emoji: "🧑‍⚕️" },
  { id: "donaciones", label: "Donaciones", emoji: "📦" },
  { id: "personas_familias", label: "Personas / familias", emoji: "🔎" },
  { id: "informacion", label: "Información", emoji: "ℹ️" },
  { id: "otro", label: "Otro", emoji: "•" },
];

export const TIPOS = [
  { id: "necesito", label: "Necesito", color: "var(--rojo)" },
  { id: "ofrezco", label: "Ofrezco", color: "var(--verde)" },
  { id: "informo", label: "Informo", color: "var(--info)" },
];

export const MOTIVOS_REPORTE = [
  { id: "informacion_falsa", label: "Información falsa" },
  { id: "spam", label: "Spam" },
  { id: "contenido_ofensivo", label: "Contenido ofensivo" },
  { id: "estafa", label: "Estafa" },
  { id: "publicacion_peligrosa", label: "Publicación peligrosa" },
  { id: "otro", label: "Otro" },
];

export function catInfo(id) {
  return CATEGORIAS.find((c) => c.id === id) || CATEGORIAS[CATEGORIAS.length - 1];
}

export function tipoInfo(id) {
  return TIPOS.find((t) => t.id === id) || TIPOS[0];
}

// 🔴 urgente > 🟠 necesita > 🟢 ofrece > ⚪ informa
export function priorityRank(post) {
  if (post.urgente) return 0;
  if (post.tipo === "necesito") return 1;
  if (post.tipo === "ofrezco") return 2;
  return 3;
}

export function priorityColor(post) {
  if (post.urgente) return "var(--rojo)";
  if (post.tipo === "necesito") return "#E8590C";
  if (post.tipo === "ofrezco") return "var(--verde)";
  return "var(--info)";
}
