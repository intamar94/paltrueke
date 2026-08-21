// Interpreta el campo "contacto" para ofrecer botones de Llamar / WhatsApp
// sin asumir que todos los números son internacionales.
// Celular colombiano típico: 10 dígitos empezando en 3 (ej: 3001234567).
export function parseContacto(raw) {
  const digits = (raw || "").replace(/\D/g, "");
  const isColombianMobile = digits.length === 10 && digits.startsWith("3");
  const isPhoneLike = digits.length >= 7;

  const telHref = isPhoneLike ? `tel:${isColombianMobile ? "+57" : ""}${digits}` : null;
  const waHref = isColombianMobile
    ? `https://wa.me/57${digits}`
    : isPhoneLike
    ? `https://wa.me/${digits}`
    : null;

  return { digits, isPhoneLike, isColombianMobile, telHref, waHref };
}
