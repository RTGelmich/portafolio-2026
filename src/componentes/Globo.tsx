import { useMemo } from 'react'

import { ORIGEN, type Ubicacion } from '../lib/distancia'
import { aTrazo, circuloMaximo, ortografica, puntoMedio, reticula } from '../lib/globo'
import { TIERRA } from '../lib/tierra'

const TAMANO = 240
const CENTRO = TAMANO / 2
const RADIO = TAMANO / 2 - 14

/**
 * Globo con la retícula, Monterrey, el visitante y el arco entre los dos.
 * Todo se calcula al vuelo; no hay imagen de mapa ni datos de países.
 */
export function Globo({ visitante }: { visitante: Ubicacion | null }) {
  const { tierra, trazos, arco, origen, destino } = useMemo(() => {
    // Centramos el globo en el punto medio del arco para que los dos extremos
    // queden del lado visible. Sin esto, un visitante en Tokio cae en la cara
    // de atrás y no se ve.
    const centro = visitante
      ? puntoMedio(ORIGEN.lat, ORIGEN.lon, visitante.lat, visitante.lon)
      : { lat: ORIGEN.lat, lon: ORIGEN.lon }

    const proyectar = (lat: number, lon: number) =>
      ortografica(lat, lon, centro.lat, centro.lon)

    return {
      // Los contornos van cerrados (Z) para poder rellenarlos. Un anillo que
      // cruza al lado oculto queda cortado por aTrazo, y cerrar cada tramo por
      // separado es justo lo que da el recorte contra el borde del globo.
      tierra: TIERRA.map((anillo) =>
        aTrazo(
          anillo.map((punto) => proyectar(punto.lat, punto.lon)),
          RADIO,
          CENTRO,
        ),
      ).filter(Boolean),

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

      {/* Continentes. Van debajo de la retícula para que los meridianos se
          lean encima de la tierra, como en un globo de verdad. */}
      <g data-tierra className="fill-tenue/25">
        {tierra.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      <g data-reticula className="stroke-tenue/25" fill="none" strokeWidth="0.9">
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
