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

  // TODO(angel): pasar el perfil de LinkedIn. Sin él, la tarjeta no se renderiza.
  linkedinVisible: '',
  linkedinUrl: '',

  // TODO(angel): generar el PDF del CV y ponerlo en public/. Sin él, el botón se oculta.
  cvUrl: '',
} as const
