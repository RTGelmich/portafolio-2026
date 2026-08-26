import { Suspense, lazy } from 'react'

import type { ClaveWidget } from '../content/proyectos'

/**
 * Cada widget se carga solo cuando alguien abre su caso. Ninguno viaja en el
 * bundle de la portada.
 */
const widgets: Record<ClaveWidget, React.LazyExoticComponent<React.ComponentType>> = {
  qr: lazy(() => import('./gladiadores/AccesoQr')),
  redondeo: lazy(() => import('./gasera/Redondeo')),
  throughput: lazy(() => import('./azteca/Throughput')),
  paywall: lazy(() => import('./cipromex/Paywall')),
  chatbot: lazy(() => import('./express/ChatBot')),
  rls: lazy(() => import('./sandate/Rls')),
}

function Esqueleto() {
  return (
    <div
      className="h-96 animate-pulse rounded-2xl border border-borde bg-superficie"
      aria-hidden="true"
    />
  )
}

export function Widget({ clave }: { clave: ClaveWidget }) {
  const Componente = widgets[clave]

  return (
    <Suspense fallback={<Esqueleto />}>
      <Componente />
    </Suspense>
  )
}
