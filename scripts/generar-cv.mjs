// Genera public/cv-angel-flores.pdf (español) y cv-angel-flores-en.pdf (inglés).
//
// El PDF sale con texto real seleccionable, no como imagen: los sistemas de
// seguimiento de candidatos (ATS) leen el texto del PDF, y un CV bonito que el
// robot no puede parsear se descarta antes de que lo vea una persona. Por eso
// también va en una sola columna y sin foto — dos columnas confunden al parser
// y en vacantes de EE.UU., Reino Unido y Canadá la foto se considera un riesgo
// de sesgo y varias empresas piden que no la lleve.
//
// El contenido vive en cv-datos.mjs, en los dos idiomas.
//
// Uso: node scripts/generar-cv.mjs
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'

import { cv } from './cv-datos.mjs'

const NAVEGADOR = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'

const SITIO =
  readFileSync('src/content/sitio.ts', 'utf8').match(/URL_SITIO\s*=\s*'([^']+)'/)?.[1] ?? ''
const DOMINIO = SITIO.replace(/^https?:\/\//, '')

/** Carta son 11in = 1056px a 96dpi; los márgenes de 11mm se comen ~83px. */
const ALTO_UTIL = 1056 - 83

/**
 * El viewport tiene que ser del ancho real de impresión o la medición miente:
 * carta son 8.5in menos 26mm de márgenes = ~718px a 96dpi. Midiendo a los 800px
 * que trae puppeteer por defecto, el texto ocupa menos renglones de los que va
 * a ocupar y el CV parece caber en una página cuando en realidad son dos.
 */
const ANCHO_IMPRESION = 718

/** Devuelve el valor en el idioma pedido, o el valor tal cual si no es bilingüe. */
const tr = (valor, idioma) =>
  valor && typeof valor === 'object' && !Array.isArray(valor) ? valor[idioma] : valor

const escapar = (texto) =>
  String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function construirHtml(idioma) {
  const s = (clave) => escapar(tr(cv.secciones[clave], idioma))

  return `<!doctype html>
<html lang="${idioma}"><head><meta charset="utf-8"><style>
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
      <div class="puesto">${escapar(tr(cv.titulo, idioma))}</div>
      <div class="contacto">
        <span>${escapar(tr(cv.ubicacion, idioma))}</span><span class="sep">·</span><span>${escapar(cv.email)}</span><span class="sep">·</span><span>${escapar(cv.telefono)}</span><br>
        <span><a href="https://${DOMINIO}">${escapar(DOMINIO)}</a></span><span class="sep">·</span><span><a href="https://${cv.linkedin}">${escapar(cv.linkedin)}</a></span><span class="sep">·</span><span><a href="https://${cv.github}">${escapar(cv.github)}</a></span>
      </div>
    </div>
  </div>

  <p class="perfil">${escapar(tr(cv.perfil, idioma))}</p>

  <h2>${s('experiencia')}</h2>
  ${cv.experiencia
    .map((e) => {
      const puntos = tr(e.puntos, idioma)
      return `<div class="puesto-fila">
        <div><span class="empresa">${escapar(e.empresa)}</span> — <span class="cargo">${escapar(tr(e.puesto, idioma))}</span></div>
        <div class="fechas">${escapar(tr(e.periodo, idioma))} · ${escapar(tr(e.lugar, idioma))}</div>
      </div>
      ${puntos.length ? `<ul>${puntos.map((p) => `<li>${escapar(p)}</li>`).join('')}</ul>` : ''}`
    })
    .join('')}

  <h2>${s('proyectos')}</h2>
  ${cv.proyectos
    .map(
      (p) => `<div class="proyecto">
        <span class="proyecto-nombre">${escapar(p.nombre)}</span>${
          p.enlace ? ` <span class="sep">·</span> <a href="https://${p.enlace}">${escapar(p.enlace)}</a>` : ''
        }<br>${escapar(tr(p.texto, idioma))}
      </div>`,
    )
    .join('')}

  <h2>${s('stack')}</h2>
  ${cv.stack
    .map(
      (x) => `<div class="stack-fila"><span class="stack-grupo">${escapar(tr(x.grupo, idioma))}</span><span>${escapar(tr(x.items, idioma))}</span></div>`,
    )
    .join('')}

  <h2>${s('formacion')}</h2>
  ${[...cv.formacion, ...cv.credenciales]
    .map(
      (f) => `<div class="puesto-fila">
        <div><span class="empresa">${escapar(tr(f.titulo ?? f.nombre, idioma))}</span> — ${escapar(tr(f.lugar, idioma))}</div>
        <div class="fechas">${escapar(tr(f.periodo, idioma))}</div>
      </div>`,
    )
    .join('')}

  <h2>${s('idiomas')}</h2>
  <div>${escapar(tr(cv.idiomas, idioma))}</div>
</body></html>`
}

const navegador = await puppeteer.launch({
  executablePath: NAVEGADOR,
  headless: true,
  args: ['--no-sandbox'],
})

for (const [idioma, salida] of [
  ['es', 'public/cv-angel-flores.pdf'],
  ['en', 'public/cv-angel-flores-en.pdf'],
]) {
  const temporal = join(tmpdir(), `cv-${idioma}-${Date.now()}.html`)
  writeFileSync(temporal, construirHtml(idioma))

  const pagina = await navegador.newPage()
  await pagina.setViewport({ width: ANCHO_IMPRESION, height: 1000 })
  await pagina.goto(`file://${temporal}`, { waitUntil: 'networkidle0' })

  const alto = await pagina.evaluate(() => document.body.scrollHeight)
  await pagina.pdf({ path: salida, format: 'letter', printBackground: true })
  await pagina.close()
  unlinkSync(temporal)

  const paginas = Math.ceil(alto / ALTO_UTIL)
  const sobra = Math.max(0, alto - ALTO_UTIL)
  console.log(
    `${idioma} → ${salida}  ·  ${alto}px de ${ALTO_UTIL} útiles  ·  ${paginas} página${paginas > 1 ? 's' : ''}${sobra ? ` (sobran ${sobra}px)` : ''}`,
  )
}

await navegador.close()
