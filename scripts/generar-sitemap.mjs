// Genera public/sitemap.xml y public/robots.txt a partir de los proyectos
// reales. Se corre solo en `npm run build`, así que agregar un caso nuevo no
// deja el sitemap desactualizado.
import { readFileSync, writeFileSync } from 'node:fs'

// Los dos archivos se leen como texto en vez de importarlos: este script corre
// en Node sin transpilar y no vale la pena montar un pipeline para dos regex.
const sitio = readFileSync('src/content/sitio.ts', 'utf8')
const URL_SITIO = sitio.match(/URL_SITIO\s*=\s*'([^']+)'/)?.[1]
if (!URL_SITIO) throw new Error('No pude leer URL_SITIO de src/content/sitio.ts')

const proyectos = readFileSync('src/content/proyectos.ts', 'utf8')
const slugs = [...proyectos.matchAll(/^\s{4}slug:\s*'([^']+)'/gm)].map((m) => m[1])
if (slugs.length === 0) throw new Error('No encontré ningún slug en proyectos.ts')

const hoy = new Date().toISOString().slice(0, 10)
const rutas = ['/', ...slugs.map((slug) => `/trabajo/${slug}`)]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rutas
  .map(
    (ruta) =>
      `  <url>\n    <loc>${URL_SITIO}${ruta}</loc>\n    <lastmod>${hoy}</lastmod>\n  </url>`,
  )
  .join('\n')}
</urlset>
`

writeFileSync('public/sitemap.xml', xml)
writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${URL_SITIO}/sitemap.xml\n`)

console.log(`sitemap: ${rutas.length} rutas (${slugs.length} proyectos) → ${URL_SITIO}`)
