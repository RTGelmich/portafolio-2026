import { Link } from 'react-router'

import type { Proyecto } from '../content/proyectos'
import { ui } from '../content/ui'
import { useIdioma } from '../i18n/idioma'
import { Miniatura } from './Miniatura'
import { NumeroAnimado } from './NumeroAnimado'

export function TarjetaProyecto({ proyecto, indice }: { proyecto: Proyecto; indice: number }) {
  const { t } = useIdioma()

  // El resplandor sigue al cursor por variables CSS. Guardarlo en estado de
  // React haría un re-render por cada pixel de movimiento.
  function seguirPuntero(evento: React.PointerEvent<HTMLElement>) {
    const caja = evento.currentTarget.getBoundingClientRect()
    evento.currentTarget.style.setProperty('--puntero-x', `${evento.clientX - caja.left}px`)
    evento.currentTarget.style.setProperty('--puntero-y', `${evento.clientY - caja.top}px`)
  }

  return (
    <article
      onPointerMove={seguirPuntero}
      className="tarjeta-brillo group relative isolate flex w-full flex-col rounded-2xl border border-borde bg-superficie/60 p-6 transition-[border-color,transform] duration-300 ease-suave hover:-translate-y-0.5 hover:border-acento/50 sm:p-8"
    >
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <span className="eyebrow">{String(indice + 1).padStart(2, '0')}</span>
        <span className="eyebrow">{proyecto.periodo}</span>
      </div>

      <Miniatura clave={proyecto.widget} />

      <h3 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl">
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
              <span className="block font-mono text-lg text-acento">
                <NumeroAnimado valor={metrica.valor} />
              </span>
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
