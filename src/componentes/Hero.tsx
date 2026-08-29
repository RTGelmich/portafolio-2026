import { Suspense, lazy, useEffect, useRef, useState } from 'react'

import { contacto } from '../content/contacto'
import { ui } from '../content/ui'
import { crearEstadoPuntero } from '../hero/puntero'
import { useIdioma } from '../i18n/idioma'

// El shader y three viajan en su propio chunk: el texto del hero se pinta
// mucho antes de que WebGL termine de arrancar.
const CampoWebGL = lazy(() => import('../hero/CampoWebGL'))

/** Solo montamos WebGL si el navegador puede y si el usuario no pidió menos movimiento. */
function useCampoPermitido() {
  const [permitido, setPermitido] = useState(false)

  useEffect(() => {
    const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)')

    const evaluar = () => {
      if (menosMovimiento.matches) {
        setPermitido(false)
        return
      }
      try {
        const lienzo = document.createElement('canvas')
        setPermitido(Boolean(lienzo.getContext('webgl2') ?? lienzo.getContext('webgl')))
      } catch {
        setPermitido(false)
      }
    }

    evaluar()
    menosMovimiento.addEventListener('change', evaluar)
    return () => menosMovimiento.removeEventListener('change', evaluar)
  }, [])

  return permitido
}

export function Hero() {
  const { t, idioma } = useIdioma()
  const permitido = useCampoPermitido()
  const seccion = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(true)

  const puntero = useRef(crearEstadoPuntero())

  // Fuera de pantalla no hay nada que animar. Sin esto el shader sigue
  // consumiendo GPU mientras alguien lee los casos de estudio.
  useEffect(() => {
    const nodo = seccion.current
    if (!nodo) return

    const observador = new IntersectionObserver(
      ([entrada]) => setVisible(entrada.isIntersecting),
      { threshold: 0 },
    )
    observador.observe(nodo)
    return () => observador.disconnect()
  }, [])

  function aCoordenadas(evento: React.PointerEvent<HTMLElement>) {
    const caja = seccion.current?.getBoundingClientRect()
    if (!caja) return null
    return {
      x: (evento.clientX - caja.left) / caja.width,
      // El eje Y del shader crece hacia arriba; el del DOM hacia abajo.
      y: 1 - (evento.clientY - caja.top) / caja.height,
    }
  }

  return (
    <section
      ref={seccion}
      className="relative isolate flex min-h-[88svh] items-center overflow-hidden border-b border-borde"
      onPointerMove={(evento) => {
        const punto = aCoordenadas(evento)
        if (!punto) return
        puntero.current.cursor = punto
        puntero.current.ultimoMovimiento = performance.now()
      }}
      onPointerDown={(evento) => {
        const punto = aCoordenadas(evento)
        if (!punto) return
        puntero.current.ondaOrigen = punto
        puntero.current.ondaInicio = performance.now()
      }}
    >
      {/* Fondo. Con movimiento reducido o sin WebGL queda el degradado estático,
          que es un fondo perfectamente digno y no una disculpa. */}
      <div aria-hidden="true" className="campo-estatico absolute inset-0 -z-10">
        {permitido && (
          <Suspense fallback={null}>
            <CampoWebGL puntero={puntero} activo={visible} />
          </Suspense>
        )}
      </div>

      {/* Sin esto el texto pelea contra el ruido justo donde más importa. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-lienzo via-lienzo/70 to-transparent"
      />

      <div className="contenedor relative py-24">
        <p className="eyebrow">{t(ui.heroRol)}</p>

        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-6xl">
          {t(ui.heroTitulo)}
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-tenue">
          {t(ui.heroBajada)}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#trabajo"
            className="inline-flex h-11 items-center rounded-full bg-acento px-6 text-sm font-medium text-lienzo transition-transform duration-200 hover:scale-[1.03] active:scale-100"
          >
            {t(ui.heroVerTrabajo)}
          </a>

          {/* Quien lee el sitio en inglés descarga el CV en inglés. Mandarle
              un PDF en español a alguien que está leyendo en inglés es
              justamente el tipo de descuido que este sitio no debería tener. */}
          {contacto.cv[idioma] && (
            <a
              href={contacto.cv[idioma]}
              download
              className="inline-flex h-11 items-center rounded-full border border-borde px-6 text-sm text-tenue transition-colors hover:border-acento hover:text-tinta"
            >
              {t(ui.heroDescargarCv)}
            </a>
          )}
        </div>

        {permitido && (
          <p className="eyebrow mt-14 hidden sm:block">{t(ui.heroPista)}</p>
        )}
      </div>
    </section>
  )
}
