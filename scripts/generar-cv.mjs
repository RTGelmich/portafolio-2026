// Genera public/cv-angel-flores.pdf.
//
// El PDF sale con texto real seleccionable, no como imagen: los sistemas de
// seguimiento de candidatos (ATS) leen el texto del PDF, y un CV bonito que el
// robot no puede parsear se descarta antes de que lo vea una persona. Por eso
// también va en una sola columna y sin foto — dos columnas confunden al parser
// y en vacantes de EE.UU., Reino Unido y Canadá la foto se considera un riesgo
// de sesgo y varias empresas piden que no la lleve.
//
// Uso: node scripts/generar-cv.mjs
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'

const NAVEGADOR = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'

const SITIO =
  readFileSync('src/content/sitio.ts', 'utf8').match(/URL_SITIO\s*=\s*'([^']+)'/)?.[1] ?? ''

/**
 * Todo el contenido del CV vive aquí. Angel edita esto y vuelve a correr el
 * script; no hay que tocar el HTML.
 */
const cv = {
  nombre: 'Angel Flores',
  titulo: 'Desarrollador Full Stack',
  ubicacion: 'Ciudad de México, México',
  email: 'angelfmich@gmail.com',
  telefono: '+52 55 7874 5371',
  sitio: SITIO.replace(/^https?:\/\//, ''),
  linkedin: 'linkedin.com/in/angel-flores-755372219',
  github: 'github.com/RTGelmich',

  perfil:
    'Ingeniero en Computación con cinco años construyendo software que opera en producción: originación bancaria a miles de operaciones diarias, sistemas de gestión completos y migración de aplicaciones financieras heredadas. Front-end con React y TypeScript, con trabajo real en base de datos, seguridad y despliegue. Cada proyecto de mi portafolio trae una demo funcional de la parte más difícil.',

  experiencia: [
    {
      empresa: 'Grupo Salinas · Banco Azteca',
      puesto: 'Ingeniero de Software',
      lugar: 'Ciudad de México',
      periodo: 'nov 2024 — actual',
      puntos: [
        'Desarrollo de interfaces transaccionales críticas de originación (apertura de cuentas, inversiones, seguros, portabilidad) con React y Redux, sobre una base de miles de operaciones diarias.',
        'Reducción del 30% en los tiempos de carga y registro, con aumento en la tasa de éxito de las afiliaciones.',
        'Reintentos que retoman el flujo en el punto de la falla en lugar de reiniciarlo: a este volumen, un error de 1 en 1000 golpea decenas de veces al día.',
        'Integración de APIs REST y microservicios para transacciones financieras en tiempo real, con normalización de respuestas en la frontera y prácticas OWASP.',
        'Integración de módulos nuevos al núcleo de originación (validación de identidad, prevención de lavado de dinero, firma sin papel con OTP, entrega de tarjeta), coordinando cambios con librerías compartidas versionadas entre equipos.',
        'Recuperación de la suite de pruebas unitarias: de ~200 a 272 suites en verde con correcciones sistémicas en configuración y en el contexto de navegación; SonarQube integrado al pipeline con reducción de duplicidad de código.',
      ],
    },
    {
      empresa: 'Smart Quality Software',
      puesto: 'Ingeniero de Software Front-End',
      lugar: 'Ciudad de México',
      periodo: 'mar 2024 — nov 2024',
      puntos: [
        'Liderazgo técnico del front-end de Conciliagas, plataforma de conciliación volumétrica: lanzamiento en menos de seis meses y operación en más de 150 estaciones.',
        'Interfaces de alto rendimiento para el procesamiento y visualización de datos volumétricos.',
        'Pruebas unitarias con Jest y documentación de componentes reutilizables con Storybook.',
      ],
    },
    {
      empresa: 'Denumeris Interactive Agency',
      puesto: 'Especialista en Tecnologías de la Información',
      lugar: 'Ciudad de México',
      periodo: 'jul 2021 — mar 2024',
      puntos: [],
    },
    {
      empresa: 'Riot Games',
      puesto: 'Soporte de Tecnologías de la Información',
      lugar: 'Ciudad de México',
      periodo: 'ene 2021 — mar 2022',
      puntos: [],
    },
  ],

  proyectos: [
    {
      nombre: 'Gladiadores Playa',
      enlace: 'gladiadoresplaya.com.mx',
      texto:
        'Sistema de gestión de gimnasio en producción, único desarrollador: 14 módulos, acceso por QR con anti-passback, punto de venta transaccional y multi-sede. React 19, TypeScript, PostgreSQL con Row Level Security.',
    },
    {
      nombre: 'Sandate Consultores',
      enlace: 'sandateconsultores.com.mx',
      texto:
        'Portal de clientes con seguridad a nivel de base: RLS, funciones con permisos elevados y URLs firmadas para documentos sensibles. Notificaciones en tiempo real y avisos por WhatsApp Cloud API.',
    },
    {
      nombre: 'Migración de sistema de facturación (distribuidora de gas LP)',
      enlace: '',
      texto:
        'Migración de una app de escritorio WPF de 10,850 líneas a web sin mover la base de producción. Lógica financiera aislada con 46 pruebas, incluido el redondeo bancario de C# frente al de JavaScript. Next.js, Prisma, SQL Server.',
    },
  ],

  stack: [
    {
      grupo: 'Lenguajes y frameworks',
      items: 'TypeScript, JavaScript (ES6+), React 19, Next.js, Angular 13+ (RxJS, NgRx), Node.js',
    },
    {
      grupo: 'Estado y datos',
      items: 'Redux, TanStack Query, Zustand, APIs REST, GraphQL, PostgreSQL con Row Level Security, Prisma, Supabase, SQL Server',
    },
    {
      grupo: 'Interfaz y pruebas',
      items: 'Tailwind CSS, Material UI, Chakra UI, Styled Components, Jest, Cypress, React Testing Library, Storybook, Puppeteer',
    },
    { grupo: 'Herramientas', items: 'Git, GitHub Actions, Docker, Vercel, Jira, metodologías ágiles' },
  ],

  formacion: [
    {
      titulo: 'Ingeniería en Computación · Titulado con cédula profesional',
      lugar: 'FES Aragón, UNAM',
      periodo: '2014 — 2018',
    },
  ],

  credenciales: [
    {
      nombre: 'Claude Code 101 — insignia de finalización',
      lugar: 'Claude Academy (Anthropic)',
      periodo: '2026',
    },
    {
      nombre: 'Tres cursos de desarrollo web',
      lugar: 'Udemy',
      periodo: '2023',
    },
  ],

  idiomas:
    'Español nativo. Inglés técnico: leo, escribo y trabajo en inglés; conversación intermedia.',
}

const escapar = (texto) =>
  texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><style>
  @page { size: letter; margin: 11mm 13mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;
    font-size: 8.9pt; line-height: 1.28; color: #1c1c22; -webkit-print-color-adjust: exact;
  }
  a { color: #3b4fd8; text-decoration: none; }

  .encabezado { display: flex; align-items: flex-start; gap: 12px; border-bottom: 2px solid #1c1c22; padding-bottom: 10px; }
  .encabezado h1 { font-size: 20pt; letter-spacing: -0.02em; line-height: 1.05; font-weight: 700; }
  .puesto { font-size: 10.5pt; color: #3b4fd8; font-weight: 600; margin-top: 2px; letter-spacing: 0.02em; }
  .contacto { margin-top: 6px; font-size: 8.6pt; color: #4a4a55; }
  .contacto span { white-space: nowrap; }
  .sep { color: #b8b8c2; padding: 0 5px; }

  h2 {
    font-size: 8.4pt; letter-spacing: 0.13em; text-transform: uppercase; color: #6a6a76;
    margin: 7px 0 4px; padding-bottom: 3px; border-bottom: 1px solid #dcdce4;
  }

  .perfil { margin-top: 7px; text-align: justify; }

  .puesto-fila { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-top: 6px; }
  .puesto-fila:first-of-type { margin-top: 0; }
  .empresa { font-weight: 700; font-size: 10pt; }
  .cargo { color: #3b4fd8; font-weight: 600; }
  .fechas { font-size: 8.4pt; color: #6a6a76; white-space: nowrap; }
  ul { margin: 3px 0 0 14px; }
  li { margin-bottom: 2px; }

  .proyecto { margin-bottom: 4px; }
  .proyecto-nombre { font-weight: 700; }
  .stack-fila { display: flex; gap: 6px; margin-bottom: 2px; }
  .stack-grupo { font-weight: 700; min-width: 128px; }

  .monograma { flex-shrink: 0; margin-top: 4px; }
</style></head>
<body>
  <div class="encabezado">
    <svg class="monograma" viewBox="0 0 40 32" width="42" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 28 L13 4 L23 28" stroke="#1c1c22"/>
      <path d="M7.6 20 L18.4 20" stroke="#1c1c22"/>
      <path d="M23 28 L23 4 L36 4" stroke="#3b4fd8"/>
      <path d="M23 15.5 L32 15.5" stroke="#3b4fd8"/>
    </svg>
    <div>
      <h1>${escapar(cv.nombre)}</h1>
      <div class="puesto">${escapar(cv.titulo)}</div>
      <div class="contacto">
        <span>${escapar(cv.ubicacion)}</span><span class="sep">·</span><span>${escapar(cv.email)}</span><span class="sep">·</span><span>${escapar(cv.telefono)}</span><br>
        <span><a href="https://${cv.sitio}">${escapar(cv.sitio)}</a></span><span class="sep">·</span><span><a href="https://${cv.linkedin}">${escapar(cv.linkedin)}</a></span><span class="sep">·</span><span><a href="https://${cv.github}">${escapar(cv.github)}</a></span>
      </div>
    </div>
  </div>

  <p class="perfil">${escapar(cv.perfil)}</p>

  <h2>Experiencia</h2>
  ${cv.experiencia
    .map(
      (e) => `<div class="puesto-fila">
        <div><span class="empresa">${escapar(e.empresa)}</span> — <span class="cargo">${escapar(e.puesto)}</span></div>
        <div class="fechas">${escapar(e.periodo)} · ${escapar(e.lugar)}</div>
      </div>
      ${e.puntos.length ? `<ul>${e.puntos.map((p) => `<li>${escapar(p)}</li>`).join('')}</ul>` : ''}`,
    )
    .join('')}

  <h2>Proyectos en producción</h2>
  ${cv.proyectos
    .map(
      (p) => `<div class="proyecto">
        <span class="proyecto-nombre">${escapar(p.nombre)}</span>${
          p.enlace ? ` <span class="sep">·</span> <a href="https://${p.enlace}">${escapar(p.enlace)}</a>` : ''
        }<br>${escapar(p.texto)}
      </div>`,
    )
    .join('')}

  <h2>Stack</h2>
  ${cv.stack
    .map(
      (s) => `<div class="stack-fila"><span class="stack-grupo">${escapar(s.grupo)}</span><span>${escapar(s.items)}</span></div>`,
    )
    .join('')}

  <h2>Formación y credenciales</h2>
  ${[...cv.formacion, ...cv.credenciales]
    .map(
      (f) => `<div class="puesto-fila">
        <div><span class="empresa">${escapar(f.titulo ?? f.nombre)}</span> — ${escapar(f.lugar)}</div>
        <div class="fechas">${escapar(f.periodo)}</div>
      </div>`,
    )
    .join('')}

  <h2>Idiomas</h2>
  <div>${escapar(cv.idiomas)}</div>
</body></html>`

const temporal = join(tmpdir(), `cv-${Date.now()}.html`)
writeFileSync(temporal, html)

const navegador = await puppeteer.launch({
  executablePath: NAVEGADOR,
  headless: true,
  args: ['--no-sandbox'],
})

const pagina = await navegador.newPage()

// El viewport tiene que ser del ancho real de impresión o la medición miente:
// carta son 8.5in menos 26mm de márgenes = ~718px a 96dpi. Midiendo a los
// 800px que trae por defecto, el texto ocupa menos renglones de los que va a
// ocupar y el CV parece caber en una página cuando en realidad son dos.
await pagina.setViewport({ width: 718, height: 1000 })
await pagina.goto(`file://${temporal}`, { waitUntil: 'networkidle0' })
await pagina.pdf({
  path: 'public/cv-angel-flores.pdf',
  format: 'letter',
  printBackground: true,
})

// Carta son 11in = 1056px a 96dpi; los márgenes de 11mm arriba y abajo se
// comen ~83px. Lo que quepa por debajo de eso es una sola página.
const ALTO_UTIL = 1056 - 83
const alto = await pagina.evaluate(() => document.body.scrollHeight)
const paginas = Math.ceil(alto / ALTO_UTIL)
console.log(`alto del contenido: ${alto}px · útil por página: ${ALTO_UTIL}px · sobran ${Math.max(0, alto - ALTO_UTIL)}px`)

await navegador.close()
unlinkSync(temporal)

console.log(`OK → public/cv-angel-flores.pdf (~${paginas} página${paginas > 1 ? 's' : ''})`)
