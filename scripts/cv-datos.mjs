// Contenido del CV en los dos idiomas. Angel edita esto y corre `npm run cv`.
//
// El inglés NO es una traducción del español: son bullets reescritos para que
// suenen a alguien que escribe en inglés técnico. Traducir literalmente deja
// frases que un reclutador angloparlante lee como raras, y ahí se pierde justo
// lo que se quería ganar.

export const cv = {
  nombre: 'Angel Flores',
  ubicacion: { es: 'Ciudad de México, México', en: 'Mexico City, Mexico' },
  email: 'angelfmich@gmail.com',
  telefono: '+52 55 7874 5371',
  linkedin: 'linkedin.com/in/angel-flores-755372219',
  github: 'github.com/RTGelmich',

  titulo: { es: 'Desarrollador Full Stack', en: 'Full Stack Developer' },

  perfil: {
    es: 'Ingeniero en Computación con cinco años construyendo software que opera en producción: originación bancaria a miles de operaciones diarias, sistemas de gestión completos y migración de aplicaciones financieras heredadas. Front-end con React y TypeScript, con trabajo real en base de datos, seguridad y despliegue. Cada proyecto de mi portafolio trae una demo funcional de la parte más difícil.',
    en: 'Computer Engineer with five years building software that runs in production: bank origination at thousands of operations a day, complete management systems, and migrations of legacy financial applications. React and TypeScript on the front end, with real work in the database, in security and in deployment. Every project in my portfolio ships a working demo of the hardest part.',
  },

  experiencia: [
    {
      empresa: 'Grupo Salinas · Banco Azteca',
      puesto: { es: 'Ingeniero de Software', en: 'Software Engineer' },
      lugar: { es: 'Ciudad de México', en: 'Mexico City' },
      periodo: { es: 'nov 2024 — actual', en: 'Nov 2024 — present' },
      puntos: {
        es: [
          'Desarrollo de interfaces transaccionales críticas de originación (apertura de cuentas, inversiones, seguros, portabilidad) con React y Redux, sobre una base de miles de operaciones diarias.',
          'Reducción del 30% en los tiempos de carga y registro, con aumento en la tasa de éxito de las afiliaciones.',
          'Reintentos que retoman el flujo en el punto de la falla en lugar de reiniciarlo: a este volumen, un error de 1 en 1000 golpea decenas de veces al día.',
          'Integración de APIs REST y microservicios para transacciones financieras en tiempo real, con normalización de respuestas en la frontera y prácticas OWASP.',
          'Integración de módulos nuevos al núcleo de originación (validación de identidad, prevención de lavado de dinero, firma sin papel con OTP, entrega de tarjeta), coordinando cambios con librerías compartidas versionadas entre equipos.',
          'Recuperación de la suite de Jest: de ~200 a 272 suites en verde con correcciones sistémicas en configuración y contexto de navegación. Cobertura del 40% al 88% y, en SonarQube, cero bugs, cero code smells y 2% de duplicidad.',
        ],
        en: [
          'Built critical transactional origination flows — account opening, investments, insurance, portability — in React and Redux, on a product handling thousands of operations a day.',
          'Cut load and sign-up times by 30%, raising the completion rate on new applications.',
          'Retries that resume a flow at the point of failure instead of restarting it: at this volume, a 1-in-1000 error lands dozens of times a day.',
          'Integrated REST APIs and microservices for real-time financial transactions, normalising responses at the boundary and following OWASP practices.',
          'Shipped new modules into the origination core — identity validation, anti-money-laundering checks, paperless signing with OTP, card delivery — coordinating changes across versioned libraries shared between teams.',
          'Brought the Jest suite back from ~200 to 272 passing suites by fixing systemic issues in configuration and navigation context. Raised coverage from 40% to 88%, with zero bugs, zero code smells and 2% duplication in SonarQube.',
        ],
      },
    },
    {
      // El nombre completo tal como está registrado en LinkedIn. Antes decía
      // "Smart Quality Software": misma empresa, pero eGas es el nombre con el
      // que se le encuentra, y es el que quedó en el anuncio público del puesto.
      empresa: 'eGas Control Volumétrico y Más',
      puesto: { es: 'Ingeniero de Software Front-End', en: 'Front-End Software Engineer' },
      lugar: { es: 'Ciudad de México', en: 'Mexico City' },
      periodo: { es: 'mar 2024 — nov 2024', en: 'Mar 2024 — Nov 2024' },
      puntos: {
        es: [
          'Liderazgo técnico del front-end de Conciliagas, plataforma de conciliación volumétrica: lanzamiento en menos de seis meses y operación en más de 150 estaciones.',
          'Interfaces de alto rendimiento para el procesamiento y visualización de datos volumétricos.',
          'Pruebas unitarias con Jest y documentación de componentes reutilizables con Storybook.',
        ],
        en: [
          'Technical lead for the front end of Conciliagas, a volumetric reconciliation platform: launched in under six months and running across more than 150 stations.',
          'High-performance interfaces for processing and visualising volumetric data.',
          'Unit tests in Jest and reusable components documented in Storybook.',
        ],
      },
    },
    {
      empresa: 'Denumeris Interactive Agency',
      puesto: {
        es: 'Especialista en Tecnologías de la Información',
        en: 'Information Technology Specialist',
      },
      lugar: { es: 'Ciudad de México', en: 'Mexico City' },
      periodo: { es: 'jul 2021 — mar 2024', en: 'Jul 2021 — Mar 2024' },
      puntos: { es: [], en: [] },
    },
    {
      empresa: 'Riot Games',
      // El "(medio tiempo)" no es adorno: estas fechas se enciman nueve meses
      // con las de Denumeris. Sin la aclaración parecen dos empleos de tiempo
      // completo a la vez, y quien lee un CV asume error antes que preguntar.
      puesto: {
        es: 'Soporte de Tecnologías de la Información (medio tiempo)',
        en: 'Information Technology Support (part-time)',
      },
      lugar: { es: 'Ciudad de México', en: 'Mexico City' },
      periodo: { es: 'ene 2021 — mar 2022', en: 'Jan 2021 — Mar 2022' },
      puntos: { es: [], en: [] },
    },
  ],

  proyectos: [
    {
      nombre: 'Gladiadores Playa',
      enlace: 'gladiadoresplaya.com.mx',
      texto: {
        es: 'Sistema de gestión de gimnasio en producción, único desarrollador: 14 módulos, acceso por QR con anti-passback, punto de venta transaccional y multi-sede. React 19, TypeScript, PostgreSQL con Row Level Security.',
        en: 'Gym management system in production, sole developer: 14 modules, QR door access with anti-passback, transactional point of sale and multi-location support. React 19, TypeScript, PostgreSQL with Row Level Security.',
      },
    },
    {
      nombre: 'Sandate Consultores',
      enlace: 'sandateconsultores.com.mx',
      texto: {
        es: 'Portal de clientes con seguridad a nivel de base: RLS, funciones con permisos elevados y URLs firmadas para documentos sensibles. Notificaciones en tiempo real y avisos por WhatsApp Cloud API.',
        en: 'Client portal with security enforced at the database level: RLS, functions running with elevated rights, and signed URLs for sensitive documents. Realtime notifications and alerts over the WhatsApp Cloud API.',
      },
    },
    {
      nombre: 'Cresagas',
      enlace: '',
      texto: {
        es: 'Migración de una app de escritorio WPF de 10,850 líneas a web sin mover la base de producción. Lógica financiera aislada con 46 pruebas, incluido el redondeo bancario de C# frente al de JavaScript. Next.js, Prisma, SQL Server.',
        en: 'Migrated a 10,850-line WPF desktop application to the web without moving the production database. Financial logic isolated behind 46 tests, including the difference between banker\'s rounding in C# and half-up in JavaScript. Next.js, Prisma, SQL Server.',
      },
    },
  ],

  stack: [
    {
      grupo: { es: 'Lenguajes y frameworks', en: 'Languages and frameworks' },
      items: 'TypeScript, JavaScript (ES6+), React 19, Next.js, Angular 13+ (RxJS, NgRx), Node.js',
    },
    {
      grupo: { es: 'Estado y datos', en: 'State and data' },
      items:
        'Redux, TanStack Query, Zustand, REST APIs, GraphQL, PostgreSQL with Row Level Security, Prisma, Supabase, SQL Server',
    },
    {
      grupo: { es: 'Interfaz y pruebas', en: 'Interface and testing' },
      items:
        'Tailwind CSS, Material UI, Chakra UI, Styled Components, Jest, Cypress, React Testing Library, Storybook, Puppeteer',
    },
    {
      grupo: { es: 'Herramientas', en: 'Tooling' },
      items: {
        es: 'Git, GitHub Actions, Docker, Vercel, Jira, metodologías ágiles',
        en: 'Git, GitHub Actions, Docker, Vercel, Jira, agile methodologies',
      },
    },
  ],

  formacion: [
    {
      titulo: {
        es: 'Ingeniería en Computación · Titulado',
        en: 'B.Eng. in Computer Engineering',
      },
      lugar: 'FES Aragón, UNAM',
      periodo: '2014 — 2018',
    },
  ],

  credenciales: [
    {
      nombre: {
        es: 'Claude Code 101 — insignia de finalización',
        en: 'Claude Code 101 — course completion badge',
      },
      lugar: 'Claude Academy (Anthropic)',
      periodo: '2026',
    },
    {
      nombre: { es: 'Tres cursos de desarrollo web', en: 'Three web development courses' },
      lugar: 'Udemy',
      periodo: '2023',
    },
  ],

  // "Conversación intermedia" lo dejaba fuera de las vacantes de $4,500+ USD,
  // que piden inglés fluido. Vivió en Estados Unidos: eso es lo que hay que
  // decir, porque es el dato que un reclutador puede pesar.
  idiomas: {
    es: 'Español nativo. Inglés profesional: viví en Estados Unidos; leo, escribo y sostengo reuniones de trabajo en inglés.',
    en: 'Spanish native. Professional English: I lived in the United States and read, write and hold work meetings in it.',
  },

  secciones: {
    experiencia: { es: 'Experiencia', en: 'Experience' },
    proyectos: { es: 'Proyectos en producción', en: 'Projects in production' },
    stack: { es: 'Stack', en: 'Stack' },
    formacion: { es: 'Formación y credenciales', en: 'Education and credentials' },
    idiomas: { es: 'Idiomas', en: 'Languages' },
  },
}
