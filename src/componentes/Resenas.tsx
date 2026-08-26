import { resenasAprobadas } from '../content/resenas'
import { ui } from '../content/ui'
import { useIdioma } from '../i18n/idioma'
import { Revelar } from './Revelar'

/** Iniciales para el avatar: nadie manda foto y pedirla es una fricción de más. */
function iniciales(nombre: string): string {
  return nombre
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() ?? '')
    .join('')
}

export function Resenas() {
  const { t, idioma } = useIdioma()

  // Sin recomendaciones aprobadas la sección no existe. Un apartado vacío que
  // dice "aquí irán las recomendaciones" es peor que no tenerlo.
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
                <figure className="flex h-full flex-col rounded-2xl border border-borde bg-superficie/60 p-6 sm:p-7">
                  <blockquote className="flex-1 text-pretty leading-relaxed text-tinta/90">
                    {resena.texto}
                  </blockquote>

                  <figcaption className="mt-6 flex items-center gap-3 border-t border-borde pt-5">
                    <span
                      aria-hidden="true"
                      className="grid size-10 shrink-0 place-items-center rounded-full border border-borde bg-superficie-alta font-mono text-xs text-tenue"
                    >
                      {iniciales(resena.nombre)}
                    </span>

                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-tinta">
                        {resena.linkedin ? (
                          <a
                            href={resena.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="underline-offset-2 hover:text-acento hover:underline"
                          >
                            {resena.nombre}
                          </a>
                        ) : (
                          resena.nombre
                        )}
                      </span>
                      <span className="block text-xs text-tenue">
                        {resena.puesto}
                        {resena.empresa ? ` · ${resena.empresa}` : ''}
                      </span>
                    </span>

                    {/* Solo se avisa cuando el testimonio está en otro idioma
                        del que se está leyendo: si coincide, el aviso sobra. */}
                    {resena.idioma !== idioma && (
                      <span className="ml-auto shrink-0 rounded border border-borde px-1.5 py-0.5 font-mono text-[10px] text-tenue">
                        {resena.idioma.toUpperCase()}
                      </span>
                    )}
                  </figcaption>
                </figure>
              </Revelar>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
