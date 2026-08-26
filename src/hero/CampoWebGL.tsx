import { useEffect, useRef, type RefObject } from 'react'

import { useTema, type Tema } from '../tema/tema'
import { fragmentShader, vertexShader } from './campo.glsl'
import { DECAIMIENTO_CURSOR, DURACION_ONDA, type EstadoPuntero } from './puntero'

/**
 * WebGL crudo, sin three ni react-three-fiber.
 *
 * Traer una librería de escenas 3D para dibujar dos triángulos con un fragment
 * shader costaba 236 kB comprimidos — más que todo el resto del sitio junto —
 * a cambio de nada que aquí se use: no hay cámara, ni luces, ni geometría, ni
 * grafo de escena. Esto son ~120 líneas y pesa lo que pesa el shader.
 */

/** La paleta vive en JS porque el shader necesita RGB y el tema está en oklch. */
const paletas: Record<Tema, { fondo: [number, number, number]; a: [number, number, number]; b: [number, number, number]; intensidad: number }> = {
  oscuro: {
    fondo: [0.075, 0.075, 0.098],
    a: [0.373, 0.49, 1.0],
    b: [0.659, 0.427, 1.0],
    intensidad: 0.85,
  },
  // En claro hay que ir al revés que en oscuro: sobre un fondo casi blanco,
  // un acento pálido y de baja intensidad simplemente no se ve. Van colores
  // más saturados; el texto lo sigue protegiendo el degradado de la izquierda.
  claro: {
    fondo: [0.957, 0.957, 0.973],
    a: [0.353, 0.443, 0.925],
    b: [0.612, 0.404, 0.906],
    intensidad: 0.78,
  },
}

