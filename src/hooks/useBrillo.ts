import type { PointerEvent } from 'react'

/**
 * Resplandor que sigue al cursor dentro de una tarjeta.
 *
 * Devuelve el manejador que hay que colgarle a `onPointerMove`. La posición
 * viaja por variables CSS y no por estado de React: el cursor se mueve decenas
 * de veces por segundo y ninguno de esos movimientos debe provocar un render.
 *
 * El elemento tiene que llevar además las clases `tarjeta-brillo relative
 * isolate`, que son las que dibujan el degradado en su pseudo-elemento.
 */
export function useBrillo() {
  return function seguirPuntero(evento: PointerEvent<HTMLElement>) {
    const caja = evento.currentTarget.getBoundingClientRect()
    evento.currentTarget.style.setProperty('--puntero-x', `${evento.clientX - caja.left}px`)
    evento.currentTarget.style.setProperty('--puntero-y', `${evento.clientY - caja.top}px`)
  }
}
