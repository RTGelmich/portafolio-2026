import type { Bilingue } from '../i18n/idioma'

/**
 * Datos de la sección personal. Todo lo que Angel tenga que corregir vive aquí
 * y en ningún otro lado.
 *
 * Las tarjetas con `activa: false` no se pintan. Es a propósito: prefiero
 * dejarlas escritas y apagadas a que el sitio publique un dato que nadie
 * confirmó.
 */
export const personal = {
  ciudad: 'Monterrey',
  pais: 'México',
  zonaHoraria: 'America/Monterrey',

  /** Teclas que se pintan como keycaps. Cinco caben bien; seis se aprietan. */
  teclas: ['R', 'E', 'A', 'C', 'T'],

  estatura: {
    // TODO(angel): tu estatura en cm si le quieres copiar la broma a Josh.
    activa: false,
    cm: 0,
    remate: {
      en: 'For some reason this surprises people.',
      es: 'Por alguna razón esto sorprende a la gente.',
    } satisfies Bilingue,
  },

  /**
   * TODO(angel): esta habla de tu mamá, así que la dejo apagada hasta que
   * tú digas. Si la quieres, cambia `activa` a true — y confírmalo con ella
   * antes, que su TikTok es público pero eso no es lo mismo que dar permiso.
   */
  tarot: {
    activa: false,
    texto: {
      en: 'I designed and illustrated a 22-card tarot deck for my mom, who reads tarot. Print-ready, with the meanings she uses written on the back of each card.',
      es: 'Diseñé e ilustré un mazo de tarot de 22 cartas para mi mamá, que lee tarot. Listo para imprenta, con los significados que ella usa escritos al reverso de cada carta.',
    } satisfies Bilingue,
  },

  /**
   * TODO(angel): dos o tres cosas tuyas que no tengan que ver con código.
   * Ejemplos del tipo de cosa que funciona: un deporte, un instrumento, una
   * manía, algo que se te dé mal. Entre más específico, mejor.
   */
  gustos: {
    activa: false,
    items: [] as Bilingue[],
  },
} as const

/**
 * Números de este mismo sitio. Se actualizan a mano tras correr Lighthouse;
 * son de la última medición sobre el build de producción.
 */
export const esteSitio = {
  lighthouse: '100',
  jsInicial: '96 kB',
  pruebas: 32,
}