function compilar(gl: WebGLRenderingContext, tipo: number, fuente: string): WebGLShader | null {
  const shader = gl.createShader(tipo)
  if (!shader) return null

  gl.shaderSource(shader, fuente)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // Un shader que no compila deja el hero en negro sin ninguna pista.
    console.error('Shader del hero:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

export default function CampoWebGL({
  puntero,
  activo,
}: {
  puntero: RefObject<EstadoPuntero>
  /** Cuando el hero sale de pantalla dejamos de renderizar por completo. */
  activo: boolean
}) {
  const { tema } = useTema()
  const contenedor = useRef<HTMLDivElement>(null)

  // El bucle de render lee el tema y la actividad de refs para no reiniciar
  // WebGL en cada cambio: recompilar el shader al alternar el tema se vería
  // como un parpadeo. Se escriben en efectos, no durante el render.
  const temaRef = useRef(tema)
  const activoRef = useRef(activo)

  useEffect(() => {
    temaRef.current = tema
  }, [tema])

  useEffect(() => {
    activoRef.current = activo
  }, [activo])

  useEffect(() => {
    const padre = contenedor.current
    if (!padre) return

    // El canvas se crea aquí y no en el JSX a propósito. La limpieza tiene que
    // liberar el contexto WebGL, y un contexto liberado no se puede recuperar:
    // si React reusara el mismo <canvas> en un segundo montaje —cosa que hace
    // en StrictMode— el shader intentaría compilar sobre un contexto muerto y
    // fallaría con un log vacío. Canvas nuevo por montaje, sin sorpresas.
    const nodo = document.createElement('canvas')
    nodo.className = 'absolute inset-0 size-full'
    padre.appendChild(nodo)

    const gl = nodo.getContext('webgl', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    if (!gl) return

    const vs = compilar(gl, gl.VERTEX_SHADER, vertexShader)
    const fs = compilar(gl, gl.FRAGMENT_SHADER, fragmentShader)
    if (!vs || !fs) return

    const programa = gl.createProgram()
    if (!programa) return

    gl.attachShader(programa, vs)
    gl.attachShader(programa, fs)
    gl.linkProgram(programa)

    if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) {
      console.error('Programa del hero:', gl.getProgramInfoLog(programa))
      return
    }

    gl.useProgram(programa)

    // Dos triángulos que cubren el clip space entero. Nada más que dibujar.
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    )

    const posicion = gl.getAttribLocation(programa, 'aPosicion')
    gl.enableVertexAttribArray(posicion)
    gl.vertexAttribPointer(posicion, 2, gl.FLOAT, false, 0, 0)

    const u = {
      tiempo: gl.getUniformLocation(programa, 'uTiempo'),
      resolucion: gl.getUniformLocation(programa, 'uResolucion'),
      cursor: gl.getUniformLocation(programa, 'uCursor'),
      cursorFuerza: gl.getUniformLocation(programa, 'uCursorFuerza'),
      onda: gl.getUniformLocation(programa, 'uOnda'),
      ondaOrigen: gl.getUniformLocation(programa, 'uOndaOrigen'),
      colorA: gl.getUniformLocation(programa, 'uColorA'),
      colorB: gl.getUniformLocation(programa, 'uColorB'),
      colorFondo: gl.getUniformLocation(programa, 'uColorFondo'),
      intensidad: gl.getUniformLocation(programa, 'uIntensidad'),
    }

    // Retina completa en un shader a pantalla completa quema batería sin ganar
    // nada visible: el campo es suave por definición.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    function redimensionar() {
      if (!gl) return
      const ancho = Math.round(nodo.clientWidth * dpr)
      const alto = Math.round(nodo.clientHeight * dpr)
      if (nodo.width === ancho && nodo.height === alto) return
      nodo.width = ancho
      nodo.height = alto
      gl.viewport(0, 0, ancho, alto)
    }

    const observador = new ResizeObserver(redimensionar)
    observador.observe(nodo)
    redimensionar()

    const inicio = performance.now()
    let cursorX = 0.5
    let cursorY = 0.5
    let fuerzaSuave = 0
    let anterior = inicio
    let cuadro = 0

    function dibujar(ahora: number) {
      cuadro = requestAnimationFrame(dibujar)
      if (!gl) return

      // Fuera de pantalla no hay nada que animar, pero seguimos pidiendo frames
      // baratos para reaccionar en cuanto el hero vuelva a ser visible.
      if (!activoRef.current) return

      const delta = Math.min((ahora - anterior) / 1000, 0.1)
      anterior = ahora

      const p = puntero.current
      const paleta = paletas[temaRef.current]

      // Suavizado independiente del framerate: a 30fps se siente igual que a 120.
      const suavizado = 1 - Math.pow(0.0015, delta)
      cursorX += (p.cursor.x - cursorX) * suavizado
      cursorY += (p.cursor.y - cursorY) * suavizado

      const desdeMovimiento = (ahora - p.ultimoMovimiento) / 1000
      const fuerza = Math.max(0, 1 - desdeMovimiento / DECAIMIENTO_CURSOR)
      fuerzaSuave += (fuerza - fuerzaSuave) * suavizado

      const desdeOnda = p.ondaInicio < 0 ? -1 : (ahora - p.ondaInicio) / 1000
      const onda = desdeOnda >= 0 && desdeOnda <= DURACION_ONDA ? desdeOnda : -1

      gl.uniform1f(u.tiempo, (ahora - inicio) / 1000)
      gl.uniform2f(u.resolucion, nodo.width, nodo.height)
      gl.uniform2f(u.cursor, cursorX, cursorY)
      gl.uniform1f(u.cursorFuerza, fuerzaSuave)
      gl.uniform1f(u.onda, onda)
      gl.uniform2f(u.ondaOrigen, p.ondaOrigen.x, p.ondaOrigen.y)
      gl.uniform3fv(u.colorA, paleta.a)
      gl.uniform3fv(u.colorB, paleta.b)
      gl.uniform3fv(u.colorFondo, paleta.fondo)
      gl.uniform1f(u.intensidad, paleta.intensidad)

      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    cuadro = requestAnimationFrame(dibujar)

    return () => {
      cancelAnimationFrame(cuadro)
      observador.disconnect()
      gl.deleteBuffer(buffer)
      gl.deleteProgram(programa)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      // Sin esto, navegar de ida y vuelta va acumulando contextos hasta que el
      // navegador empieza a matar los viejos.
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      nodo.remove()
    }
  }, [puntero])

  return <div ref={contenedor} className="absolute inset-0" aria-hidden="true" />
}
