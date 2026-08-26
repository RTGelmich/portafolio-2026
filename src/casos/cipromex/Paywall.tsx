import { useState } from 'react'

import { useIdioma, type Bilingue } from '../../i18n/idioma'
import { Marco } from '../Marco'

/**
 * El límite del plan gratis, tal como se aplica en producción: en el endpoint
 * que registra la respuesta, no en la interfaz. La UI solo pinta lo que el
 * servidor ya decidió — por eso aquí se muestra la respuesta HTTP.
 */

const LIMITE_GRATIS_DIARIO = 10

type Pregunta = {
  enunciado: Bilingue
  opciones: Bilingue[]
  correcta: number
}

const preguntas: Pregunta[] = [
  {
    enunciado: {
      en: 'Which organelle is responsible for cellular respiration?',
      es: '¿Qué organelo es responsable de la respiración celular?',
    },
    opciones: [
      { en: 'Ribosome', es: 'Ribosoma' },
      { en: 'Mitochondrion', es: 'Mitocondria' },
      { en: 'Golgi apparatus', es: 'Aparato de Golgi' },
      { en: 'Lysosome', es: 'Lisosoma' },
    ],
    correcta: 1,
  },
  {
    enunciado: {
      en: 'What is the oxidation number of oxygen in hydrogen peroxide?',
      es: '¿Cuál es el número de oxidación del oxígeno en el peróxido de hidrógeno?',
    },
    opciones: [
      { en: '−2', es: '−2' },
      { en: '−1', es: '−1' },
      { en: '0', es: '0' },
      { en: '+1', es: '+1' },
    ],
    correcta: 1,
  },
  {
    enunciado: {
      en: 'A body in uniform circular motion has constant…',
      es: 'Un cuerpo en movimiento circular uniforme tiene constante…',
    },
    opciones: [
      { en: 'Velocity', es: 'Velocidad vectorial' },
      { en: 'Speed', es: 'Rapidez' },
      { en: 'Acceleration', es: 'Aceleración' },
      { en: 'Momentum', es: 'Momento lineal' },
    ],
    correcta: 1,
  },
  {
    enunciado: {
      en: 'Which of these is a covalent bond?',
      es: '¿Cuál de estos es un enlace covalente?',
    },
    opciones: [
      { en: 'NaCl', es: 'NaCl' },
      { en: 'KBr', es: 'KBr' },
      { en: 'H₂O', es: 'H₂O' },
      { en: 'CaF₂', es: 'CaF₂' },
    ],
    correcta: 2,
  },
  {
    enunciado: {
      en: 'The derivative of sin(x) is…',
      es: 'La derivada de sen(x) es…',
    },
    opciones: [
      { en: 'cos(x)', es: 'cos(x)' },
      { en: '−cos(x)', es: '−cos(x)' },
      { en: 'tan(x)', es: 'tan(x)' },
      { en: '−sin(x)', es: '−sen(x)' },
    ],
    correcta: 0,
  },
]

const planes = [
  { nombre: 'LITE', precio: 1200 },
  { nombre: 'PRO', precio: 1700, destacado: true },
  { nombre: 'PREMIUM', precio: 2200 },
]

