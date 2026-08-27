import { resenasAprobadas } from '../content/resenas'
import { ui } from '../content/ui'
import { useIdioma } from '../i18n/idioma'
import { Revelar } from './Revelar'
import { TarjetaResena } from './TarjetaResena'

export function Resenas() {
  const { t } = useIdioma()

  // Sin recomendaciones aprobadas la sección no existe. Un apartado que diga
  // "Recomendaciones" con un hueco debajo le grita a quien contrata que nadie
  // ha querido escribir una.
  if (resenasAprobadas.length === 0) return null

  return (
    <section id="recomendaciones" className="scroll-mt-24 border-t border-borde py-20 sm:py-28">
      <div className="contenedor">
        <Revelar>
          <p className="eyebrow">{t(ui.resenasEyebrow)}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {t(ui.resenasTitulo)}
          </h2>
        </Revelar>

        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {resenasAprobadas.map((resena, indice) => (
            <li key={resena.nombre + resena.fecha}>
              <Revelar retraso={(indice % 2) * 90} className="h-full">
                <TarjetaResena resena={resena} />
              </Revelar>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
