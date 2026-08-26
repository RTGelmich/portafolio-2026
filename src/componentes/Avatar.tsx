import { useEffect, useRef, useState } from 'react'

/**
 * Muñequito en SVG, todo calculado en código.
 *
 * El de Josh Comeau es un render 3D exportado como imagen; este se dibuja con
 * paths y se mueve solo. Los ojos siguen al cursor por toda la página,
 * parpadea cada tantos segundos y hace algo si le picas.
 *
 * Es decorativo: va `aria-hidden` y no es un control. Un botón que no lleva a
 * ningún lado solo estorba a quien navega por teclado.
 */

const DESPLAZAMIENTO_MAXIMO = 3.2

/** Cada cuánto parpadea, en milisegundos. */
const PARPADEO_MIN = 2800
const PARPADEO_MAX = 7000

export function Avatar({ className = '' }: { className?: string }) {
  const svg = useRef<SVGSVGElement>(null)
  const pupilas = useRef<SVGGElement>(null)
  const [parpadeando, setParpadeando] = useState(false)
  const [saludando, setSaludando] = useState(false)

  // Las pupilas se mueven escribiendo el transform directo. Meterlo en estado
  // de React sería un re-render por cada pixel que se mueve el mouse.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cuadro = 0
    let objetivoX = 0
    let objetivoY = 0
    let actualX = 0
    let actualY = 0

    function alMover(evento: PointerEvent) {
      const caja = svg.current?.getBoundingClientRect()
      if (!caja) return

      const dx = evento.clientX - (caja.left + caja.width / 2)
      const dy = evento.clientY - (caja.top + caja.height * 0.45)
      const distancia = Math.hypot(dx, dy) || 1

      // Normalizamos y luego limitamos: así el ojo apunta siempre al cursor,
      // esté a diez pixeles o al otro lado de la pantalla.
      const alcance = Math.min(distancia / 260, 1) * DESPLAZAMIENTO_MAXIMO
      objetivoX = (dx / distancia) * alcance
      objetivoY = (dy / distancia) * alcance
    }

    function seguir() {
      actualX += (objetivoX - actualX) * 0.16
      actualY += (objetivoY - actualY) * 0.16
      if (pupilas.current) {
        pupilas.current.style.transform = `translate(${actualX.toFixed(2)}px, ${actualY.toFixed(2)}px)`
      }
      cuadro = requestAnimationFrame(seguir)
    }

    window.addEventListener('pointermove', alMover, { passive: true })
    cuadro = requestAnimationFrame(seguir)

    return () => {
      window.removeEventListener('pointermove', alMover)
      cancelAnimationFrame(cuadro)
    }
  }, [])

  // Parpadeo a intervalos irregulares. Uno regular se nota y se siente robótico.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let temporizador = 0

    function programar() {
      const espera = PARPADEO_MIN + Math.random() * (PARPADEO_MAX - PARPADEO_MIN)
      temporizador = window.setTimeout(() => {
        setParpadeando(true)
        temporizador = window.setTimeout(() => {
          setParpadeando(false)
          programar()
        }, 130)
      }, espera)
    }

    programar()
    return () => window.clearTimeout(temporizador)
  }, [])

  function saludar() {
    setSaludando(true)
    window.setTimeout(() => setSaludando(false), 900)
  }

  return (
    <svg
      ref={svg}
      viewBox="0 0 120 120"
      className={`select-none ${saludando ? 'avatar-brinca' : ''} ${className}`}
      onPointerDown={saludar}
      aria-hidden="true"
    >
      {/* Diadema de audífonos, por detrás de la cabeza */}
      <path
        d="M30 60 A30 32 0 0 1 90 60"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        className="stroke-acento"
      />

      {/* Cabeza */}
      <ellipse cx="60" cy="64" rx="28" ry="31" className="fill-superficie-alta" />
      <ellipse
        cx="60"
        cy="64"
        rx="28"
        ry="31"
        fill="none"
        strokeWidth="1.5"
        className="stroke-borde"
      />

      {/* Pelo */}
      <path
        d="M32 58 C34 36 50 30 60 30 C70 30 86 36 88 58 C84 46 72 42 60 42 C48 42 36 46 32 58 Z"
        className="fill-tinta"
      />

      {/* Almohadillas de los audífonos */}
      <rect x="24" y="56" width="10" height="20" rx="5" className="fill-acento" />
      <rect x="86" y="56" width="10" height="20" rx="5" className="fill-acento" />

      {/* Cejas — suben al saludar */}
      <g
        className="stroke-tinta transition-transform duration-300 ease-suave"
        style={{ transform: saludando ? 'translateY(-3px)' : 'none' }}
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <path d="M44 54 L54 52" />
        <path d="M66 52 L76 54" />
      </g>

      {/* Ojos */}
      <g>
        <ellipse cx="49" cy="65" rx="7" ry={parpadeando ? 0.8 : 8} className="fill-lienzo" />
        <ellipse cx="71" cy="65" rx="7" ry={parpadeando ? 0.8 : 8} className="fill-lienzo" />

        {!parpadeando && (
          <g ref={pupilas} data-pupilas className="fill-tinta">
            <circle cx="49" cy="65" r="3.4" />
            <circle cx="71" cy="65" r="3.4" />
          </g>
        )}
      </g>

      {/* Boca: sonrisa de línea, se abre al saludar */}
      {saludando ? (
        <ellipse cx="60" cy="82" rx="6" ry="5" className="fill-tinta" />
      ) : (
        <path
          d="M52 81 Q60 87 68 81"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="stroke-tinta"
        />
      )}

      {/* Cachetes, solo al saludar */}
      {saludando && (
        <g className="fill-acento/30">
          <ellipse cx="39" cy="76" rx="5" ry="3.5" />
          <ellipse cx="81" cy="76" rx="5" ry="3.5" />
        </g>
      )}
    </svg>
  )
}
