// Prueba de extremo a extremo de los seis widgets, más un repaso de teclado
// y de "reducir movimiento". No sustituye a mirar el sitio, pero atrapa las
// regresiones que sí importan: que la lógica de cada demo siga respondiendo.
//
// Uso: node scripts/probar.mjs [url-base]
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] ?? 'http://localhost:5174'
const NAVEGADOR = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'

const resultados = []

function revisar(nombre, condicion, detalle = '') {
  resultados.push({ nombre, ok: Boolean(condicion), detalle })
  console.log(`${condicion ? '  ok  ' : ' FALLA'} ${nombre}${detalle ? ` — ${detalle}` : ''}`)
}

const navegador = await puppeteer.launch({
  executablePath: NAVEGADOR,
  headless: true,
  args: ['--enable-unsafe-swiftshader', '--no-sandbox'],
})

const pagina = await navegador.newPage()
await pagina.setViewport({ width: 1440, height: 900 })

const erroresConsola = []
pagina.on('pageerror', (e) => erroresConsola.push(e.message))
pagina.on('console', (m) => {
  if (m.type() === 'error') erroresConsola.push(m.text())
})

// Idioma fijo en español para que las aserciones de texto no dependan del locale.
await pagina.evaluateOnNewDocument(() => {
  localStorage.setItem('portafolio:idioma', 'es')
  localStorage.setItem('portafolio:tema', 'oscuro')
})

const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

/** Hace clic en el primer elemento cuyo texto contenga la cadena dada. */
async function clicPorTexto(selector, texto) {
  const encontrado = await pagina.evaluate(
    (sel, txt) => {
      const nodo = [...document.querySelectorAll(sel)].find((n) =>
        n.textContent?.includes(txt),
      )
      if (!nodo) return false
      nodo.click()
      return true
    },
    selector,
    texto,
  )
  if (!encontrado) throw new Error(`No se encontró ${selector} con texto "${texto}"`)
  await esperar(120)
}

// innerText devuelve el texto YA transformado por CSS, y las etiquetas
// `eyebrow` van en mayúsculas. Comparamos siempre en minúsculas para no
// escribir aserciones que dependen de una decisión de estilo.
const texto = () => pagina.evaluate(() => document.body.innerText)
const textoBajo = async () => (await texto()).toLowerCase()

// ---------------------------------------------------------------- Gladiadores
console.log('\nGladiadores — acceso por QR')
await pagina.goto(`${BASE}/trabajo/gladiadores`, { waitUntil: 'networkidle2' })
await esperar(500)

await clicPorTexto('button', 'Ana Rivas')
revisar('primer escaneo permite el acceso', (await texto()).includes('Acceso permitido'))

await clicPorTexto('button', 'Ana Rivas')
revisar('segundo escaneo lo bloquea el anti-passback', (await texto()).includes('Ya escaneó'))
revisar('dice cuánto falta para reintentar', /Reintenta en \d+ min/.test(await texto()))

await clicPorTexto('button', 'Avanzar 5 minutos')
await clicPorTexto('button', 'Ana Rivas')
revisar('pasada la ventana vuelve a entrar', (await texto()).includes('Acceso permitido'))

await clicPorTexto('button', 'Beto Cruz')
revisar('membresía vencida se rechaza', (await texto()).includes('Membresía vencida'))

// -------------------------------------------------------------------- Gasera
console.log('\nGasera — trampa del redondeo')
await pagina.goto(`${BASE}/trabajo/cresagas`, { waitUntil: 'networkidle2' })
await esperar(400)

await clicPorTexto('button', 'Facturar 1000')
await esperar(200)
const cuerpoGasera = await texto()
const descuadre = cuerpoGasera.match(/Descuadre\s*\n?\s*(-?\$[\d,]+\.\d{2})/)
revisar('facturar 1000 recibos produce descuadre', Boolean(descuadre), descuadre?.[1] ?? 'sin match')
revisar(
  'el descuadre no es cero',
  descuadre && !descuadre[1].endsWith('0.00'),
  descuadre?.[1] ?? '',
)
revisar('reporta cuántos recibos empataron', /de 1000 recibos cayeron/.test(cuerpoGasera))

