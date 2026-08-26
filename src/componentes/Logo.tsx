/**
 * Monograma AF.
 *
 * Las dos letras comparten el trazo: la pierna derecha de la A baja hasta el
 * pie del asta de la F, así que se lee como una sola marca y no como dos
 * letras pegadas.
 *
 * Al montarse se dibuja solo con stroke-dashoffset, escalonando los cuatro
 * trazos. Con `prefers-reduced-motion` aparece dibujado de una vez — el CSS
 * global ya reduce las duraciones a cero, así que aquí no hay que hacer nada.
 */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 32"
      className={`logo-af ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* A: las dos diagonales y el travesaño */}
      <path className="logo-trazo" style={{ '--retraso': '0ms' } as React.CSSProperties} d="M3 28 L13 4 L23 28" />
      <path className="logo-trazo" style={{ '--retraso': '120ms' } as React.CSSProperties} d="M7.6 20 L18.4 20" />

      {/* F: nace donde muere la A */}
      <g className="text-acento">
        <path className="logo-trazo" style={{ '--retraso': '240ms' } as React.CSSProperties} d="M23 28 L23 4 L36 4" />
        <path className="logo-trazo" style={{ '--retraso': '340ms' } as React.CSSProperties} d="M23 15.5 L32 15.5" />
      </g>
    </svg>
  )
}
