/**
 * Distancia aproximada entre Monterrey y quien está viendo la página.
 *
 * Josh Comeau hace esto con la IP del visitante. Aquí se usa la **zona horaria
 * del navegador**, y a propósito:
 *
 * - No hay petición a ningún servicio de terceros, así que no hay una llave de
 *   API que rotar ni un servicio que se caiga y deje la tarjeta vacía.
 * - No se toca la IP de nadie. La zona horaria ya la publica el navegador a
 *   cualquier sitio; no estamos sacando un dato nuevo de la persona.
 * - Funciona sin red y responde en el primer render, sin estado de carga.
 *
 * A cambio la precisión es de ciudad, no de calle — que para "estamos a tantos
 * kilómetros" es exactamente la precisión que hace falta.
 */

/** Monterrey, Nuevo León. */
export const ORIGEN = { lat: 25.6866, lon: -100.3161, ciudad: 'Monterrey' }

/**
 * Coordenadas aproximadas de la ciudad que da nombre a cada zona horaria.
 * No es exhaustivo: cubre las zonas de donde de verdad puede llegar tráfico.
 * Lo que no esté aquí simplemente no muestra distancia.
 */
const ZONAS: Record<string, [number, number]> = {
  // México y Centroamérica
  'America/Mexico_City': [19.43, -99.13],
  'America/Monterrey': [25.69, -100.32],
  'America/Cancun': [21.16, -86.85],
  'America/Tijuana': [32.51, -117.04],
  'America/Chihuahua': [28.63, -106.08],
  'America/Hermosillo': [29.07, -110.96],
  'America/Merida': [20.97, -89.62],
  'America/Guatemala': [14.63, -90.51],
  'America/Costa_Rica': [9.93, -84.08],
  'America/Panama': [8.98, -79.52],
  'America/Havana': [23.11, -82.37],
  'America/Santo_Domingo': [18.49, -69.93],

  // Estados Unidos y Canadá
  'America/New_York': [40.71, -74.01],
  'America/Chicago': [41.88, -87.63],
  'America/Denver': [39.74, -104.99],
  'America/Phoenix': [33.45, -112.07],
  'America/Los_Angeles': [34.05, -118.24],
  'America/Anchorage': [61.22, -149.9],
  'America/Toronto': [43.65, -79.38],
  'America/Vancouver': [49.28, -123.12],
  'America/Montreal': [45.5, -73.57],
  'America/Edmonton': [53.55, -113.49],
  'America/Halifax': [44.65, -63.57],

  // Sudamérica
  'America/Bogota': [4.71, -74.07],
  'America/Lima': [-12.05, -77.04],
  'America/Santiago': [-33.45, -70.67],
  'America/Buenos_Aires': [-34.6, -58.38],
  'America/Argentina/Buenos_Aires': [-34.6, -58.38],
  'America/Sao_Paulo': [-23.55, -46.63],
  'America/Montevideo': [-34.9, -56.16],
  'America/Caracas': [10.49, -66.88],
  'America/La_Paz': [-16.5, -68.15],
  'America/Asuncion': [-25.26, -57.58],
  'America/Guayaquil': [-2.19, -79.89],

  // Europa
  'Europe/London': [51.51, -0.13],
  'Europe/Dublin': [53.35, -6.26],
  'Europe/Lisbon': [38.72, -9.14],
  'Europe/Madrid': [40.42, -3.7],
  'Europe/Paris': [48.86, 2.35],
  'Europe/Brussels': [50.85, 4.35],
  'Europe/Amsterdam': [52.37, 4.9],
  'Europe/Berlin': [52.52, 13.4],
  'Europe/Zurich': [47.38, 8.54],
  'Europe/Rome': [41.9, 12.5],
  'Europe/Vienna': [48.21, 16.37],
  'Europe/Prague': [50.08, 14.44],
  'Europe/Warsaw': [52.23, 21.01],
  'Europe/Stockholm': [59.33, 18.07],
  'Europe/Oslo': [59.91, 10.75],
  'Europe/Copenhagen': [55.68, 12.57],
  'Europe/Helsinki': [60.17, 24.94],
  'Europe/Athens': [37.98, 23.73],
  'Europe/Bucharest': [44.43, 26.1],
  'Europe/Kyiv': [50.45, 30.52],
  'Europe/Moscow': [55.76, 37.62],
  'Europe/Istanbul': [41.01, 28.98],

  // África y Medio Oriente
  'Africa/Casablanca': [33.57, -7.59],
  'Africa/Lagos': [6.52, 3.38],
  'Africa/Cairo': [30.04, 31.24],
  'Africa/Nairobi': [-1.29, 36.82],
  'Africa/Johannesburg': [-26.2, 28.05],
  'Asia/Jerusalem': [31.77, 35.21],
  'Asia/Dubai': [25.2, 55.27],
  'Asia/Riyadh': [24.71, 46.68],

  // Asia y Oceanía
  'Asia/Karachi': [24.86, 67.01],
  'Asia/Kolkata': [22.57, 88.36],
  'Asia/Calcutta': [22.57, 88.36],
  'Asia/Dhaka': [23.81, 90.41],
  'Asia/Bangkok': [13.76, 100.5],
  'Asia/Jakarta': [-6.21, 106.85],
  'Asia/Singapore': [1.35, 103.82],
  'Asia/Manila': [14.6, 120.98],
  'Asia/Hong_Kong': [22.32, 114.17],
  'Asia/Shanghai': [31.23, 121.47],
  'Asia/Seoul': [37.57, 126.98],
  'Asia/Tokyo': [35.68, 139.65],
  'Australia/Perth': [-31.95, 115.86],
  'Australia/Sydney': [-33.87, 151.21],
  'Australia/Melbourne': [-37.81, 144.96],
  'Australia/Brisbane': [-27.47, 153.03],
  'Pacific/Auckland': [-36.85, 174.76],
}