// ------------------------------------------------------------------ CIPROMEX
console.log('\nCIPROMEX — paywall')
await pagina.goto(`${BASE}/trabajo/cipromex`, { waitUntil: 'networkidle2' })
await esperar(400)

for (let i = 0; i < 11; i++) {
  await pagina.evaluate(() => {
    const opciones = [...document.querySelectorAll('li > button')].filter(
      (b) => !b.disabled && b.closest('ul')?.previousElementSibling?.tagName === 'H3',
    )
    opciones[0]?.click()
  })
  await esperar(620)
}

const cuerpoPaywall = await texto()
revisar('a la 11ª pregunta corta el paywall', cuerpoPaywall.includes('LIMITE_DIARIO'))
revisar('ofrece los planes de pago', cuerpoPaywall.includes('PRO') && cuerpoPaywall.includes('PREMIUM'))

await clicPorTexto('button', 'Reiniciar la demo')
await esperar(200)
revisar('el botón de reinicio devuelve el quiz', (await textoBajo()).includes('pregunta 1'))

// ------------------------------------------------------------------- EXPRESS
console.log('\nEXPRESS — bot de FAQ')
await pagina.goto(`${BASE}/trabajo/express`, { waitUntil: 'networkidle2' })
await esperar(400)

await clicPorTexto('button', '¿Cuánto cobran?')
await esperar(1000)
revisar('la pregunta de precio se canaliza a un humano', (await texto()).includes('canalizado con asesor'))

await clicPorTexto('button', '¿Afecta a mi pensión?')
await esperar(1000)
revisar('la de pensión sí la contesta el bot', (await texto()).includes('IMSS'))

await pagina.type('input[type="text"]', 'donde estan sus oficinas')
await pagina.keyboard.press('Enter')
await esperar(1000)
revisar('texto libre sin acentos también rutea', (await texto()).includes('Roma Norte'))

// -------------------------------------------------------------- Banco Azteca
console.log('\nBanco Azteca — throughput')
await pagina.goto(`${BASE}/trabajo/banco-azteca`, { waitUntil: 'networkidle2' })
await esperar(2000)

const cuerpoAzteca = await textoBajo()
const contador = cuerpoAzteca.match(/operaciones hoy\s*\n\s*([\d,]+)/)
revisar('el contador avanza', contador && Number(contador[1].replace(/,/g, '')) > 0, contador?.[1])
revisar(
  'los reintentos aparecen',
  /(\d+) necesitaron reintento/.test(cuerpoAzteca) &&
    Number(cuerpoAzteca.match(/(\d+) necesitaron reintento/)[1]) > 0,
)
revisar('marca la cifra como ilustrativa', cuerpoAzteca.includes('ilustrativas'))

// ------------------------------------------------- Consultoría financiera
console.log('\nSandate — RLS')
await pagina.goto(`${BASE}/trabajo/sandate`, { waitUntil: 'networkidle2' })
await esperar(400)

const conRlsApagado = await texto()
revisar('con RLS apagado se ven las filas', conRlsApagado.includes('Persona Ejemplo Uno'))
revisar('con RLS apagado la escalada funciona', conRlsApagado.includes('ahora eres administrador'))

await clicPorTexto('button', 'RLS OFF')
await esperar(300)
const conRlsEncendido = await texto()
revisar('con RLS encendido no devuelve filas', conRlsEncendido.includes('(0 rows)'))
revisar('con RLS encendido la escritura falla', conRlsEncendido.includes('violates row-level security'))
revisar('ya no se filtran nombres', !conRlsEncendido.includes('Persona Ejemplo Uno'))

// ------------------------------------------------------- Sección personal
console.log('\nSobre mí')
await pagina.goto(BASE, { waitUntil: 'networkidle2' })
await esperar(600)
await pagina.evaluate(() =>
  document.querySelector('#sobre-mi')?.scrollIntoView({ behavior: 'instant', block: 'start' }),
)
await esperar(900)

