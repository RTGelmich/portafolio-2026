import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'

import { Encabezado } from './componentes/Encabezado'
import { PieDePagina } from './componentes/PieDePagina'
import { ui } from './content/ui'
import { useIdioma } from './i18n/idioma'
import { Inicio } from './rutas/Inicio'
import { NoEncontrado } from './rutas/NoEncontrado'

// La página de caso no se necesita hasta que alguien pica un proyecto. Tenerla
// en el bundle inicial costaba ~34 KiB de JavaScript que la portada nunca usa.
const CasoEstudio = lazy(() =>
  import('./rutas/CasoEstudio').then((m) => ({ default: m.CasoEstudio })),
)

// La página de recomendar la abre solo quien reciba el enlace de Angel: no
// tiene por qué pesar en la portada, que es la que ve todo el mundo.
const Recomendar = lazy(() =>
  import('./rutas/Recomendar').then((m) => ({ default: m.Recomendar })),
)

/**
 * Al navegar a otra ruta el scroll se queda donde estaba. Lo reiniciamos,
 * salvo cuando el usuario va a un ancla o usa atrás/adelante.
 */
function ReiniciarScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

export function App() {
  const { t } = useIdioma()

  // El grano vive en <body> vía clase para que cubra también el hero y el pie.
  useEffect(() => {
    document.body.classList.add('grano')
    return () => document.body.classList.remove('grano')
  }, [])

  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-acento focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-lienzo"
      >
        {t(ui.saltarAlContenido)}
      </a>

      <ReiniciarScroll />
      <Encabezado />

      <main id="contenido">
        {/* min-h evita que el pie salte hacia arriba mientras carga el chunk
            de la página de caso. */}
        <Suspense fallback={<div className="min-h-[70vh]" />}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/trabajo/:slug" element={<CasoEstudio />} />
            <Route path="/recomendar" element={<Recomendar />} />
            <Route path="*" element={<NoEncontrado />} />
          </Routes>
        </Suspense>
      </main>

      <PieDePagina />
    </>
  )
}
