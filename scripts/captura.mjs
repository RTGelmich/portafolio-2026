// Captura pantallas del sitio para revisarlas sin abrir el navegador a mano.
//
// Uso: node scripts/captura.mjs <url> <salida.png> [ancho] [tema]
//
// No hay Chrome en esta máquina, se usa Brave (mismo motor). SwiftShader va
// porque el headless de Brave no trae GPU y sin él el hero sale en negro.
import puppeteer from 'puppeteer-core'

const NAVEGADOR = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'

const [url, salida, ancho = '1440', tema = 'oscuro', anclaje = ''] = process.argv.slice(2)

if (!url || !salida) {
  console.error('Uso: node scripts/captura.mjs <url> <salida.png> [ancho] [tema] [#anclaje]')
  process.exit(1)
}

const navegador = await puppeteer.launch({
  executablePath: NAVEGADOR,
  headless: true,
  args: ['--enable-unsafe-swiftshader', '--no-sandbox', '--hide-scrollbars'],
})

const pagina = await navegador.newPage()
await pagina.setViewport({
  width: Number(ancho),
  height: Number(ancho) < 600 ? 900 : 900,
  deviceScaleFactor: 2,
})

// El tema se decide antes del primer pixel, así que hay que sembrarlo antes de cargar.
await pagina.evaluateOnNewDocument((valor) => {
  localStorage.setItem('portafolio:tema', valor)
}, tema)

await pagina.goto(url, { waitUntil: 'networkidle2', timeout: 45000 })
await new Promise((resolver) => setTimeout(resolver, 2000))

if (anclaje) {
  await pagina.evaluate((selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, anclaje)
  await new Promise((resolver) => setTimeout(resolver, 800))
}

await pagina.screenshot({ path: salida })
await navegador.close()

console.log('OK →', salida)
