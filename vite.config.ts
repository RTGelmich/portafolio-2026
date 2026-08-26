import { readFileSync } from 'node:fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/**
 * La URL canónica vive en src/content/sitio.ts, pero index.html la necesita
 * para og:image, og:url y el canonical. En vez de tenerla escrita en dos
 * lugares que se desincronizan, sustituimos el token %SITIO% al construir.
 */
function urlDelSitio(): Plugin {
  const fuente = readFileSync('src/content/sitio.ts', 'utf8')
  const url = fuente.match(/URL_SITIO\s*=\s*'([^']+)'/)?.[1]
  if (!url) throw new Error('No pude leer URL_SITIO de src/content/sitio.ts')

  return {
    name: 'url-del-sitio',
    transformIndexHtml: (html) => html.replaceAll('%SITIO%', url),
  }
}

export default defineConfig({
  // three y el shader no aparecen aquí a propósito: CampoWebGL se carga con
  // import() dinámico, así que Rollup ya le da su propio chunk y el texto del
  // hero se pinta sin esperarlo.
  plugins: [react(), tailwindcss(), urlDelSitio()],
})
