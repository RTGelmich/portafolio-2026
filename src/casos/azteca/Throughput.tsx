import { useEffect, useRef, useState } from 'react'

import { useIdioma } from '../../i18n/idioma'
import { Marco } from '../Marco'

/**
 * "Miles de operaciones al día" es fácil de escribir y difícil de sentir.
 *
 * La cifra diaria, la curva y la tasa de fallo son ilustrativas — no son datos
 * del banco. Lo que sí es real es la forma del problema: el volumen no llega
 * parejo sino en picos, y a este volumen una llamada que falla una vez de cada
 * mil se cae decenas de veces al día. Por eso el reintento no es manejo de
 * errores, es parte del flujo.
 */

const OPERACIONES_POR_DIA = 4000

/** Fracción de operaciones que necesitan al menos un reintento. Ilustrativa. */
const TASA_REINTENTO = 0.018
const HORA_APERTURA = 9
const HORA_CIERRE = 19

/**
 * El reloj no arranca a la hora de apertura sino en pleno pico de la mañana.
 * Empezando en ceros, la demo tarda casi un minuto en tener números que digan
 * algo, y mientras tanto muestra "0 reintentos" justo debajo de un texto que
 * promete puntos rojos.
 */
const HORA_INICIAL = 11.4

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
const operacionesPorHora = pesos.map((peso) => (peso / pesoTotal) * OPERACIONES_POR_DIA)

/** Operaciones acumuladas desde la apertura hasta un instante del día. */
function acumuladas(horaDecimal: number): number {
  let total = 0
  for (let hora = 0; hora < 24; hora++) {
    if (horaDecimal >= hora + 1) total += operacionesPorHora[hora]
    else if (horaDecimal > hora) total += operacionesPorHora[hora] * (horaDecimal - hora)
  }
  return total
}

export default function Throughput() {
  const { t, idioma } = useIdioma()
  const [factor, setFactor] = useState(600)
  const [corriendo, setCorriendo] = useState(true)
  const [horaDecimal, setHoraDecimal] = useState(HORA_INICIAL)
  const lienzo = useRef<HTMLCanvasElement>(null)
  const puntos = useRef<{ x: number; y: number; nacido: number; reintento: boolean }[]>([])

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
  const reintentos = Math.floor(total * TASA_REINTENTO)

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
        reintento: Math.random() < TASA_REINTENTO,
      })
    }
    if (puntos.current.length > objetivo) puntos.current.length = objetivo

    const estilos = getComputedStyle(document.documentElement)
    const acento = estilos.getPropertyValue('--color-acento').trim() || '#6f8cff'
    const alerta = estilos.getPropertyValue('--color-alerta').trim() || '#e5484d'

    for (const punto of puntos.current) {
      const antiguedad = 1 - punto.nacido / Math.max(objetivo, 1)

      // Los reintentos recientes se pintan en rojo y luego se apagan hacia el
      // acento: es la operación fallando y recuperándose, no fallando y ya.
      const reciente = punto.reintento && punto.nacido > objetivo - 60

      contexto.fillStyle = reciente ? alerta : acento
      contexto.globalAlpha = reciente ? 0.95 : 0.15 + antiguedad * 0.5
      contexto.beginPath()
      contexto.arc(punto.x, punto.y, reciente ? 2.6 : 1.6, 0, Math.PI * 2)
      contexto.fill()

      if (reciente) {
        contexto.globalAlpha = 0.35
        contexto.strokeStyle = alerta
        contexto.lineWidth = 1
        contexto.beginPath()
        contexto.arc(punto.x, punto.y, 5.5, 0, Math.PI * 2)
        contexto.stroke()
      }
    }
    contexto.globalAlpha = 1
  }, [total])

  const horas = Math.floor(horaDecimal)
  const minutos = Math.floor((horaDecimal - horas) * 60)
  const reloj = `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`
  const porHoraActual = Math.round(operacionesPorHora[horas] ?? 0)

  return (
    <Marco
      titulo={t({ en: 'branch day · simulated', es: 'día de sucursal · simulado' })}
      pie={t({
        en: 'Figures and failure rate are illustrative, not bank data. What is real is the shape: volume arrives in peaks, and at this volume retries stop being error handling and become part of the flow.',
        es: 'Las cifras y la tasa de fallo son ilustrativas, no son datos del banco. Lo real es la forma: el volumen llega en picos, y a este volumen el reintento deja de ser manejo de errores y pasa a ser parte del flujo.',
      })}
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">{t({ en: 'Operations today', es: 'Operaciones hoy' })}</p>
          <p className="mt-2 font-mono text-4xl tabular-nums text-tinta sm:text-5xl" aria-live="off">
            {new Intl.NumberFormat(idioma === 'es' ? 'es-MX' : 'en-US').format(total)}
          </p>
          <p className="mt-2 text-xs text-tenue">
            <span className="text-alerta">
              {new Intl.NumberFormat(idioma === 'es' ? 'es-MX' : 'en-US').format(reintentos)}
            </span>{' '}
            {t({ en: 'needed a retry', es: 'necesitaron reintento' })} ·{' '}
            <span className="text-exito">0</span>{' '}
            {t({ en: 'sent back to step one', es: 'devueltas al paso uno' })}
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
          en: `Scatter of ${total} dots, one per operation so far today; ${reintentos} of them, marked in red, needed a retry`,
          es: `Dispersión de ${total} puntos, uno por operación del día; ${reintentos} de ellos, marcados en rojo, necesitaron reintento`,
        })}
      />

      {/* Perfil del día: aquí es donde se ve que el volumen no es parejo. */}
      <ul className="mt-4 flex h-16 items-end gap-1" aria-hidden="true">
        {operacionesPorHora.slice(HORA_APERTURA, HORA_CIERRE).map((cantidad, indice) => {
          const hora = HORA_APERTURA + indice
          const maximo = Math.max(...operacionesPorHora)
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