const cuerpoPersonal = await texto()
revisar('reconoce al visitante de la misma ciudad', /y tú también/.test(cuerpoPersonal))

// Con otra zona horaria sí tiene que salir una distancia.
const lejos = await navegador.newPage()
await lejos.emulateTimezone('Europe/Madrid')
await lejos.evaluateOnNewDocument(() => localStorage.setItem('portafolio:idioma', 'es'))
await lejos.goto(BASE, { waitUntil: 'networkidle2' })
await lejos.evaluate(() =>
  document.querySelector('#sobre-mi')?.scrollIntoView({ behavior: 'instant', block: 'start' }),
)
await esperar(900)
const desdeMadrid = await lejos.evaluate(() => document.body.innerText)
const km = desdeMadrid.match(/a unos ([\d,]+) km de ti/)?.[1]
revisar('calcula la distancia hasta quien visita', Boolean(km), km ? `${km} km desde Madrid` : 'sin match')
// Madrid–CDMX son ~9,000 km. Un orden de magnitud fuera delataría un error
// de proyección o de unidades.
revisar(
  'la distancia tiene el orden correcto',
  km && Number(km.replaceAll(',', '')) > 8000 && Number(km.replaceAll(',', '')) < 10000,
)
await lejos.close()
revisar('dice que no usa la IP', cuerpoPersonal.includes('no con tu IP'))
revisar('muestra la hora local de Angel', /\d{1,2}:\d{2}/.test(cuerpoPersonal))

// Los contornos del lado oculto del globo se descartan, así que el número
// depende de hacia dónde esté girado. Lo que importa es que dibuje ambos.
const globo = await pagina.evaluate(() => ({
  tierra: document.querySelectorAll('#sobre-mi [data-tierra] path').length,
  reticula: document.querySelectorAll('#sobre-mi [data-reticula] path').length,
}))
revisar('el globo dibuja sus continentes', globo.tierra > 20, `${globo.tierra} contornos`)
revisar('el globo dibuja su retícula', globo.reticula > 10, `${globo.reticula} líneas`)

// Los ojos del avatar tienen que moverse al mover el cursor.
const antes = await pagina.evaluate(
  () => document.querySelector('#sobre-mi [data-pupilas]')?.getAttribute('style') ?? '',
)
await pagina.mouse.move(50, 50)
await esperar(500)
await pagina.mouse.move(1300, 750)
await esperar(700)
const despues = await pagina.evaluate(
  () => document.querySelector('#sobre-mi [data-pupilas]')?.getAttribute('style') ?? '',
)
revisar('los ojos del avatar siguen al cursor', antes !== despues)

// La credencial no sirve de nada si no se puede comprobar, y el texto no debe
// llamarla certificación: la página de verificación dice insignia de curso.
const credencial = await pagina.evaluate(() => {
  const a = [...document.querySelectorAll('#sobre-mi a')].find((n) =>
    (n.getAttribute('href') ?? '').includes('academy.claude.com'),
  )
  return a ? a.closest('div')?.textContent ?? '' : null
})
revisar('la credencial enlaza a su verificación', credencial !== null)
revisar('la credencial nombra el curso', /Claude Code 101/.test(credencial ?? ''))
revisar(
  'el sitio nunca llama certificación a la insignia',
  !/certificaci/i.test(cuerpoPersonal),
)
revisar('muestra la estatura en metros', /1\.72 m/.test(cuerpoPersonal))

// ----------------------------------------------------------------------- CV
console.log('\nCV')
await pagina.goto(BASE, { waitUntil: 'networkidle2' })
await esperar(600)
const cv = await pagina.evaluate(() => {
  const a = [...document.querySelectorAll('a')].find((n) =>
    (n.getAttribute('href') ?? '').endsWith('.pdf'),
  )
  return a ? { href: a.getAttribute('href'), descarga: a.hasAttribute('download') } : null
})
revisar('el botón de descargar CV aparece', cv !== null)
revisar('apunta a un PDF y se descarga', cv?.href?.endsWith('.pdf') && cv?.descarga)

