/**
 * Lo mínimo de cartografía para dibujar un globo en SVG.
 *
 * No hay imagen de mapa ni datos de países: un globo con su retícula, dos
 * puntos y el arco entre ellos. Pesa unos cientos de bytes y, a diferencia de
 * un mapa plano con dos chinchetas, la línea que dibuja es la distancia real
 * — un círculo máximo, que es por donde de verdad se mide.
 */

const GRADOS = Math.PI / 180

export type Punto2D = { x: number; y: number; visible: boolean }

/**
 * Proyección ortográfica: el globo como se ve desde muy lejos, centrado en
 * (latCentro, lonCentro). Devuelve coordenadas en un cuadrado de -1 a 1.
 *
 * `visible` es falso cuando el punto cae del otro lado del planeta. Sin ese
 * dato, la cara de atrás se dibujaría encima de la de adelante.
 */
export function ortografica(
  lat: number,
  lon: number,
  latCentro: number,
  lonCentro: number,
): Punto2D {
  const fi = lat * GRADOS
  const lambda = lon * GRADOS
  const fi0 = latCentro * GRADOS
  const lambda0 = lonCentro * GRADOS

  const cosC =
    Math.sin(fi0) * Math.sin(fi) + Math.cos(fi0) * Math.cos(fi) * Math.cos(lambda - lambda0)

  return {
    x: Math.cos(fi) * Math.sin(lambda - lambda0),
    y: Math.cos(fi0) * Math.sin(fi) - Math.sin(fi0) * Math.cos(fi) * Math.cos(lambda - lambda0),
    visible: cosC >= 0,
  }
}

type Vector3 = [number, number, number]

function aVector(lat: number, lon: number): Vector3 {
  const fi = lat * GRADOS
  const lambda = lon * GRADOS
  return [Math.cos(fi) * Math.cos(lambda), Math.cos(fi) * Math.sin(lambda), Math.sin(fi)]
}

function aLatLon(v: Vector3): { lat: number; lon: number } {
  return {
    lat: Math.asin(v[2]) / GRADOS,
    lon: Math.atan2(v[1], v[0]) / GRADOS,
  }
}

/**
 * Puntos a lo largo del círculo máximo entre dos coordenadas, interpolando
 * sobre la esfera y no sobre el plano. Interpolar las latitudes y longitudes
 * por separado daría una curva que no es el camino más corto.
 */
export function circuloMaximo(
  latA: number,
  lonA: number,
  latB: number,
  lonB: number,
  pasos = 48,
): { lat: number; lon: number }[] {
  const a = aVector(latA, lonA)
  const b = aVector(latB, lonB)

  const producto = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))
  const angulo = Math.acos(producto)

  // Puntos prácticamente encima uno del otro: el arco no existe.
  if (angulo < 1e-6) return [{ lat: latA, lon: lonA }]

  const seno = Math.sin(angulo)

  return Array.from({ length: pasos + 1 }, (_, i) => {
    const t = i / pasos
    const pesoA = Math.sin((1 - t) * angulo) / seno
    const pesoB = Math.sin(t * angulo) / seno
    return aLatLon([
      pesoA * a[0] + pesoB * b[0],
      pesoA * a[1] + pesoB * b[1],
      pesoA * a[2] + pesoB * b[2],
    ])
  })
}

/**
 * Punto medio del arco entre dos coordenadas. Se usa para centrar el globo de
 * forma que los dos extremos queden a la vista.
 */
export function puntoMedio(latA: number, lonA: number, latB: number, lonB: number) {
  const arco = circuloMaximo(latA, lonA, latB, lonB, 2)
  return arco[1]
}

/**
 * Meridianos y paralelos, ya como listas de coordenadas listas para proyectar.
 */
export function reticula(pasoGrados = 30): { lat: number; lon: number }[][] {
  const lineas: { lat: number; lon: number }[][] = []

  // Meridianos: de polo a polo.
  for (let lon = -180; lon < 180; lon += pasoGrados) {
    lineas.push(
      Array.from({ length: 37 }, (_, i) => ({ lat: -90 + i * 5, lon })),
    )
  }

  // Paralelos: vuelta completa. Sin los polos, que degeneran en un punto.
  for (let lat = -60; lat <= 60; lat += pasoGrados) {
    lineas.push(
      Array.from({ length: 73 }, (_, i) => ({ lat, lon: -180 + i * 5 })),
    )
  }

  return lineas
}

/**
 * Convierte coordenadas proyectadas en un atributo `d` de SVG, cortando el
 * trazo cada vez que la línea se va a la cara oculta del globo.
 */
export function aTrazo(puntos: Punto2D[], radio: number, centro: number): string {
  let d = ''
  let dibujando = false

  for (const punto of puntos) {
    if (!punto.visible) {
      dibujando = false
      continue
    }
    const x = centro + punto.x * radio
    // El eje Y del SVG crece hacia abajo; el de la proyección hacia arriba.
    const y = centro - punto.y * radio
    d += `${dibujando ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`
    dibujando = true
  }

  return d
}
