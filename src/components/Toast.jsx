export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed", left: "50%", transform: "translateX(-50%)", bottom: 92, zIndex: 40,
        background: "var(--ink)", color: "var(--bg)", padding: "12px 18px", borderRadius: 16,
        fontSize: 13.5, fontWeight: 600, boxShadow: "0 8px 20px rgba(74,51,40,0.35)",
        maxWidth: "88%", textAlign: "center", lineHeight: 1.4,
      }}
    >
      💛 {message}
    </div>
  );
}
