/**
 * Datos de contacto públicos. Un solo lugar: si cambia el número, cambia aquí.
 */
export const contacto = {
  nombre: 'Angel Flores',

  email: 'angelfmich@gmail.com',

  whatsappVisible: '+52 55 7874 5371',
  whatsappUrl: 'https://wa.me/525578745371',

  githubVisible: 'github.com/RTGelmich',
  githubUrl: 'https://github.com/RTGelmich',

  linkedinVisible: 'in/angel-flores',
  linkedinUrl: 'https://www.linkedin.com/in/angel-flores-755372219/',

  // Se generan los dos con: npm run cv
  cv: {
    es: '/cv-angel-flores.pdf',
    en: '/cv-angel-flores-en.pdf',
  },
} as const
