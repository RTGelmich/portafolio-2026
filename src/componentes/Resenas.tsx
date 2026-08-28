import { useState } from 'react'

import { resenasAprobadas } from '../content/resenas'
import { ui } from '../content/ui'
import { useIdioma } from '../i18n/idioma'
import { Revelar } from './Revelar'
import { TarjetaResena } from './TarjetaResena'

/**
 * Cuántas se ven sin pedirlo. Siete tarjetas completas son un muro que empuja
 * el resto del sitio hacia abajo, y casi nadie lee más de dos: lo que convence
 * no es el volumen sino que la primera diga algo concreto.
 */
const DESTACADAS = 2

export function Resenas() {
  const { t } = useIdioma()
  const [expandido, setExpandido] = useState(false)

  // Sin recomendaciones aprobadas la sección no existe. Un apartado que diga
  // "Recomendaciones" con un hueco debajo le grita a quien contrata que nadie
  // ha querido escribir una.
  if (resenasAprobadas.length === 0) return null

  const visibles = expandido ? resenasAprobadas : resenasAprobadas.slice(0, DESTACADAS)
  const restantes = resenasAprobadas.length - DESTACADAS

  return (
    <section id="recomendaciones" className="scroll-mt-24 border-t border-borde py-20 sm:py-28">
      <div className="contenedor">
        <Revelar>
          <p className="eyebrow">{t(ui.resenasEyebrow)}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {t(ui.resenasTitulo)}
          </h2>
        </Revelar>

        <ul id="lista-recomendaciones" className="mt-12 grid gap-4 md:grid-cols-2">
          {visibles.map((resena, indice) => (
            <li key={resena.nombre + resena.fecha}>
              {/* Las que salen al expandir ya no se revelan con scroll: el
                  usuario acaba de pedirlas, tienen que estar ahí de inmediato. */}
              {indice < DESTACADAS ? (
                <Revelar retraso={(indice % 2) * 50} className="h-full">
                  <TarjetaResena resena={resena} />
                </Revelar>
              ) : (
                <TarjetaResena resena={resena} />
              )}
            </li>
          ))}
        </ul>

        {restantes > 0 && (
          <button
            type="button"
            onClick={() => setExpandido((actual) => !actual)}
            aria-expanded={expandido}
            aria-controls="lista-recomendaciones"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-borde px-6 text-sm text-tenue transition-colors hover:border-acento hover:text-tinta"
          >
            {expandido
              ? t(ui.resenasMenos)
              : t({ en: `Read ${restantes} more`, es: `Leer otras ${restantes}` })}
            <span
              aria-hidden="true"
              className={`transition-transform duration-300 ease-suave ${expandido ? 'rotate-180' : ''}`}
            >
              ↓
            </span>
          </button>
        )}
      </div>
    </section>
  )
}
