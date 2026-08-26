# Portafolio — Angel Flores

Portafolio personal. La idea que manda sobre todo lo demás: **cada caso de estudio trae una
demo funcional de la parte más difícil del proyecto**, no una captura de algo que sirvió una vez.
Quien lo visita puede meter la mano en el problema real.

## Resultados

| Métrica | Escritorio | Móvil (4G simulado) |
|---|---|---|
| Performance | 100 | 99 |
| Accessibility | 100 | 100 |
| Best practices | 100 | 100 |
| SEO | 100 | 100 |
| First Contentful Paint | 0.3 s | 1.4 s |
| Total Blocking Time | 30 ms | 0 ms |
| Cumulative Layout Shift | 0.017 | 0 |

JavaScript inicial: **90 kB comprimidos**. El resto viaja bajo demanda.

## Las seis demos

| Caso | Qué puedes hacer |
|---|---|
| Gladiadores Playa | Escanear a un socio y ver el anti-passback rechazar el segundo intento |
| Distribuidora de gas | Facturar mil recibos y ver el saldo descuadrarse por el redondeo bancario |
| Banco Azteca | Ver a escala y a ritmo real cómo se ve un día de aperturas de cuenta |
| CIPROMEX | Contestar preguntas hasta pegar contra el paywall del plan gratis |
| EXPRESS | Escribirle al bot de FAQ y ver cómo se niega a hablar de precios |
| Sandate Consultores | Encender y apagar row level security sobre la misma consulta |

## Stack

React 19 · TypeScript · Vite · Tailwind v4 · React Router · WebGL sin librerías

Sin backend, sin base de datos, sin dependencias de terceros en tiempo de ejecución.

## Decisiones que vale la pena conocer

**El hero es WebGL crudo, sin three.js.** Traer una librería de escenas 3D para dibujar dos
triángulos con un fragment shader costaba 236 kB comprimidos — más que todo el resto del sitio
junto — a cambio de nada que aquí se use: no hay cámara, ni luces, ni geometría, ni grafo de
escena. Ver `src/hero/CampoWebGL.tsx`, son unas 120 líneas.

**El canvas se crea dentro del efecto, no en el JSX.** La limpieza libera el contexto WebGL, y un
contexto liberado no se recupera. Si React reusara el mismo `<canvas>` en un segundo montaje
—cosa que hace en StrictMode— el shader intentaría compilar sobre un contexto muerto y fallaría
con un log vacío, que es exactamente el tipo de bug que se lleva una tarde entera.

**Sin WebGL o con "reducir movimiento", el canvas ni se monta.** Queda un degradado estático que
es un fondo digno por sí solo. La prueba automatizada verifica que así sea.

**El chunk de `three` no existe, pero el patrón sí importa:** `src/hero/puntero.ts` no importa
nada a propósito, porque lo usa el Hero, que sí va en el bundle inicial. Un solo import pesado
ahí anularía el `import()` dinámico del campo.

**`react/only-export-components` está apagado** en `.oxlintrc.json`. La regla existe para Fast
Refresh, y co-locar un contexto con su hook es el patrón idiomático de React; el costo es una
recarga completa al editar esos dos archivos concretos.

## Comandos

```bash
npm run dev       # servidor de desarrollo
npm run build     # genera sitemap + typecheck + build
npm run preview   # sirve el build de producción
npm run lint
npm run probar    # 26 pruebas e2e sobre los seis widgets, teclado y reduced-motion
npm run og        # regenera public/og.png
```

`npm run probar` necesita el sitio corriendo. Contra el build de producción:

```bash
npm run build && npm run preview -- --port 4173
npm run probar -- http://localhost:4173
```

No hay Chrome en la máquina de desarrollo: los scripts usan **Brave** (mismo motor). La ruta está
al inicio de `scripts/captura.mjs` y `scripts/probar.mjs`.

## Pendientes

Buscar `TODO(angel)` en el código. Al día de hoy:

- `src/content/contacto.ts` — perfil de LinkedIn y PDF del CV. Sin ellos, esas tarjetas y el
  botón de descarga simplemente no se pintan.
- `src/content/sitio.ts` — cambiar la URL canónica cuando haya dominio propio.
- `src/content/ui.ts` — años de experiencia en la bajada del hero.
