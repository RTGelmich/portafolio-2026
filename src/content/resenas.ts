import type { Idioma } from '../i18n/idioma'

/**
 * Recomendaciones de gente con la que Angel ha trabajado.
 *
 * **Nada se publica sin `aprobada: true`.** Es la regla que importa: un
 * portafolio de búsqueda de empleo con testimonios abiertos es un blanco
 * obvio, y basta un comentario malintencionado para hundir la página entera.
 *
 * Cada quien escribe en su idioma y así se queda. Traducir el testimonio de
 * alguien es ponerle palabras en la boca; lo que se marca es en qué idioma
 * está, para que el sitio lo indique cuando no coincide con el que se está
 * leyendo.
 */
export type Resena = {
  nombre: string
  puesto: string
  empresa?: string
  /** El texto tal cual lo escribió esa persona, sin editar. */
  texto: string
  idioma: Idioma
  /** AAAA-MM. */
  fecha: string
  /**
   * Perfil de LinkedIn de quien recomienda. Opcional, pero una recomendación
   * que se puede rastrear hasta una persona real vale mucho más que una firmada
   * con un nombre suelto.
   */
  linkedin?: string
  /** Falso hasta que Angel la lea y la apruebe. */
  aprobada: boolean
}

export const resenas: Resena[] = [
  // EJEMPLO — no está aprobada, así que no se pinta. Sirve de plantilla para
  // ver qué campos lleva cada una.
  {
    nombre: 'Angeles',
    puesto: 'Tech Lead, Captación',
    empresa: 'Banco Azteca',
    texto:
      'Tuve la oportunidad de trabajar con Angel y me gusta su compromiso, su habilidad para detectar bugs y la facilidad con la que entiende los requerimientos que se le asignan.',
    idioma: 'es',
    fecha: '2026-08',
    aprobada: false,
  },
]

export const resenasAprobadas = resenas.filter((resena) => resena.aprobada)
