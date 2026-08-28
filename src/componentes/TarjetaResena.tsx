import type { Resena } from '../content/resenas'
import { useIdioma } from '../i18n/idioma'

/** Iniciales para el avatar: nadie manda foto y pedirla es una fricción de más. */
function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean).slice(0, 2)
  return partes.map((parte) => parte[0]?.toUpperCase() ?? '').join('') || '—'
}

/**
 * La misma tarjeta se usa en la sección pública y en la vista previa del
 * formulario: quien escribe una recomendación ve exactamente cómo va a
 * quedar mientras la escribe.
 *
 * Reacciona al cursor aclarando su borde, pero sin el acento azul, sin
 * levantarse y sin el resplandor que siguen las tarjetas de proyecto. Esa
 * diferencia es deliberada: aquí el azul y el levantón significan "esto se
 * puede picar", y una recomendación no lleva a ningún lado. Darle el mismo
 * tratamiento sería prometer un clic que no existe.
 */
export function TarjetaResena({ resena }: { resena: Resena }) {
  const { t, idioma } = useIdioma()

  return (
    <figure className="flex h-full flex-col rounded-2xl border border-borde bg-superficie/60 p-6 transition-colors duration-300 hover:border-tenue/60 hover:bg-superficie sm:p-7">
      {/* whitespace-pre-line respeta los saltos de línea de quien escribió:
          varios separaron sus ideas en renglones y sin esto se aplastan todos
          en un párrafo corrido. */}
      <blockquote className="flex-1 text-pretty leading-relaxed whitespace-pre-line text-tinta/90">
        {resena.texto || (
          <span className="text-tenue">
            {t({ en: 'The recommendation will appear here…', es: 'Aquí aparecerá la recomendación…' })}
          </span>
        )}
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
              resena.nombre || (
                <span className="text-tenue">{t({ en: 'Your name', es: 'Tu nombre' })}</span>
              )
            )}
          </span>
          <span className="block text-xs text-tenue">
            {resena.puesto || t({ en: 'Your role', es: 'Tu puesto' })}
            {resena.empresa ? ` · ${resena.empresa}` : ''}
          </span>
        </span>

        {/* Solo se avisa cuando el testimonio está en otro idioma del que se
            está leyendo: si coincide, el aviso sobra. */}
        {resena.idioma !== idioma && (
          <span className="ml-auto shrink-0 rounded border border-borde px-1.5 py-0.5 font-mono text-[10px] text-tenue">
            {resena.idioma.toUpperCase()}
          </span>
        )}
      </figcaption>
    </figure>
  )
}
