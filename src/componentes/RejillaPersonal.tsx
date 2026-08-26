import { Suspense, lazy, useEffect, useMemo, useState, type ReactNode } from 'react'

import { esteSitio, personal } from '../content/personal'
import { ui } from '../content/ui'
import { useIdioma } from '../i18n/idioma'
import { ubicacionDelVisitante } from '../lib/distancia'
import { Avatar } from './Avatar'
import { Revelar } from './Revelar'

// Los contornos de tierra son ~9 kB comprimidos y el globo vive debajo del
// pliegue: no tienen por qué estar en el bundle de la portada.
const Globo = lazy(() => import('./Globo').then((m) => ({ default: m.Globo })))

function Tarjeta({
  children,
  className = '',
  retraso = 0,
}: {
  children: ReactNode
  className?: string
  retraso?: number
}) {
  return (
    <Revelar retraso={retraso} className={className}>
      <div className="flex h-full flex-col justify-center rounded-2xl border border-borde bg-superficie/60 p-5 text-center">
        {children}
      </div>
    </Revelar>
  )
}

/** Hora en la ciudad de Angel, se actualice quien se actualice el reloj de quien mira. */
function useHoraLocal() {
  const [ahora, setAhora] = useState(() => new Date())

  useEffect(() => {
    // Al minuto, no al segundo: un reloj con segundos obliga a repintar 60
    // veces más seguido a cambio de nada que nadie esté mirando.
    const id = window.setInterval(() => setAhora(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  return ahora
}

export function RejillaPersonal() {
  const { t, idioma } = useIdioma()
  const ahora = useHoraLocal()

  // La zona horaria no cambia a media visita: se calcula una sola vez.
  const visitante = useMemo(() => ubicacionDelVisitante(), [])

  const locale = idioma === 'es' ? 'es-MX' : 'en-US'

  const hora = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: personal.zonaHoraria,
  }).format(ahora)

  const horaNumero = Number(
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: personal.zonaHoraria,
    }).format(ahora),
  )

  const queHaceAhora =
    horaNumero >= 1 && horaNumero < 8
      ? { en: 'Almost certainly asleep.', es: 'Casi seguro dormido.' }
      : horaNumero >= 8 && horaNumero < 19
        ? { en: 'Probably at a keyboard.', es: 'Probablemente frente al teclado.' }
        : { en: 'Probably still at a keyboard.', es: 'Probablemente todavía frente al teclado.' }

  return (
    <section id="sobre-mi" className="scroll-mt-24 border-t border-borde py-20 sm:py-28">
      <div className="contenedor">
        <Revelar>
          <p className="eyebrow">{t(ui.navSobreMi)}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {t(ui.sobreMiTitulo)}
          </h2>
        </Revelar>

        <div className="mt-12 grid auto-rows-[minmax(11rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* El globo: la tarjeta grande y la única que sabe algo de quien mira. */}
          <Tarjeta className="sm:col-span-2 sm:row-span-2">
            <div className="mx-auto aspect-square w-full max-w-56">
              {/* aspect-square reserva el hueco: sin él, el globo empuja el
                  texto al terminar de cargar y cuenta como layout shift. */}
              <Suspense fallback={null}>
                <Globo visitante={visitante} />
              </Suspense>
            </div>

            <p className="mt-4 text-pretty text-sm leading-relaxed text-tinta/85">
              {/* Tres casos: no reconocemos la zona, resulta ser la misma
                  ciudad, o hay una distancia que decir. Sin el caso de en medio
                  la tarjeta saluda con "a unos 0 km de ti", que se lee a bug. */}
              {!visitante ? (
                t({
                  en: `I'm in ${personal.ciudad}, ${personal.pais}.`,
                  es: `Estoy en ${personal.ciudad}, ${personal.pais}.`,
                })
              ) : visitante.km < 50 ? (
                t({
                  en: `I'm in ${personal.ciudad} — and so are you, by the looks of it.`,
                  es: `Estoy en ${personal.ciudad} — y tú también, por lo que se ve.`,
                })
              ) : (
                <>
                  {t({
                    en: `I'm in ${personal.ciudad}, ${personal.pais} — about `,
                    es: `Estoy en ${personal.ciudad}, ${personal.pais} — a unos `,
                  })}
                  <span className="font-mono text-acento">
                    {new Intl.NumberFormat(locale).format(visitante.km)} km
                  </span>
                  {t({ en: ' from you.', es: ' de ti.' })}
                </>
              )}
            </p>

            {visitante && (
              <p className="mt-2 text-xs text-tenue">
                {t({
                  en: `Worked out from your time zone (${visitante.zona}), not your IP. Nothing left this page.`,
                  es: `Calculado con tu zona horaria (${visitante.zona}), no con tu IP. Nada salió de esta página.`,
                })}
              </p>
            )}
          </Tarjeta>

          {/* Reloj */}
          <Tarjeta retraso={60}>
            <p className="eyebrow">{t({ en: 'Right now there', es: 'Allá son las' })}</p>
            <p className="mt-2 font-mono text-3xl tabular-nums text-tinta">{hora}</p>
            <p className="mt-2 text-xs text-tenue">{t(queHaceAhora)}</p>
          </Tarjeta>

          {/* Muñequito */}
          <Tarjeta retraso={120}>
            <div className="mx-auto w-24 cursor-pointer">
              <Avatar />
            </div>
            <p className="mt-2 text-xs text-tenue">
              {t({ en: 'Poke him. He follows your cursor.', es: 'Pícale. Te sigue con la mirada.' })}
            </p>
          </Tarjeta>

          {/* Teclas del stack */}
          <Tarjeta retraso={180}>
            <div className="flex justify-center gap-1.5">
              {personal.teclas.map((tecla) => (
                <span
                  key={tecla}
                  className="grid size-8 place-items-center rounded-md border border-borde bg-superficie-alta font-mono text-xs text-tinta shadow-[0_2px_0_var(--color-borde)]"
                >
                  {tecla}
                </span>
              ))}
            </div>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-tinta/85">
              {t({
                en: 'React and TypeScript are home. The rest I pick per problem.',
                es: 'React y TypeScript son mi casa. Lo demás lo escojo según el problema.',
              })}
            </p>
          </Tarjeta>

          {/* Este mismo sitio */}
          <Tarjeta retraso={240}>
            <p className="font-mono text-3xl text-acento">{esteSitio.lighthouse}</p>
            <p className="mt-1 text-xs text-tenue">
              {t({
                en: 'Lighthouse, all four categories, on this page.',
                es: 'Lighthouse, las cuatro categorías, en esta página.',
              })}
            </p>
            <p className="mt-3 font-mono text-xs text-tenue">
              {esteSitio.jsInicial} JS · {esteSitio.pruebas}{' '}
              {t({ en: 'e2e tests', es: 'pruebas e2e' })}
            </p>
          </Tarjeta>

          {/* Trayectoria */}
          <Tarjeta className="lg:col-span-2" retraso={280}>
            <ol className="space-y-1.5 text-left">
              {personal.trayectoria.map((paso) => (
                <li
                  key={paso.empresa}
                  className="flex items-baseline justify-between gap-3 border-b border-borde/60 pb-1.5 last:border-0"
                >
                  <span className="text-sm text-tinta">{paso.empresa}</span>
                  <span className="shrink-0 font-mono text-[11px] text-tenue">
                    {paso.desde}
                    {paso.hasta === null
                      ? ` — ${t({ en: 'now', es: 'hoy' })}`
                      : paso.hasta === paso.desde
                        ? ''
                        : ` — ${paso.hasta}`}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-left text-xs text-tenue">
              {t(personal.formacion.titulo)} · {personal.formacion.escuela}
            </p>
          </Tarjeta>

          {/* Idiomas */}
          <Tarjeta className="lg:col-span-2" retraso={300}>
            <p className="font-mono text-2xl text-tinta">ES · EN</p>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-tinta/85">
              {t({
                en: 'Spanish is native. This whole site is written in both — switch it up top.',
                es: 'Español nativo. Todo este sitio está escrito en los dos — cámbialo arriba.',
              })}
            </p>
          </Tarjeta>

          {/* Qué tipo de problema le gusta: cierra el renglón y además es lo
              que un reclutador quiere saber. */}
          <Tarjeta className="lg:col-span-2" retraso={360}>
            <p className="text-pretty leading-relaxed text-tinta/85">
              {t({
                en: 'The work I like: systems where someone\'s money, access or records are on the line. That is where the details stop being details.',
                es: 'El trabajo que me gusta: sistemas donde está en juego el dinero, el acceso o los datos de alguien. Ahí es donde los detalles dejan de ser detalles.',
              })}
            </p>
          </Tarjeta>

          {/* Estatura — apagada hasta que Angel dé el dato */}
          {personal.estatura.activa && (
            <Tarjeta retraso={360}>
              <svg viewBox="0 0 40 60" className="mx-auto h-20" aria-hidden="true">
                <g fill="none" strokeWidth="2" strokeLinecap="round" className="stroke-tinta">
                  <circle cx="20" cy="12" r="9" />
                  <path d="M20 21 L20 44 M20 32 L9 26 M20 32 L31 26 M20 44 L11 58 M20 44 L29 58" />
                </g>
              </svg>
              <p className="mt-2 font-mono text-lg text-tinta">{personal.estatura.cm} cm</p>
              <p className="mt-1 text-xs text-tenue">{t(personal.estatura.remate)}</p>
            </Tarjeta>
          )}

          {/* Tarot — apagada hasta que Angel confirme con su mamá */}
          {personal.tarot.activa && (
            <Tarjeta className="sm:col-span-2" retraso={420}>
              <p className="text-pretty text-sm leading-relaxed text-tinta/85">
                {t(personal.tarot.texto)}
              </p>
            </Tarjeta>
          )}

          {/* Gustos — apagada hasta que Angel los mande */}
          {personal.gustos.activa &&
            personal.gustos.items.map((gusto, indice) => (
              <Tarjeta key={t(gusto)} retraso={480 + indice * 60}>
                <p className="text-pretty text-sm leading-relaxed text-tinta/85">{t(gusto)}</p>
              </Tarjeta>
            ))}
        </div>
      </div>
    </section>
  )
}
