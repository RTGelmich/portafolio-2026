import { useEffect, useRef, useState } from 'react'

import { useIdioma } from '../../i18n/idioma'
import { Marco } from '../Marco'

/**
 * "Miles de cuentas al día" es fácil de escribir y difícil de sentir.
 *
 * La cifra diaria y la curva son ilustrativas — no son datos del banco. Lo que
 * sí es real es la forma del problema: el volumen no llega parejo, llega en
 * picos, y el pico es donde se forma la fila en sucursal.
 */

const APERTURAS_POR_DIA = 4000
const HORA_APERTURA = 9
const HORA_CIERRE = 19

const velocidades = [
  { etiqueta: '1×', factor: 1 },
  { etiqueta: '600×', factor: 600 },
  { etiqueta: '3600×', factor: 3600 },
]

/** Peso relativo de cada hora: dos picos, media mañana y después de comer. */
function pesoHora(hora: number): number {
  if (hora < HORA_APERTURA || hora >= HORA_CIERRE) return 0
  const manana = Math.exp(-Math.pow((hora - 11.5) / 1.6, 2))
  const tarde = Math.exp(-Math.pow((hora - 16.5) / 1.9, 2))
  return manana + tarde * 0.85
}

const pesos = Array.from({ length: 24 }, (_, hora) => pesoHora(hora))
const pesoTotal = pesos.reduce((suma, peso) => suma + peso, 0)
const aperturasPorHora = pesos.map((peso) => (peso / pesoTotal) * APERTURAS_POR_DIA)

/** Aperturas acumuladas desde la apertura hasta un instante del día. */
function acumuladas(horaDecimal: number): number {
  let total = 0
  for (let hora = 0; hora < 24; hora++) {
    if (horaDecimal >= hora + 1) total += aperturasPorHora[hora]
    else if (horaDecimal > hora) total += aperturasPorHora[hora] * (horaDecimal - hora)
  }
  return total
}

