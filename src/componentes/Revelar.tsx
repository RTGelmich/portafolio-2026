import type { ReactNode } from 'react'

import { useRevelar } from '../hooks/useRevelar'

/**
 * Envuelve contenido para que entre con un desplazamiento sutil al aparecer.
 * `retraso` escalona los hijos de una lista sin tener que escribir CSS por cada uno.
 */
export function Revelar({
  children,
  retraso = 0,
  className = '',
}: {
  children: ReactNode
  retraso?: number
  className?: string
}) {
  const { referencia, visible } = useRevelar()

  return (
    <div
      ref={referencia}
      className={`transition-[opacity,transform] duration-500 ease-suave ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      } ${className}`}
      style={{ transitionDelay: `${retraso}ms` }}
    >
      {children}
    </div>
  )
}