const RADIO_TIERRA_KM = 6371

function aRadianes(grados: number): number {
  return (grados * Math.PI) / 180
}

/** Haversine: distancia sobre la superficie de la esfera, no en línea recta. */
function haversine(latA: number, lonA: number, latB: number, lonB: number): number {
  const dLat = aRadianes(latB - latA)
  const dLon = aRadianes(lonB - lonA)

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(latA)) * Math.cos(aRadianes(latB)) * Math.sin(dLon / 2) ** 2

  return 2 * RADIO_TIERRA_KM * Math.asin(Math.sqrt(a))
}

export type Ubicacion = {
  zona: string
  /** Nombre legible sacado de la zona: "America/Sao_Paulo" -> "Sao Paulo". */
  ciudad: string
  lat: number
  lon: number
  /** Kilómetros hasta Monterrey, redondeados a la decena. */
  km: number
}

/** `null` cuando no reconocemos la zona horaria: mejor callar que inventar. */
export function ubicacionDelVisitante(): Ubicacion | null {
  if (typeof Intl === 'undefined') return null

  const zona = Intl.DateTimeFormat().resolvedOptions().timeZone
  const coordenadas = zona ? ZONAS[zona] : undefined
  if (!coordenadas) return null

  const [lat, lon] = coordenadas
  const km = haversine(ORIGEN.lat, ORIGEN.lon, lat, lon)

  return {
    zona,
    ciudad: (zona.split('/').pop() ?? zona).replaceAll('_', ' '),
    lat,
    lon,
    // A esta precisión, decir "3,642 km" fingiría una exactitud que no hay.
    km: Math.round(km / 10) * 10,
  }
}

/**
 * Proyección equirectangular a un lienzo de 0..1. Es la que corresponde al
 * mapa que dibujamos, que también es equirectangular; con cualquier otra los
 * puntos caerían fuera de su país.
 */
export function aPlano(lat: number, lon: number): { x: number; y: number } {
  return {
    x: (lon + 180) / 360,
    y: (90 - lat) / 180,
  }
}