export default function Paywall() {
  const { t, idioma } = useIdioma()

  const [respondidas, setRespondidas] = useState(0)
  const [elegida, setElegida] = useState<number | null>(null)
  const [bloqueado, setBloqueado] = useState(false)
  const [plan, setPlan] = useState<'GRATIS' | 'PRO'>('GRATIS')

  const pregunta = preguntas[respondidas % preguntas.length]
  const restantes = Math.max(0, LIMITE_GRATIS_DIARIO - respondidas)

  function responder(indice: number) {
    if (bloqueado) return

    // Esto es lo que decide el servidor, no el botón.
    if (plan === 'GRATIS' && respondidas >= LIMITE_GRATIS_DIARIO) {
      setBloqueado(true)
      return
    }

    setElegida(indice)
    window.setTimeout(() => {
      setElegida(null)
      setRespondidas((actual) => actual + 1)
    }, 550)
  }

  function reiniciar() {
    setRespondidas(0)
    setElegida(null)
    setBloqueado(false)
  }

  const respuestaHttp = bloqueado
    ? '403 LIMITE_DIARIO'
    : elegida === null
      ? '— esperando'
      : '200 OK'

  return (
    <Marco
      titulo="POST /api/quiz/sesiones/:id/responder"
      pie={
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-mono">
            {t({ en: 'response', es: 'respuesta' })}:{' '}
            <span className={bloqueado ? 'text-alerta' : 'text-exito'}>{respuestaHttp}</span>
          </span>
          <span className="opacity-60">
            {t({
              en: 'The cap lives on the server. Editing the DOM does not buy questions.',
              es: 'El tope vive en el servidor. Editar el DOM no compra preguntas.',
            })}
          </span>
        </span>
      }
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(['GRATIS', 'PRO'] as const).map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => {
                setPlan(opcion)
                setBloqueado(false)
              }}
              aria-pressed={plan === opcion}
              className={`rounded-full border px-3 py-1.5 font-mono text-xs transition-colors ${
                plan === opcion
                  ? 'border-acento bg-acento/12 text-tinta'
                  : 'border-borde text-tenue hover:text-tinta'
              }`}
            >
              {opcion}
            </button>
          ))}
        </div>

        <p className="font-mono text-xs text-tenue" aria-live="polite">
          {plan === 'PRO'
            ? t({ en: 'unlimited', es: 'ilimitado' })
            : t({
                en: `${restantes} of ${LIMITE_GRATIS_DIARIO} left today`,
                es: `${restantes} de ${LIMITE_GRATIS_DIARIO} hoy`,
              })}
        </p>
      </div>

      {bloqueado ? (
        <div className="rounded-xl border border-alerta/40 bg-alerta/8 p-6 text-center">
          <p className="font-mono text-xs text-alerta">403 · LIMITE_DIARIO</p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">
            {t({
              en: "That's today's free questions.",
              es: 'Hasta aquí las preguntas gratis de hoy.',
            })}
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-tenue">
            {t({
              en: 'Come back tomorrow, or go unlimited.',
              es: 'Vuelve mañana, o pásate a ilimitado.',
            })}
          </p>

          <ul className="mt-6 grid gap-2 sm:grid-cols-3">
            {planes.map((opcion) => (
              <li
                key={opcion.nombre}
                className={`rounded-xl border px-4 py-4 ${
                  opcion.destacado ? 'border-acento bg-acento/8' : 'border-borde'
                }`}
              >
                <p className="font-mono text-xs text-tenue">{opcion.nombre}</p>
                <p className="mt-1 font-mono text-lg text-tinta">
                  {new Intl.NumberFormat(idioma === 'es' ? 'es-MX' : 'en-US', {
                    style: 'currency',
                    currency: 'MXN',
                    maximumFractionDigits: 0,
                  }).format(opcion.precio)}
                </p>
                <p className="mt-0.5 text-[11px] text-tenue">
                  {t({ en: 'per month', es: 'al mes' })}
                </p>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={reiniciar}
            className="mt-6 rounded-full border border-borde px-4 py-2 text-sm text-tenue transition-colors hover:border-acento hover:text-tinta"
          >
            {t({ en: 'Reset the demo', es: 'Reiniciar la demo' })}
          </button>
        </div>
      ) : (
        <div>
          <p className="eyebrow">
            {t({ en: 'Question', es: 'Pregunta' })} {respondidas + 1}
          </p>

          <h3 className="mt-3 text-lg font-medium text-balance">{t(pregunta.enunciado)}</h3>

          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {pregunta.opciones.map((opcion, indice) => {
              const esElegida = elegida === indice
              const esCorrecta = indice === pregunta.correcta
              const revelar = elegida !== null

              return (
                <li key={t(opcion)}>
                  <button
                    type="button"
                    onClick={() => responder(indice)}
                    disabled={revelar}
                    className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors duration-200 disabled:cursor-default ${
                      revelar && esCorrecta
                        ? 'border-exito/50 bg-exito/10 text-exito'
                        : revelar && esElegida
                          ? 'border-alerta/50 bg-alerta/10 text-alerta'
                          : 'border-borde text-tinta hover:border-acento hover:bg-superficie-alta'
                    }`}
                  >
                    {t(opcion)}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </Marco>
  )
}
