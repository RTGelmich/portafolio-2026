import type { Bilingue } from '../i18n/idioma'

/** Textos de interfaz. Todo lo que no sea contenido de un proyecto vive aquí. */
export const ui = {
  saltarAlContenido: {
    en: 'Skip to content',
    es: 'Saltar al contenido',
  },
  navTrabajo: { en: 'Work', es: 'Trabajo' },
  navSobreMi: { en: 'About', es: 'Sobre mí' },
  navContacto: { en: 'Contact', es: 'Contacto' },
  cambiarTema: { en: 'Toggle theme', es: 'Cambiar tema' },
  // El nombre accesible tiene que CONTENER el texto visible del botón ("EN"/"ES"),
  // si no, quien navega por voz dice "clic en ES" y no pasa nada (WCAG 2.5.3).
  cambiarIdioma: { en: 'EN — switch to Spanish', es: 'ES — cambiar a inglés' },

  heroRol: {
    en: 'Full-stack engineer',
    es: 'Ingeniero full-stack',
  },
  heroTitulo: {
    en: 'I ship systems people actually run their business on.',
    es: 'Construyo sistemas con los que la gente de verdad opera su negocio.',
  },
  // TODO(angel): confirmar años de experiencia para ponerlos aquí.
  heroBajada: {
    en: 'I turn messy operations into software that holds up in production — gyms, banks, gas distributors, schools. Every project below is playable: touch the actual problem I solved.',
    es: 'Convierto operaciones desordenadas en software que aguanta producción — gimnasios, bancos, distribuidoras de gas, escuelas. Cada proyecto de abajo es jugable: mete la mano en el problema real que resolví.',
  },
  heroVerTrabajo: { en: 'See the work', es: 'Ver el trabajo' },
  heroDescargarCv: { en: 'Download CV', es: 'Descargar CV' },
  heroPista: {
    en: 'Drag anywhere to disturb the field',
    es: 'Arrastra para mover el campo',
  },

  sobreMiTitulo: {
    en: 'Some things about me that are not projects.',
    es: 'Unas cosas sobre mí que no son proyectos.',
  },

  seccionTrabajoEyebrow: { en: 'Selected work', es: 'Trabajo seleccionado' },
  seccionTrabajoTitulo: {
    en: "Don't take my word for it — play with it.",
    es: 'No me creas — pruébalo tú.',
  },
  seccionTrabajoBajada: {
    en: 'Each case study ships with a working demo of the hardest part. No screenshots of things that only worked once.',
    es: 'Cada caso trae una demo funcional de la parte más difícil. Nada de capturas de cosas que sirvieron una sola vez.',
  },

  verCaso: { en: 'Read the case study', es: 'Ver el caso completo' },
  verEnVivo: { en: 'Live site', es: 'Sitio en vivo' },
  volver: { en: 'All work', es: 'Todo el trabajo' },
  pruebalo: { en: 'Try it', es: 'Pruébalo' },

  elProblema: { en: 'The problem', es: 'El problema' },
  lasDecisiones: { en: 'What I decided', es: 'Lo que decidí' },
  elResultado: { en: 'The result', es: 'El resultado' },
  elStack: { en: 'Stack', es: 'Stack' },
  miRol: { en: 'My role', es: 'Mi rol' },

  contactoTitulo: {
    en: "Let's talk.",
    es: 'Hablemos.',
  },
  contactoBajada: {
    en: 'If something here is useful to you, write to me. WhatsApp is the fastest way.',
    es: 'Si algo de aquí te sirve, escríbeme. La vía más rápida es WhatsApp.',
  },

  hechoCon: {
    en: 'Built with React, TypeScript and a hand-written WebGL shader. No templates.',
    es: 'Hecho con React, TypeScript y un shader WebGL escrito a mano. Sin plantillas.',
  },
  verCodigo: { en: 'Source code', es: 'Código fuente' },
} satisfies Record<string, Bilingue>
