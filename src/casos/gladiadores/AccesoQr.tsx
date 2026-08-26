import { useState } from 'react'

import { useIdioma, type Bilingue } from '../../i18n/idioma'
import { Marco } from '../Marco'

/**
 * Reproduce la regla de acceso real de Gladiadores Playa: membresía vigente
 * más anti-passback de 5 minutos, que es lo que impide que un socio pase su
 * QR de regreso por encima del torniquete.
 *
 * El reloj es simulado — nadie va a esperar cinco minutos en un portafolio —
 * pero la regla es la misma.
 */

const VENTANA_ANTIPASSBACK_MIN = 5

type Socio = {
  id: string
  nombre: string
  plan: string
  diasParaVencer: number
}

const socios: Socio[] = [
  { id: 'a1c9', nombre: 'Ana Rivas', plan: 'Gladiador', diasParaVencer: 18 },
  { id: 'b4e2', nombre: 'Beto Cruz', plan: 'Legionario', diasParaVencer: -3 },
  { id: 'c7f5', nombre: 'Caro Mena', plan: 'Espartano', diasParaVencer: 1 },
]

type Veredicto = 'permitido' | 'vencida' | 'antipassback'

type Registro = {
  id: number
  socio: Socio
  veredicto: Veredicto
  minuto: number
  minutosRestantes?: number
}

const mensajes: Record<Veredicto, Bilingue> = {
  permitido: { en: 'Access granted', es: 'Acceso permitido' },
  vencida: { en: 'Membership expired', es: 'Membresía vencida' },
  antipassback: { en: 'Already scanned', es: 'Ya escaneó' },
}

export default function AccesoQr() {
  const { t } = useIdioma()

  // Reloj simulado en minutos desde que abrió la página.
  const [minuto, setMinuto] = useState(0)
  const [ultimoAcceso, setUltimoAcceso] = useState<Record<string, number>>({})
  const [bitacora, setBitacora] = useState<Registro[]>([])

  function escanear(socio: Socio) {
    let veredicto: Veredicto
    let minutosRestantes: number | undefined

    if (socio.diasParaVencer < 0) {
      veredicto = 'vencida'
    } else {
      const previo = ultimoAcceso[socio.id]
      const transcurrido = previo === undefined ? Infinity : minuto - previo

      if (transcurrido < VENTANA_ANTIPASSBACK_MIN) {
        veredicto = 'antipassback'
        minutosRestantes = VENTANA_ANTIPASSBACK_MIN - transcurrido
      } else {
        veredicto = 'permitido'
        setUltimoAcceso((actual) => ({ ...actual, [socio.id]: minuto }))
      }
    }

    setBitacora((actual) =>
      [{ id: Date.now(), socio, veredicto, minuto, minutosRestantes }, ...actual].slice(0, 6),
    )
  }

  const ultimo = bitacora[0]

  const estilos: Record<Veredicto, string> = {
    permitido: 'border-exito/40 bg-exito/10 text-exito',
    vencida: 'border-alerta/40 bg-alerta/10 text-alerta',
    antipassback: 'border-alerta/40 bg-alerta/10 text-alerta',
  }

  return (
    <Marco
      titulo="acceso.gladiadoresplaya.com.mx"
      pie={
        <>
          {t({
            en: `Anti-passback window: ${VENTANA_ANTIPASSBACK_MIN} minutes. Clock is simulated.`,
            es: `Ventana de anti-passback: ${VENTANA_ANTIPASSBACK_MIN} minutos. El reloj es simulado.`,
          })}
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="eyebrow">{t({ en: 'Scan a member', es: 'Escanea a un socio' })}</p>

          <ul className="mt-4 space-y-2">
            {socios.map((socio) => (
              <li key={socio.id}>
                <button
                  type="button"
                  onClick={() => escanear(socio)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-borde px-4 py-3 text-left transition-colors duration-200 hover:border-acento hover:bg-superficie-alta"
                >
                  <span>
                    <span className="block text-sm font-medium text-tinta">{socio.nombre}</span>
                    <span className="mt-0.5 block text-xs text-tenue">
                      {socio.plan} ·{' '}
                      {socio.diasParaVencer < 0
                        ? t({
                            en: `expired ${Math.abs(socio.diasParaVencer)}d ago`,
                            es: `venció hace ${Math.abs(socio.diasParaVencer)}d`,
                          })
                        : t({
                            en: `${socio.diasParaVencer}d left`,
                            es: `${socio.diasParaVencer}d restantes`,
                          })}
                    </span>
                  </span>
                  <span aria-hidden="true" className="font-mono text-[10px] text-tenue">
                    {socio.id.toUpperCase()}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-dashed border-borde px-4 py-3">
            <span className="font-mono text-xs text-tenue">
              {t({ en: 'clock', es: 'reloj' })} +{minuto}
              {t({ en: 'min', es: 'min' })}
            </span>
            <button
              type="button"
              onClick={() => setMinuto((actual) => actual + VENTANA_ANTIPASSBACK_MIN)}
              className="rounded-full border border-borde px-3 py-1.5 text-xs text-tenue transition-colors hover:border-acento hover:text-tinta"
            >
              {t({ en: 'Skip 5 minutes', es: 'Avanzar 5 minutos' })}
            </button>
          </div>
        </div>

        <div>
          <p className="eyebrow">{t({ en: 'Reader', es: 'Lector' })}</p>

          <div
            role="status"
            aria-live="polite"
            className={`mt-4 flex min-h-32 flex-col justify-center rounded-xl border px-5 py-5 transition-colors duration-300 ${
              ultimo ? estilos[ultimo.veredicto] : 'border-borde text-tenue'
            }`}
          >
            {ultimo ? (
              <>
                <p className="font-mono text-xs opacity-80">{ultimo.socio.nombre}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight">
                  {t(mensajes[ultimo.veredicto])}
                </p>
                {ultimo.veredicto === 'antipassback' && (
                  <p className="mt-1 text-sm opacity-90">
                    {t({
                      en: `Try again in ${ultimo.minutosRestantes} min`,
                      es: `Reintenta en ${ultimo.minutosRestantes} min`,
                    })}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm">
                {t({ en: 'Waiting for a scan…', es: 'Esperando un escaneo…' })}
              </p>
            )}
          </div>

          {bitacora.length > 0 && (
            <>
              <p className="eyebrow mt-6">{t({ en: 'Access log', es: 'Bitácora' })}</p>
              <ol className="mt-3 space-y-1.5 font-mono text-xs">
                {bitacora.map((registro) => (
                  <li key={registro.id} className="flex items-center gap-2 text-tenue">
                    <span className="opacity-60">+{registro.minuto}m</span>
                    <span className="text-tinta">{registro.socio.nombre}</span>
                    <span
                      className={
                        registro.veredicto === 'permitido' ? 'text-exito' : 'text-alerta'
                      }
                    >
                      {registro.veredicto === 'permitido' ? 'OK' : 'DENY'}
                    </span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>
    </Marco>
  )
}