const respuestaCv = await pagina.evaluate(
  async (url) => (await fetch(url)).status,
  `${BASE}/cv-angel-flores.pdf`,
)
revisar('el PDF existe y se sirve', respuestaCv === 200, String(respuestaCv))

// --------------------------------------------------------------- Recomendar
console.log('\nPágina de recomendar')
await pagina.goto(`${BASE}/recomendar`, { waitUntil: 'networkidle2' })
await esperar(600)

// window.open abriría WhatsApp de verdad; lo interceptamos para leer la URL.
await pagina.evaluate(() => {
  window.__abierto = null
  window.open = (url) => {
    window.__abierto = url
    return null
  }
})

const botonAntes = await pagina.evaluate(
  () => document.querySelector('button[type="submit"]')?.disabled,
)
revisar('el botón arranca deshabilitado', botonAntes === true)

await pagina.type('input[name="nombre"]', 'Angeles Ramírez')
await pagina.type('input[name="puesto"]', 'Tech Lead, Captación')
await pagina.type('input[name="empresa"]', 'Banco Azteca')
await pagina.type(
  'textarea[name="texto"]',
  'Tuve la oportunidad de trabajar con Angel y me gusta su compromiso y su habilidad para detectar bugs.',
)
await esperar(400)

const cuerpoForm = await texto()
revisar('la vista previa muestra lo que se escribe', cuerpoForm.includes('Angeles Ramírez'))
revisar('la vista previa muestra el puesto', cuerpoForm.includes('Tech Lead, Captación · Banco Azteca'))

const botonDespues = await pagina.evaluate(
  () => document.querySelector('button[type="submit"]')?.disabled,
)
revisar('el botón se habilita al completar', botonDespues === false)

await pagina.click('button[type="submit"]')
await esperar(300)
const abierto = await pagina.evaluate(() => window.__abierto)
revisar('el envío arma el enlace de WhatsApp', (abierto ?? '').includes('wa.me'))
revisar(
  'el mensaje lleva el texto y el puesto',
  decodeURIComponent(abierto ?? '').includes('Tech Lead') &&
    decodeURIComponent(abierto ?? '').includes('detectar bugs'),
)

// ------------------------------------------------------------------- Teclado
console.log('\nAccesibilidad')
await pagina.goto(BASE, { waitUntil: 'networkidle2' })
await esperar(500)

await pagina.keyboard.press('Tab')
const primerFoco = await pagina.evaluate(() => document.activeElement?.textContent?.trim())
revisar('el primer tab llega al salto de contenido', primerFoco?.includes('Saltar'), primerFoco)

let alcanzables = 0
for (let i = 0; i < 40; i++) {
  await pagina.keyboard.press('Tab')
  const visible = await pagina.evaluate(() => {
    const a = document.activeElement
    if (!a || a === document.body) return false
    const caja = a.getBoundingClientRect()
    return caja.width > 0 && caja.height > 0
  })
  if (visible) alcanzables++
}
revisar('la navegación por teclado recorre el sitio', alcanzables > 20, `${alcanzables} paradas`)

const sinAlt = await pagina.evaluate(
  () => [...document.querySelectorAll('img')].filter((i) => !i.alt).length,
)
revisar('ninguna imagen sin texto alternativo', sinAlt === 0)

// ------------------------------------------------------- Movimiento reducido
await pagina.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await pagina.goto(BASE, { waitUntil: 'networkidle2' })
await esperar(900)
const hayCanvas = await pagina.evaluate(() => Boolean(document.querySelector('canvas')))
revisar('con movimiento reducido no se monta WebGL', !hayCanvas)

// ------------------------------------------------------------------ Resumen
revisar('ningún error en consola', erroresConsola.length === 0, erroresConsola.join(' | '))

await navegador.close()

const fallas = resultados.filter((r) => !r.ok)
console.log(`\n${resultados.length - fallas.length}/${resultados.length} pruebas pasaron`)
if (fallas.length) {
  console.log('Fallaron:', fallas.map((f) => f.nombre).join(', '))
  process.exit(1)
}
