import { Link } from 'react-router'

import type { Proyecto } from '../content/proyectos'
import { ui } from '../content/ui'
import { useIdioma } from '../i18n/idioma'

export function TarjetaProyecto({ proyecto, indice }: { proyecto: Proyecto; indice: number }) {
  const { t } = useIdioma()

  return (
    <article className="group relative flex flex-col rounded-2xl border border-borde bg-superficie/60 p-6 transition-colors duration-300 hover:border-acento/50 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <span className="eyebrow">{String(indice + 1).padStart(2, '0')}</span>
        <span className="eyebrow">{proyecto.periodo}</span>
      </div>

      <h3 className="mt-4 text-xl font-semibold tracking-tight text-balance sm:text-2xl">
        {/* El enlace cubre toda la tarjeta, pero el nombre sigue siendo el destino accesible. */}
        <Link to={`/trabajo/${proyecto.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {t(proyecto.nombre)}
        </Link>
      </h3>

      <p className="mt-1 text-sm text-tenue">{t(proyecto.cliente)}</p>

      <p className="mt-4 text-pretty leading-relaxed text-tinta/85">{t(proyecto.resumen)}</p>

      {/* Rejilla fija y no flex-wrap: con 2 o 3 métricas las columnas siguen
          alineadas entre una tarjeta y la de al lado. */}
      <dl className="mt-6 grid grid-cols-3 gap-x-4 gap-y-3">
        {proyecto.metricas.map((metrica) => (
          <div key={metrica.valor + t(metrica.etiqueta)}>
            <dt className="sr-only">{t(metrica.etiqueta)}</dt>
            <dd>
              <span className="block font-mono text-lg text-acento">{metrica.valor}</span>
              <span className="mt-0.5 block text-xs leading-snug text-balance text-tenue">
                {t(metrica.etiqueta)}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <ul className="mt-6 flex flex-wrap gap-1.5" aria-label={t(ui.elStack)}>
        {proyecto.stack.slice(0, 6).map((herramienta) => (
          <li
            key={herramienta}
            className="rounded-md border border-borde px-2 py-0.5 font-mono text-[11px] text-tenue"
          >
            {herramienta}
          </li>
        ))}
      </ul>

      {/* mt-auto: el CTA queda pegado abajo, así todas las tarjetas de la fila
          lo muestran a la misma altura aunque el resumen sea más corto. */}
      <p className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-acento">
        {t(ui.verCaso)}
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      </p>
    </article>
  )
}
