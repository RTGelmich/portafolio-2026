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
  ciudad: 'Ciudad de México',
  pais: 'México',
  zonaHoraria: 'America/Mexico_City',

  /** Año en que empezó a trabajar en tecnología. De LinkedIn: Riot Games, enero 2021. */
  desdeAnio: 2021,

  /**
   * Trayectoria, tal como está en LinkedIn. Los años se calculan solos para
   * que la tarjeta no envejezca sin que nadie la toque.
   */
  trayectoria: [
    { empresa: 'Banco Azteca', desde: 2024, hasta: null },
    { empresa: 'eGas Control Volumétrico', desde: 2024, hasta: 2024 },
    { empresa: 'Denumeris', desde: 2021, hasta: 2024 },
    { empresa: 'Riot Games', desde: 2021, hasta: 2022 },
  ],

  /** Formación. También de LinkedIn. */
  formacion: {
    titulo: { en: 'Computer Engineering', es: 'Ingeniería en Computación' },
    escuela: 'FES Aragón, UNAM',
  },

  /**
   * Credenciales verificables. Cada una lleva su enlace: una credencial que
   * nadie puede comprobar vale lo mismo que no tenerla.
   *
   * OJO con el texto: la de Anthropic es una **insignia de finalización de
   * curso**, no una certificación profesional. Llamarla "certificación" y que
   * alguien pique el enlace y lea otra cosa cuesta más que no ponerla.
   */
  credenciales: [
    {
      nombre: 'Claude Code 101',
      emisor: 'Claude Academy · Anthropic',
      fecha: { en: 'Aug 2026', es: 'ago 2026' },
      tipo: { en: 'Course completion badge', es: 'Insignia de finalización' },
      url: 'https://academy.claude.com/verify/0ec796ec8302f6a919431d1c7ef99235',
    },
  ],


  /** Teclas que se pintan como keycaps. Cinco caben bien; seis se aprietan. */
  teclas: ['R', 'E', 'A', 'C', 'T'],

  estatura: {
    activa: true,
    cm: 172,
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
  pruebas: 53,
}
