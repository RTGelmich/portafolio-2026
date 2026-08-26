import { useEffect, useRef, useState } from 'react'

import { useIdioma, type Bilingue, type Idioma } from '../../i18n/idioma'
import { Marco } from '../Marco'

/**
 * El ruteo de FAQ que corre en producción, sin la llamada al modelo.
 *
 * La regla que importa no es el matching: es que precio y cualquier cosa
 * específica del caso se canalizan a un humano a propósito. Una respuesta
 * equivocada y segura sobre los ahorros de alguien cuesta más que una lenta.
 */

type Intencion = {
  id: string
  claves: Record<Idioma, string[]>
  respuesta: Bilingue
  canaliza?: boolean
}

const intenciones: Intencion[] = [
  {
    id: 'precio',
    claves: {
      es: ['cuanto cobran', 'cobran', 'costo', 'precio', 'comision', 'honorarios', 'cuanto sale'],
      en: ['how much', 'cost', 'price', 'fee', 'commission', 'charge'],
    },
    respuesta: {
      en: 'Fees depend on your case, so I will not guess. Let me put you through to an advisor who can go over the numbers with you.',
      es: 'Los honorarios dependen de tu caso, así que no te voy a adivinar un número. Te canalizo con un asesor para que te explique los costos.',
    },
    canaliza: true,
  },
  {
    id: 'pension',
    claves: {
      es: ['pension', 'pensionar', 'jubilacion', 'me afecta', 'afecta'],
      en: ['pension', 'retirement', 'affect', 'retire'],
    },
    respuesta: {
      en: 'No. Your pension comes from IMSS, not from INFONAVIT — they are separate. Using your housing savings does not touch it.',
      es: 'No. Tu pensión la da el IMSS, no el INFONAVIT — son cosas separadas. Usar tu ahorro de vivienda no la toca.',
    },
  },
  {
    id: 'mi-dinero',
    claves: {
      es: ['mi dinero', 'es mio', 'por que me cobran', 'si es mio'],
      en: ['my money', 'my own money', 'why pay', 'why charge'],
    },
    respuesta: {
      en: 'It is your money, but INFONAVIT will only release it as housing credit. What we do is get it to you as cash, without you taking on a mortgage.',
      es: 'Sí es tu dinero, pero el INFONAVIT solo lo libera como crédito de vivienda. Lo que hacemos es que te llegue en efectivo, sin que adquieras un crédito.',
    },
  },
  {
    id: 'al-pensionarme',
    claves: {
      es: ['cuando me pensione', 'me lo dan', 'al final', 'me lo entregan'],
      en: ['when i retire', 'get it later', 'paid out'],
    },
    respuesta: {
      en: 'No — that savings is earmarked for housing credit only. It does not get handed to you at retirement.',
      es: 'No — ese ahorro es solo para créditos de vivienda. No te lo entregan al pensionarte.',
    },
  },
  {
    id: 'tiempo',
    claves: {
      es: ['cuanto tarda', 'tiempo', 'demora', 'cuando', 'duracion'],
      en: ['how long', 'take', 'time', 'when', 'duration'],
    },
    respuesta: {
      en: 'About four months from start to finish.',
      es: 'Aproximadamente cuatro meses de principio a fin.',
    },
  },
  {
    id: 'oficinas',
    claves: {
      es: ['oficina', 'donde estan', 'direccion', 'ubicacion', 'sucursal'],
      en: ['office', 'where are you', 'address', 'location', 'branch'],
    },
    respuesta: {
      en: 'We are in Colonia Roma Norte, Mexico City.',
      es: 'Estamos en la Colonia Roma Norte, Ciudad de México.',
    },
  },
]

const sinCoincidencia: Bilingue = {
  en: 'I only cover the common questions. For anything specific to your case I will hand you to an advisor.',
  es: 'Yo solo cubro las preguntas frecuentes. Para algo específico de tu caso te canalizo con un asesor.',
}

const sugerencias: Bilingue[] = [
  { en: 'How much do you charge?', es: '¿Cuánto cobran?' },
  { en: 'Does this affect my pension?', es: '¿Afecta a mi pensión?' },
  { en: 'How long does it take?', es: '¿Cuánto tarda el trámite?' },
  { en: "Why pay if it's my money?", es: '¿Por qué me cobran si es mi dinero?' },
]

/** Sin acentos y en minúsculas: la gente escribe "pension" tan seguido como "pensión". */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

function rutear(texto: string, idioma: Idioma): Intencion | null {
  const limpio = normalizar(texto)
  if (!limpio) return null

  let mejor: { intencion: Intencion; puntaje: number } | null = null

  for (const intencion of intenciones) {
    // Buscamos en los dos idiomas: mucha gente escribe mezclado.
    const claves = [...intencion.claves[idioma], ...intencion.claves[idioma === 'es' ? 'en' : 'es']]

    for (const clave of claves) {
      if (!limpio.includes(clave)) continue
      // La coincidencia más larga gana: "mi dinero" antes que "dinero".
      if (!mejor || clave.length > mejor.puntaje) {
        mejor = { intencion, puntaje: clave.length }
      }
    }
  }

  return mejor?.intencion ?? null
}

