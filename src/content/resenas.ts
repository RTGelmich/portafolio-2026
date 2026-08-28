import type { Idioma } from '../i18n/idioma'

/**
 * Recomendaciones de gente con la que Angel ha trabajado.
 *
 * **Nada se publica sin `aprobada: true`.** Es la regla que importa: un
 * portafolio de búsqueda de empleo con testimonios abiertos es un blanco
 * obvio, y basta un comentario malintencionado para hundir la página entera.
 *
 * **Los textos van tal cual los escribieron, sin editar** — ni la puntuación,
 * ni las mayúsculas, ni los acentos. Corregirle el estilo a quien te hizo el
 * favor de recomendarte es ponerle palabras en la boca, y cinco testimonios
 * que suenan todos a la misma pluma no convencen a nadie.
 *
 * Lo que sí se marca es el idioma del texto, para avisarlo cuando no coincide
 * con el que se está leyendo.
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

/**
 * El orden importa: se leen de arriba a abajo y casi nadie llega a la última.
 * Van primero las que dicen algo concreto y las que traen enlace verificable.
 */
export const resenas: Resena[] = [
  {
    nombre: 'Cesar Villalba',
    puesto: 'Encargado de Sistemas y Tecnología',
    empresa: 'Cresagas',
    texto:
      'El maquetado de Cresagas no se quedó en referencia visual: fue la guía real para construir el panel de administración en producción. Tomamos directo sus tokens de color para modo claro/oscuro, la estructura de cards, tabs, insignias de estado y hasta el tooltip de la gráfica de consumo, porque estaba armado en código, no solo en una imagen. Se nota el cuidado en los detalles: datos de prueba bien etiquetados, información organizada pensando en cómo funciona el negocio, y un sistema de diseño consistente. Trabajo con visión de producto, no solo de pantalla bonita.',
    idioma: 'es',
    fecha: '2026-08',
    aprobada: true,
  },
  {
    nombre: 'Juan Fuentes',
    puesto: 'Senior Full Stack Software Engineer',
    empresa: 'Auction Technology Group',
    texto:
      'Ángel es un profesional comprometido con su equipo de trabajo, siempre encontrando el "cómo sí", dando ese extra que marca la diferencia entre un producto que cumple lineamientos y el que cautiva al usuario.\n\nHe tenido la suerte de colaborar en múltiples ocasiones con él y siempre ha sido un team player único',
    // Llegó marcada como 'en' porque Juan tenía el sitio en inglés, pero
    // escribió en español. Manda el idioma del texto, no el de la interfaz.
    idioma: 'es',
    fecha: '2026-08',
    linkedin: 'https://www.linkedin.com/in/rejit-kadath',
    aprobada: true,
  },
  {
    nombre: 'Alejandro Santiago',
    puesto: 'Ingeniero de software',
    empresa: 'Banco Azteca',
    texto:
      'Ángel es un compañero confiable y profesional, con una excelente disposición para colaborar y resolver problemas. Destaca por su compromiso con el trabajo, su capacidad para abordar retos técnicos y su disposición para apoyar a sus compañeros. Trabajar a su lado es fácil y enriquecedor, ya que siempre está dispuesto a compartir conocimientos, aportar ideas y buscar soluciones que beneficien al equipo.',
    idioma: 'es',
    fecha: '2026-08',
    linkedin: 'https://www.linkedin.com/in/alejandrosantiagodev',
    aprobada: true,
  },
  {
    nombre: 'Juan Lagunas',
    puesto: 'Desarrollador Sr.',
    empresa: 'Grupo Salinas',
    texto:
      'Es una persona perseverante, capaz de dar solución a problemas complejos, un gran soporte en cuanto a aportación e implementación de ideas.',
    idioma: 'es',
    fecha: '2026-08',
    aprobada: true,
  },
  {
    nombre: 'Luis E. Moya',
    puesto: 'IT',
    empresa: 'Denumeris Interactive',
    texto:
      'El Ingeniero Angel es una gran persona, tanto fuera como dentro de un empleo. El es muy Proactivo, le gusta mucho ayudar a la demás gente, además que es muy ingenioso para resolver problemas. Puntual en sus tareas que le asignan.\nEs de las personas que, si no sabe "algo", busca la solución y resuelve.\nSi me preguntaran, sinceramente volvería a trabajar con el puesto que es un gran líder.',
    idioma: 'es',
    fecha: '2026-08',
    aprobada: true,
  },
  {
    nombre: 'Ana Karen Jiménez',
    puesto: 'Desarrolladora Frontend',
    empresa: 'Grupo Salinas, Banco Azteca',
    texto:
      'Ángel es una persona responsable, muy colaborativa, sabe trabajar en equipo, siempre ha mostrado una actitud para resolver y afrontar retos de diversas índole.\nSu compromiso es notable y destacable, por lo que lo recomiendo expresamente.\nSe que podrá contribuir a cualquier otra área a la que se integre de forma notable.',
    idioma: 'es',
    fecha: '2026-08',
    aprobada: true,
  },
  {
    nombre: 'Luis Felipe',
    // TODO(angel): "Desarrollador generico" es lo que él escribió, pero como
    // puesto en tu portafolio se lee a descuido. Pregúntale cuál es el suyo.
    puesto: 'Desarrollador generico',
    empresa: 'Grupo Salinas',
    texto:
      'El Ing. Ángel Flores ha demostrado un crecimiento sobresaliente como Desarrollador Front End. Adquirió un amplio conocimiento técnico y una gran capacidad de aprendizaje, incorporando y dominando nuevas tecnologías de manera efectiva. Además, se adaptó rápidamente a un entorno de trabajo dinámico y de constantes cambios en los requerimientos, manteniendo siempre una actitud positiva y orientada a resultados. Su disposición para aprender y afrontar nuevos desafíos lo convirtió en un integrante valioso para el equipo.',
    idioma: 'es',
    fecha: '2026-08',
    aprobada: true,
  },
  {
    nombre: 'Luis Medina',
    puesto: 'Desarrollador',
    texto: 'Excelente compañero de trabajo con ganas de aprender siempre, 10/10',
    idioma: 'es',
    fecha: '2026-08',
    aprobada: true,
  },
]

export const resenasAprobadas = resenas.filter((resena) => resena.aprobada)
