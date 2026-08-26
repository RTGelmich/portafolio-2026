import type { ClaveWidget } from '../content/proyectos'

/**
 * Un motivo por proyecto que insinúa su demo.
 *
 * A propósito NO son los widgets reales en chiquito: eso obligaría a cargar los
 * seis chunks en la portada. Son SVG y CSS puros, unos cientos de bytes cada
 * uno, animados en bucle lento. El CSS global los congela con
 * `prefers-reduced-motion`.
 */

function Qr() {
  // Rejilla pseudoaleatoria fija: si fuera random cambiaría en cada render.
  const celdas = [
    1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1,
    0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1,
    0, 1, 0, 1, 1, 0, 0, 0, 1,
  ]

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden">
      <div className="grid grid-cols-9 gap-[3px]">
        {Array.from({ length: 63 }, (_, i) => (
          <span
            key={i}
            className={`size-[7px] rounded-[1px] ${celdas[i] ? 'bg-tinta/70' : 'bg-tinta/10'}`}
          />
        ))}
      </div>
      <span className="mini-escaner absolute inset-x-6 h-px bg-acento shadow-[0_0_10px_2px_var(--color-acento)]" />
    </div>
  )
}

function Redondeo() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1.5 font-mono text-xs">
      <span className="text-tenue">
        1234.56<span className="text-tinta">5</span>
      </span>
      <div className="flex items-center gap-3">
        <span className="mini-sube rounded bg-alerta/15 px-2 py-0.5 text-alerta">1234.57</span>
        <span className="text-tenue">vs</span>
        <span className="mini-baja rounded bg-exito/15 px-2 py-0.5 text-exito">1234.56</span>
      </div>
      <span className="mini-parpadeo text-[10px] text-tenue">× 1000 recibos</span>
    </div>
  )
}

function Throughput() {
  return (
    <div className="relative h-full overflow-hidden">
      {[0, 1, 2, 3].map((fila) => (
        <span
          key={fila}
          className="mini-flujo absolute h-1 w-1 rounded-full bg-acento"
          style={{ top: `${22 + fila * 18}%`, animationDelay: `${fila * 0.55}s` }}
        />
      ))}
      <span className="absolute inset-y-0 right-5 w-px bg-borde" />
      <span className="absolute bottom-2 right-2 font-mono text-[10px] text-tenue">/día</span>
    </div>
  )
}

function Paywall() {
  return (
    <div className="flex h-full flex-col justify-center gap-2 px-6">
      <div className="flex justify-between font-mono text-[10px] text-tenue">
        <span>gratis</span>
        <span>10 / 10</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-tinta/10">
        <span className="mini-llenar block h-full rounded-full bg-acento" />
      </div>
      <span className="mini-parpadeo self-start rounded bg-alerta/15 px-1.5 py-0.5 font-mono text-[10px] text-alerta">
        403
      </span>
    </div>
  )
}

function Chat() {
  return (
    <div className="flex h-full flex-col justify-center gap-1.5 px-6">
      <span className="self-end rounded-xl rounded-br-sm bg-acento/15 px-2.5 py-1 text-[10px] text-tinta">
        ¿Cuánto cobran?
      </span>
      <span className="flex gap-1 self-start rounded-xl rounded-bl-sm bg-superficie-alta px-2.5 py-2">
        {[0, 1, 2].map((p) => (
          <span
            key={p}
            className="mini-punto size-1 rounded-full bg-tenue"
            style={{ animationDelay: `${p * 0.16}s` }}
          />
        ))}
      </span>
    </div>
  )
}

function Rls() {
  return (
    <div className="flex h-full flex-col justify-center gap-1 px-6 font-mono text-[10px]">
      <span className="text-tenue">select * from profiles;</span>
      {[0, 1, 2].map((fila) => (
        <span
          key={fila}
          className="mini-desvanecer flex justify-between text-tinta/70"
          style={{ animationDelay: `${fila * 0.2}s` }}
        >
          <span>••••</span>
          <span className="text-alerta">cliente</span>
        </span>
      ))}
      <span className="mini-aparecer text-exito">(0 rows)</span>
    </div>
  )
}

const motivos: Record<ClaveWidget, () => React.JSX.Element> = {
  qr: Qr,
  redondeo: Redondeo,
  throughput: Throughput,
  paywall: Paywall,
  chatbot: Chat,
  rls: Rls,
}

export function Miniatura({ clave }: { clave: ClaveWidget }) {
  const Motivo = motivos[clave]

  return (
    <div
      aria-hidden="true"
      className="mb-6 h-28 overflow-hidden rounded-xl border border-borde bg-lienzo/60"
    >
      <Motivo />
    </div>
  )
}