type Mensaje = {
  id: number
  de: 'usuario' | 'bot'
  texto: string
  canaliza?: boolean
}

export default function ChatBot() {
  const { t, idioma } = useIdioma()
  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [borrador, setBorrador] = useState('')
  const [escribiendo, setEscribiendo] = useState(false)
  const hilo = useRef<HTMLDivElement>(null)
  const temporizador = useRef<number | undefined>(undefined)

  useEffect(() => {
    hilo.current?.scrollTo({ top: hilo.current.scrollHeight, behavior: 'smooth' })
  }, [mensajes, escribiendo])

  // Si alguien navega a otro caso a media respuesta, el timeout no debe
  // disparar sobre un componente desmontado.
  useEffect(() => () => window.clearTimeout(temporizador.current), [])

  function enviar(texto: string) {
    const limpio = texto.trim()
    if (!limpio || escribiendo) return

    setMensajes((actual) => [...actual, { id: Date.now(), de: 'usuario', texto: limpio }])
    setBorrador('')
    setEscribiendo(true)

    const intencion = rutear(limpio, idioma)

    temporizador.current = window.setTimeout(() => {
      setEscribiendo(false)
      setMensajes((actual) => [
        ...actual,
        {
          id: Date.now() + 1,
          de: 'bot',
          texto: t(intencion?.respuesta ?? sinCoincidencia),
          canaliza: intencion?.canaliza ?? !intencion,
        },
      ])
    }, 700)
  }

  return (
    <Marco
      titulo="webhook → faq → whatsapp"
      pie={t({
        en: 'Keyword routing runs before the model. Anything it cannot answer confidently goes to a human.',
        es: 'El ruteo por palabras clave corre antes del modelo. Lo que no puede contestar con seguridad se va a un humano.',
      })}
    >
      <div
        ref={hilo}
        className="h-72 space-y-3 overflow-y-auto rounded-xl border border-borde bg-lienzo p-4"
        role="log"
        aria-live="polite"
        aria-label={t({ en: 'Conversation', es: 'Conversación' })}
      >
        {mensajes.length === 0 && (
          <p className="pt-8 text-center text-sm text-tenue">
            {t({ en: 'Ask it something below.', es: 'Pregúntale algo abajo.' })}
          </p>
        )}

        {mensajes.map((mensaje) => (
          <div
            key={mensaje.id}
            className={`flex ${mensaje.de === 'usuario' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                mensaje.de === 'usuario'
                  ? 'rounded-br-sm bg-acento/15 text-tinta'
                  : 'rounded-bl-sm bg-superficie-alta text-tinta'
              }`}
            >
              {mensaje.texto}
              {mensaje.canaliza && (
                <span className="mt-2 block font-mono text-[11px] text-acento">
                  → {t({ en: 'handed off to advisor', es: 'canalizado con asesor' })}
                </span>
              )}
            </div>
          </div>
        ))}

        {escribiendo && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-sm bg-superficie-alta px-4 py-3">
              <span className="sr-only">{t({ en: 'Typing', es: 'Escribiendo' })}</span>
              <span aria-hidden="true" className="flex gap-1">
                {[0, 1, 2].map((punto) => (
                  <span
                    key={punto}
                    className="size-1.5 animate-bounce rounded-full bg-tenue"
                    style={{ animationDelay: `${punto * 120}ms` }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}
      </div>

      <ul className="mt-4 flex flex-wrap gap-2">
        {sugerencias.map((sugerencia) => (
          <li key={t(sugerencia)}>
            <button
              type="button"
              onClick={() => enviar(t(sugerencia))}
              className="rounded-full border border-borde px-3 py-1.5 text-xs text-tenue transition-colors hover:border-acento hover:text-tinta"
            >
              {t(sugerencia)}
            </button>
          </li>
        ))}
      </ul>

      <form
        className="mt-4 flex gap-2"
        onSubmit={(evento) => {
          evento.preventDefault()
          enviar(borrador)
        }}
      >
        <label className="flex-1">
          <span className="sr-only">{t({ en: 'Your message', es: 'Tu mensaje' })}</span>
          <input
            type="text"
            value={borrador}
            onChange={(evento) => setBorrador(evento.target.value)}
            placeholder={t({ en: 'Type a question…', es: 'Escribe una pregunta…' })}
            className="w-full rounded-full border border-borde bg-lienzo px-4 py-2.5 text-sm text-tinta transition-colors placeholder:text-tenue focus:border-acento focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-acento px-5 text-sm font-medium text-lienzo transition-transform duration-200 hover:scale-[1.03] disabled:opacity-40"
          disabled={!borrador.trim() || escribiendo}
        >
          {t({ en: 'Send', es: 'Enviar' })}
        </button>
      </form>
    </Marco>
  )
}