export default function Throughput() {
  const { t, idioma } = useIdioma()
  const [factor, setFactor] = useState(600)
  const [corriendo, setCorriendo] = useState(true)
  const [horaDecimal, setHoraDecimal] = useState(HORA_APERTURA)
  const lienzo = useRef<HTMLCanvasElement>(null)
  const puntos = useRef<{ x: number; y: number; nacido: number }[]>([])

  const menosMovimiento =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Reloj simulado del día de sucursal.
  useEffect(() => {
    if (!corriendo || menosMovimiento) return

    let anterior = performance.now()
    let cuadro = 0

    const paso = (ahora: number) => {
      const delta = (ahora - anterior) / 1000
      anterior = ahora

      setHoraDecimal((actual) => {
        const siguiente = actual + (delta * factor) / 3600
        return siguiente >= HORA_CIERRE ? HORA_APERTURA : siguiente
      })

      cuadro = requestAnimationFrame(paso)
    }

    cuadro = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(cuadro)
  }, [corriendo, factor, menosMovimiento])

  const total = Math.floor(acumuladas(horaDecimal))

  // Dibujo: un punto por apertura, hasta un tope. Más allá de eso la mancha ya
  // no comunica nada nuevo y sí cuesta batería.
  useEffect(() => {
    const nodo = lienzo.current
    if (!nodo) return

    const contexto = nodo.getContext('2d')
    if (!contexto) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const ancho = nodo.clientWidth
    const alto = nodo.clientHeight
    nodo.width = ancho * dpr
    nodo.height = alto * dpr
    contexto.setTransform(dpr, 0, 0, dpr, 0, 0)
    contexto.clearRect(0, 0, ancho, alto)

    const objetivo = Math.min(total, 1200)
    while (puntos.current.length < objetivo) {
      puntos.current.push({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        nacido: puntos.current.length,
      })
    }
    if (puntos.current.length > objetivo) puntos.current.length = objetivo

    const estilos = getComputedStyle(document.documentElement)
    const acento = estilos.getPropertyValue('--color-acento').trim() || '#6f8cff'

    contexto.fillStyle = acento
    for (const punto of puntos.current) {
      const antiguedad = 1 - punto.nacido / Math.max(objetivo, 1)
      contexto.globalAlpha = 0.15 + antiguedad * 0.5
      contexto.beginPath()
      contexto.arc(punto.x, punto.y, 1.6, 0, Math.PI * 2)
      contexto.fill()
    }
    contexto.globalAlpha = 1
  }, [total])

  const horas = Math.floor(horaDecimal)
  const minutos = Math.floor((horaDecimal - horas) * 60)
  const reloj = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`
  const porHoraActual = Math.round(aperturasPorHora[horas] ?? 0)

  return (
    <Marco
      titulo={t({ en: 'branch day · simulated', es: 'día de sucursal · simulado' })}
      pie={t({
        en: 'Daily figure and curve are illustrative, not bank data. What is real is the shape: volume arrives in peaks, and the peak is where the queue forms.',
        es: 'La cifra diaria y la curva son ilustrativas, no son datos del banco. Lo real es la forma: el volumen llega en picos, y el pico es donde se hace la fila.',
      })}
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">{t({ en: 'Accounts opened today', es: 'Cuentas abiertas hoy' })}</p>
          <p className="mt-2 font-mono text-4xl tabular-nums text-tinta sm:text-5xl" aria-live="off">
            {new Intl.NumberFormat(idioma === 'es' ? 'es-MX' : 'en-US').format(total)}
          </p>
        </div>

        <div className="text-right">
          <p className="eyebrow">{t({ en: 'Branch clock', es: 'Reloj de sucursal' })}</p>
          <p className="mt-2 font-mono text-2xl tabular-nums text-acento">{reloj}</p>
          <p className="mt-1 text-xs text-tenue">
            {t({
              en: `~${porHoraActual}/hour right now`,
              es: `~${porHoraActual}/hora ahora mismo`,
            })}
          </p>
        </div>
      </div>

      <canvas
        ref={lienzo}
        className="mt-6 h-40 w-full rounded-xl border border-borde bg-lienzo"
        role="img"
        aria-label={t({
          en: `Scatter of ${total} dots, one per account opened so far today`,
          es: `Dispersión de ${total} puntos, uno por cada cuenta abierta hoy`,
        })}
      />

      {/* Perfil del día: aquí es donde se ve que el volumen no es parejo. */}
      <ul className="mt-4 flex h-16 items-end gap-1" aria-hidden="true">
        {aperturasPorHora.slice(HORA_APERTURA, HORA_CIERRE).map((cantidad, indice) => {
          const hora = HORA_APERTURA + indice
          const maximo = Math.max(...aperturasPorHora)
          const activa = hora === horas
          return (
            <li
              key={hora}
              className={`flex-1 rounded-t transition-colors duration-300 ${
                activa ? 'bg-acento' : 'bg-borde'
              }`}
              style={{ height: `${(cantidad / maximo) * 100}%` }}
            />
          )
        })}
      </ul>
      <p className="mt-1.5 flex justify-between font-mono text-[10px] text-tenue">
        <span>{HORA_APERTURA}:00</span>
        <span>{HORA_CIERRE}:00</span>
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-1">{t({ en: 'Speed', es: 'Velocidad' })}</span>
        {velocidades.map((velocidad) => (
          <button
            key={velocidad.etiqueta}
            type="button"
            onClick={() => setFactor(velocidad.factor)}
            aria-pressed={factor === velocidad.factor}
            className={`rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${
              factor === velocidad.factor
                ? 'border-acento bg-acento/12 text-tinta'
                : 'border-borde text-tenue hover:text-tinta'
            }`}
          >
            {velocidad.etiqueta}
          </button>
        ))}

        <button
          type="button"
          onClick={() => setCorriendo((actual) => !actual)}
          className="ml-auto rounded-full border border-borde px-4 py-1.5 text-xs text-tenue transition-colors hover:border-acento hover:text-tinta"
        >
          {corriendo ? t({ en: 'Pause', es: 'Pausar' }) : t({ en: 'Resume', es: 'Reanudar' })}
        </button>
      </div>

      {menosMovimiento && (
        <p className="mt-4 text-xs text-tenue">
          {t({
            en: 'Animation is off because you asked for reduced motion. The numbers above are a snapshot at opening time.',
            es: 'La animación está apagada porque pediste menos movimiento. Los números de arriba son una foto a la hora de apertura.',
          })}
        </p>
      )}
    </Marco>
  )
}
