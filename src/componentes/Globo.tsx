import { useMemo } from 'react'

import { ORIGEN, type Ubicacion } from '../lib/distancia'
import { aTrazo, circuloMaximo, ortografica, puntoMedio, reticula } from '../lib/globo'

const TAMANO = 240
const CENTRO = TAMANO / 2
const RADIO = TAMANO / 2 - 14

/**
 * Globo con la retícula, Monterrey, el visitante y el arco entre los dos.
 * Todo se calcula al vuelo; no hay imagen de mapa ni datos de países.
 */
export function Globo({ visitante }: { visitante: Ubicacion | null }) {
  const { trazos, arco, origen, destino } = useMemo(() => {
    // Centramos el globo en el punto medio del arco para que los dos extremos
    // queden del lado visible. Sin esto, un visitante en Tokio cae en la cara
    // de atrás y no se ve.
    const centro = visitante
      ? puntoMedio(ORIGEN.lat, ORIGEN.lon, visitante.lat, visitante.lon)
      : { lat: ORIGEN.lat, lon: ORIGEN.lon }

    const proyectar = (lat: number, lon: number) =>
      ortografica(lat, lon, centro.lat, centro.lon)

    return {
      trazos: reticula().map((linea) =>
        aTrazo(
          linea.map((punto) => proyectar(punto.lat, punto.lon)),
          RADIO,
          CENTRO,
        ),
      ),
      arco: visitante
        ? aTrazo(
            circuloMaximo(ORIGEN.lat, ORIGEN.lon, visitante.lat, visitante.lon).map((p) =>
              proyectar(p.lat, p.lon),
            ),
            RADIO,
            CENTRO,
          )
        : '',
      origen: proyectar(ORIGEN.lat, ORIGEN.lon),
      destino: visitante ? proyectar(visitante.lat, visitante.lon) : null,
    }
  }, [visitante])

  const enPantalla = (p: { x: number; y: number }) => ({
    cx: CENTRO + p.x * RADIO,
    cy: CENTRO - p.y * RADIO,
  })

  return (
    <svg viewBox={`0 0 ${TAMANO} ${TAMANO}`} className="size-full" aria-hidden="true">
      <circle cx={CENTRO} cy={CENTRO} r={RADIO} className="fill-superficie-alta" />

      <g className="stroke-tenue/30" fill="none" strokeWidth="0.9">
        {trazos.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      <circle
        cx={CENTRO}
        cy={CENTRO}
        r={RADIO}
        fill="none"
        strokeWidth="1.2"
        className="stroke-tenue/50"
      />

      {arco && (
        <path
          d={arco}
          fill="none"
          strokeWidth="2"
          strokeDasharray="3 3"
          strokeLinecap="round"
          className="stroke-acento"
        />
      )}

      {origen.visible && (
        <g className="fill-acento">
          <circle {...enPantalla(origen)} r="4" />
          <circle {...enPantalla(origen)} r="9" className="fill-acento/20" />
        </g>
      )}

      {destino?.visible && (
        <g className="fill-violeta">
          <circle {...enPantalla(destino)} r="4" />
          <circle {...enPantalla(destino)} r="9" className="fill-violeta/20" />
        </g>
      )}
    </svg>
  )
}
