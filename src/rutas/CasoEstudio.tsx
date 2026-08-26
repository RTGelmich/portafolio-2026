import { Link, useParams } from 'react-router'

import { Contacto } from '../componentes/Contacto'
import { contacto } from '../content/contacto'
import { proyectoPorSlug } from '../content/proyectos'
import { ui } from '../content/ui'
import { useMeta } from '../hooks/useMeta'
import { useIdioma } from '../i18n/idioma'
import { Widget } from '../casos/Widget'
import { NoEncontrado } from './NoEncontrado'

function IconoCandado() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export function CasoEstudio() {
  const { slug } = useParams()
  const { t } = useIdioma()
  const proyecto = proyectoPorSlug(slug)

  useMeta({
    titulo: proyecto ? `${t(proyecto.nombre)} — ${contacto.nombre}` : contacto.nombre,
    descripcion: proyecto ? t(proyecto.resumen) : '',
  })

  if (!proyecto) return <NoEncontrado />

  return (
    <>
      <article>
        <header className="border-b border-borde py-16 sm:py-20">
          <div className="contenedor">
            <p className="eyebrow">{proyecto.periodo}</p>

            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              {t(proyecto.nombre)}
            </h1>

            <p className="mt-3 text-tenue">{t(proyecto.cliente)}</p>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-pretty text-tinta/85">
              {t(proyecto.resumen)}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {proyecto.enlaceVivo && (
                <a
                  href={proyecto.enlaceVivo}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-acento px-5 text-sm font-medium text-lienzo transition-transform duration-200 hover:scale-[1.03]"
                >
                  {t(ui.verEnVivo)} <span aria-hidden="true">↗</span>
                </a>
              )}

              {proyecto.confidencial && (
                <p className="inline-flex items-center gap-2 rounded-full border border-borde px-4 py-2 text-xs text-tenue">
                  <IconoCandado />
                  {t({
                    en: 'Client work under confidentiality — approach and scale only, no internal detail.',
                    es: 'Trabajo bajo confidencialidad — solo enfoque y escala, sin detalle interno.',
                  })}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* El widget va arriba de la lectura larga: es la prueba, no el postre. */}
        <section id="demo" className="scroll-mt-20 border-b border-borde py-16 sm:py-20">
          <div className="contenedor">
            <p className="eyebrow">{t(ui.pruebalo)}</p>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {t(proyecto.widgetTitulo)}
            </h2>
            <p className="mt-3 max-w-xl text-pretty text-tenue">{t(proyecto.widgetBajada)}</p>

            <div className="mt-10">
              <Widget clave={proyecto.widget} />
            </div>
          </div>
        </section>

        <div className="contenedor grid gap-14 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-20">
          <div className="max-w-2xl">
            <section>
              <h2 className="eyebrow">{t(ui.elProblema)}</h2>
              <p className="mt-4 text-lg leading-relaxed text-pretty">{t(proyecto.problema)}</p>
            </section>

            <section className="mt-14">
              <h2 className="eyebrow">{t(ui.lasDecisiones)}</h2>
              <ol className="mt-6 space-y-8">
                {proyecto.decisiones.map((decision, indice) => (
                  <li key={t(decision.titulo)} className="border-l-2 border-borde pl-5">
                    <span className="eyebrow">{String(indice + 1).padStart(2, '0')}</span>
                    <h3 className="mt-1.5 text-lg font-medium text-balance">
                      {t(decision.titulo)}
                    </h3>
                    <p className="mt-2 leading-relaxed text-pretty text-tenue">
                      {t(decision.detalle)}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-14">
              <h2 className="eyebrow">{t(ui.elResultado)}</h2>
              <p className="mt-4 text-lg leading-relaxed text-pretty">{t(proyecto.resultado)}</p>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <h2 className="eyebrow">{t(ui.miRol)}</h2>
            <p className="mt-3 text-sm leading-relaxed text-tenue">{t(proyecto.rol)}</p>

            <h2 className="eyebrow mt-10">{t(ui.elStack)}</h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {proyecto.stack.map((herramienta) => (
                <li
                  key={herramienta}
                  className="rounded-md border border-borde px-2 py-0.5 font-mono text-[11px] text-tenue"
                >
                  {herramienta}
                </li>
              ))}
            </ul>

            <dl className="mt-10 space-y-5">
              {proyecto.metricas.map((metrica) => (
                <div key={metrica.valor + t(metrica.etiqueta)}>
                  <dt className="sr-only">{t(metrica.etiqueta)}</dt>
                  <dd>
                    <span className="block font-mono text-2xl text-acento">{metrica.valor}</span>
                    <span className="mt-1 block text-xs leading-snug text-tenue">
                      {t(metrica.etiqueta)}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>

            <Link
              to="/#trabajo"
              className="mt-10 inline-flex h-10 items-center rounded-full border border-borde px-5 text-sm text-tenue transition-colors hover:border-acento hover:text-tinta"
            >
              ← {t(ui.volver)}
            </Link>
          </aside>
        </div>
      </article>

      <Contacto />
    </>
  )
}
