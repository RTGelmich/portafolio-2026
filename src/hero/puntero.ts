/**
 * Estado del puntero compartido entre los manejadores del DOM y el bucle de
 * render de WebGL.
 *
 * Este módulo no importa three a propósito. El Hero lo usa, y el Hero se pinta
 * en el bundle principal: un solo import de three aquí arrastraría toda la
 * librería a la carga inicial y anularía el import() dinámico de CampoWebGL.
 * Por eso los puntos son objetos planos y no Vector2.
 *
 * Es un ref mutable y no estado de React porque el cursor cambia decenas de
 * veces por segundo y ninguno de esos cambios debe provocar un re-render.
 */
export type Punto = { x: number; y: number }

export type EstadoPuntero = {
  /** Posición en 0..1, con Y creciendo hacia arriba como en el shader. */
  cursor: Punto
  /** performance.now() del último movimiento; de ahí se deriva la fuerza. */
  ultimoMovimiento: number
  ondaOrigen: Punto
  /** performance.now() del clic, o -1 si no hay onda viva. */
  ondaInicio: number
}

export function crearEstadoPuntero(): EstadoPuntero {
  return {
    cursor: { x: 0.5, y: 0.5 },
    ultimoMovimiento: Number.NEGATIVE_INFINITY,
    ondaOrigen: { x: 0.5, y: 0.5 },
    ondaInicio: -1,
  }
}

/** Duración de la onda del clic, en segundos. */
export const DURACION_ONDA = 1.6

/** Segundos que tarda la fuerza del cursor en apagarse tras dejar de mover. */
export const DECAIMIENTO_CURSOR = 1.8
