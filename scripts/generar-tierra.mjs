// Convierte los contornos de tierra de Natural Earth en un archivo compacto
// que el globo pueda proyectar en tiempo real.
//
// Se corre a mano, no en cada build: el resultado se versiona. Así el sitio no
// depende de `world-atlas` ni de `topojson-client` en producción — las dos son
// dependencias de desarrollo y no viajan al navegador.
//
// Uso: node scripts/generar-tierra.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { feature } from 'topojson-client'

/** Natural Earth 110m: la resolución más burda, que es justo la que queremos. */
const ORIGEN = 'node_modules/world-atlas/land-110m.json'

/**
 * Un punto se descarta si está a menos de esto (en grados) del último que
 * conservamos. A 240 px de globo, medio grado no llega ni a un pixel.
 */
const TOLERANCIA = 1.9

/** Anillos con menos puntos que esto son islas que no se alcanzan a ver. */
const MINIMO_PUNTOS = 5

/** Adelgaza un anillo dejando solo puntos separados entre sí. */
function simplificar(anillo) {
  const salida = [anillo[0]]

  for (let i = 1; i < anillo.length - 1; i++) {
    const [lon, lat] = anillo[i]
    const [lonPrevio, latPrevio] = salida[salida.length - 1]
    if (Math.abs(lon - lonPrevio) + Math.abs(lat - latPrevio) >= TOLERANCIA) {
      salida.push(anillo[i])
    }
  }

  // El último siempre se conserva: es el que cierra el polígono.
  salida.push(anillo[anillo.length - 1])
  return salida
}

const topologia = JSON.parse(readFileSync(ORIGEN, 'utf8'))
const tierra = feature(topologia, topologia.objects.land)

const anillos = []

for (const geometria of tierra.features) {
  const poligonos =
    geometria.geometry.type === 'Polygon'
      ? [geometria.geometry.coordinates]
      : geometria.geometry.coordinates

  for (const poligono of poligonos) {
    // Solo el anillo exterior. Los interiores son lagos, y a esta escala un
    // lago dibujado encima de la tierra no se distingue de un error.
    const simplificado = simplificar(poligono[0])
    if (simplificado.length >= MINIMO_PUNTOS) anillos.push(simplificado)
  }
}

/*
 * Formato: anillos separados por ";", puntos por " ", y lon/lat por ",".
 * Una décima de grado son ~11 km, de sobra para un globo de 240 px, y guardar
 * el JSON completo costaría más del triple.
 */
const codificado = anillos
  .map((anillo) => anillo.map(([lon, lat]) => `${lon.toFixed(1)},${lat.toFixed(1)}`).join(' '))
  .join(';')

const puntos = anillos.reduce((suma, anillo) => suma + anillo.length, 0)

writeFileSync(
  'src/lib/tierra.ts',
  `/**
 * Contornos de tierra del mundo, de Natural Earth (dominio público) a 110m.
 *
 * GENERADO POR scripts/generar-tierra.mjs — no editar a mano.
 *
 * Van codificados como cadena y no como arreglo de objetos porque el JSON
 * equivalente pesa varias veces más, y este archivo viaja al navegador entero.
 * Se decodifica una sola vez al cargar el módulo.
 */

const CODIFICADO =
  '${codificado}'

export type Anillo = { lat: number; lon: number }[]

export const TIERRA: Anillo[] = CODIFICADO.split(';').map((anillo) =>
  anillo.split(' ').map((par) => {
    const [lon, lat] = par.split(',')
    return { lat: Number(lat), lon: Number(lon) }
  }),
)
`,
)

console.log(`tierra: ${anillos.length} contornos, ${puntos} puntos, ${(codificado.length / 1024).toFixed(1)} kB`)
