// Ilustraciones propias en línea (SVG), en la paleta de la marca:
// cacao, terracota, naranja, ocre, verde. Nada de negro puro ni
// esquinas rectas — pensadas para sentirse cálidas, no institucionales.

export function HeroDoodle() {
  return (
    <svg viewBox="0 0 320 120" width="100%" height="112" style={{ display: "block" }} aria-hidden="true">
      <g>
        <rect x="18" y="58" width="60" height="46" rx="10" fill="#FDF3E9" stroke="#C9A385" strokeWidth="2" />
        <path d="M10 58 L48 30 L86 58" fill="none" stroke="#D9A441" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="40" y="76" width="16" height="28" rx="4" fill="#C4573C" opacity="0.85" />
        <circle cx="66" cy="88" r="3" fill="#4C7A52" />
      </g>
      <g>
        <rect x="242" y="58" width="60" height="46" rx="10" fill="#FDF3E9" stroke="#C9A385" strokeWidth="2" />
        <path d="M234 58 L272 30 L310 58" fill="none" stroke="#4C7A52" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="264" y="76" width="16" height="28" rx="4" fill="#4C7A52" opacity="0.85" />
        <circle cx="290" cy="88" r="3" fill="#D9A441" />
      </g>
      <path d="M86 70 Q160 22 234 70" fill="none" stroke="#C4573C" strokeWidth="2.5" strokeDasharray="1 10" strokeLinecap="round" />
      <path d="M160 44c-6-10-22-10-22 2 0 10 22 24 22 24s22-14 22-24c0-12-16-12-22-2z" fill="#E8590C" />
      <circle cx="120" cy="26" r="10" fill="#FBEEE8" stroke="#C4573C" strokeWidth="1.5" />
      <path d="M120 21c3.5 3.5 4.5 6.5 4.5 8.5a4.5 4.5 0 1 1-9 0c0-2 1-5 4.5-8.5z" fill="#C4573C" />
      <circle cx="200" cy="24" r="10" fill="#F0F6F1" stroke="#4C7A52" strokeWidth="1.5" />
      <path d="M195 24h10M200 19v10" stroke="#4C7A52" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function TrustDoodle() {
  return (
    <svg viewBox="0 0 200 108" width="140" height="76" style={{ display: "block", margin: "0 auto" }} aria-hidden="true">
      <path d="M38 100c-7-19 2-36 21-36h48c15 0 26 11 28 25l4 11z" fill="#F0D9CE" stroke="#C9A385" strokeWidth="2" strokeLinejoin="round" />
      <rect x="69" y="22" width="48" height="72" rx="11" fill="#fff" stroke="#4A3328" strokeWidth="2.5" />
      <rect x="77" y="32" width="32" height="46" rx="5" fill="#FDF3E9" />
      <path d="M93 47c-3.5-5.5-12-5.5-12 1 0 5.5 12 13 12 13s12-7.5 12-13c0-6.5-8.5-6.5-12-1z" fill="#C4573C" />
      <circle cx="93" cy="87" r="3" fill="#D9A441" />
      <path d="M126 28c7-4 7-15 0-19" fill="none" stroke="#D9A441" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M134 32c11-8 11-27 0-35" fill="none" stroke="#D9A441" strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

export function EmptyDoodle() {
  return (
    <svg viewBox="0 0 160 108" width="120" height="81" style={{ display: "block", margin: "0 auto" }} aria-hidden="true">
      <path d="M30 60 L50 40 L110 40 L130 60 Z" fill="#FDF3E9" stroke="#C9A385" strokeWidth="2" strokeLinejoin="round" />
      <path d="M30 60 L34 96 L126 96 L130 60 Z" fill="#F0E3D0" stroke="#C9A385" strokeWidth="2" strokeLinejoin="round" />
      <path d="M80 18c-5.5-9-19-9-19 2 0 8.5 19 21 19 21s19-12.5 19-21c0-11-13.5-11-19-2z" fill="#E8590C" opacity="0.9" />
      <circle cx="46" cy="16" r="2.5" fill="#D9A441" />
      <circle cx="116" cy="12" r="2" fill="#4C7A52" />
      <circle cx="128" cy="25" r="2" fill="#C4573C" />
    </svg>
  );
}
