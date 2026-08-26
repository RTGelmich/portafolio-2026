// Genera public/og.png (1200x630), la imagen que sale cuando alguien pega el
// enlace en LinkedIn, Slack o WhatsApp. Sin ella el enlace se ve vacío, que es
// justo lo contrario de lo que queremos al mandarlo a un reclutador.
//
// Uso: node scripts/generar-og.mjs
import { writeFileSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import puppeteer from 'puppeteer-core'

const NAVEGADOR = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'

const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: #131319;
    background-image:
      radial-gradient(120% 90% at 18% 12%, rgba(95, 125, 255, 0.30), transparent 62%),
      radial-gradient(100% 80% at 88% 84%, rgba(168, 109, 255, 0.26), transparent 58%);
    color: #f1f1f5;
    font-family: -apple-system, system-ui, sans-serif;
    padding: 76px 80px;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .marca {
    display: flex; align-items: center; gap: 14px;
    font-family: ui-monospace, Menlo, monospace; font-size: 20px; color: #9a9aa8;
  }
  .marca b { color: #f1f1f5; font-weight: 500; }
  .punto { color: #6f8cff; }
  h1 { font-size: 66px; line-height: 1.06; letter-spacing: -0.025em; font-weight: 600; max-width: 950px; }
  p { margin-top: 22px; font-size: 26px; line-height: 1.45; color: #9a9aa8; max-width: 800px; }
  .pie { display: flex; gap: 12px; flex-wrap: wrap; }
  .chip {
    font-family: ui-monospace, Menlo, monospace; font-size: 17px; color: #9a9aa8;
    border: 1px solid #3a3a48; border-radius: 8px; padding: 7px 14px;
  }
</style></head>
<body>
  <div class="marca">
    <svg viewBox="0 0 40 32" height="30" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 28 L13 4 L23 28" stroke="#f1f1f5"/>
      <path d="M7.6 20 L18.4 20" stroke="#f1f1f5"/>
      <path d="M23 28 L23 4 L36 4" stroke="#6f8cff"/>
      <path d="M23 15.5 L32 15.5" stroke="#6f8cff"/>
    </svg>
    <span>angel<span class="punto">.</span><b>flores</b> — full-stack engineer</span>
  </div>
  <div>
    <h1>I ship systems people actually run their business on.</h1>
    <p>Six case studies. Every one of them playable.</p>
  </div>
  <div class="pie">
    <span class="chip">React</span>
    <span class="chip">TypeScript</span>
    <span class="chip">PostgreSQL</span>
    <span class="chip">Next.js</span>
    <span class="chip">Supabase</span>
    <span class="chip">WebGL</span>
  </div>
</body>
</html>`

const temporal = join(tmpdir(), `og-${Date.now()}.html`)
writeFileSync(temporal, html)

const navegador = await puppeteer.launch({
  executablePath: NAVEGADOR,
  headless: true,
  args: ['--no-sandbox'],
})

const pagina = await navegador.newPage()
await pagina.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
await pagina.goto(`file://${temporal}`, { waitUntil: 'networkidle0' })
await pagina.screenshot({ path: 'public/og.png' })

await navegador.close()
unlinkSync(temporal)

console.log('OK → public/og.png (1200x630)')
