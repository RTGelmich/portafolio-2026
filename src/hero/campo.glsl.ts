/**
 * Shader del hero. Un quad a pantalla completa con ruido simplex encadenado
 * (domain warping) que el cursor empuja y el clic sacude con una onda.
 *
 * GLSL ES 1.0 (WebGL 1) a propósito: es lo que corre en absolutamente todo,
 * y este efecto no necesita nada de WebGL 2.
 */

export const vertexShader = /* glsl */ `
  attribute vec2 aPosicion;
  varying vec2 vUv;

  void main() {
    // El quad va de -1 a 1 en clip space; vUv sale de ahí sin matrices.
    vUv = aPosicion * 0.5 + 0.5;
    gl_Position = vec4(aPosicion, 0.0, 1.0);
  }
`

export const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTiempo;
  uniform vec2  uResolucion;
  uniform vec2  uCursor;        // 0..1, Y creciendo hacia arriba
  uniform float uCursorFuerza;  // 0..1, decae solo cuando el cursor se detiene
  uniform float uOnda;          // segundos desde el clic; negativo = sin onda
  uniform vec2  uOndaOrigen;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform vec3  uColorFondo;
  uniform float uIntensidad;

  // -- Ruido simplex 2D (Ashima / Stefan Gustavson) --------------------------
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float suma = 0.0;
    float amplitud = 0.5;
    for (int i = 0; i < 4; i++) {
      suma += amplitud * snoise(p);
      p *= 2.02;
      amplitud *= 0.5;
    }
    return suma;
  }

  void main() {
    // Corregimos aspecto para que el campo no se estire en pantallas anchas.
    float aspecto = uResolucion.x / max(uResolucion.y, 1.0);
    vec2 p = vec2((vUv.x - 0.5) * aspecto, vUv.y - 0.5);

    float t = uTiempo * 0.06;

    // Domain warping: el ruido desplaza las coordenadas de otro ruido.
    vec2 q = vec2(fbm(p * 0.9 + vec2(0.0, t)),
                  fbm(p * 0.9 + vec2(4.3, -t)));

    // El cursor empuja el campo: un pozo suave que sigue al puntero.
    vec2 cursor = vec2((uCursor.x - 0.5) * aspecto, uCursor.y - 0.5);
    vec2 haciaCursor = p - cursor;
    float pozo = uCursorFuerza * 0.35 * exp(-length(haciaCursor) * 3.2);
    q += normalize(haciaCursor + 1e-5) * pozo;

    // Onda del clic: un anillo que se expande y se apaga.
    if (uOnda >= 0.0) {
      vec2 origen = vec2((uOndaOrigen.x - 0.5) * aspecto, uOndaOrigen.y - 0.5);
      float d = length(p - origen);
      float radio = uOnda * 0.9;
      float anillo = exp(-pow((d - radio) * 6.0, 2.0));
      float vida = max(0.0, 1.0 - uOnda / 1.6);
      q += normalize(p - origen + 1e-5) * anillo * vida * 0.5;
    }

    float valor = fbm(p * 1.15 + q * 0.95 + vec2(t * 0.5, 0.0)) * 0.5 + 0.5;

    // El matiz recorre su rango DENTRO de la banda visible, y por eso arranca
    // MÁS ARRIBA que el umbral de visibilidad. Con un rango que empiece antes,
    // el primer acento cae donde la mezcla todavía vale casi cero y el campo
    // se ve de un solo color por más que haya dos declarados.
    vec3 color = mix(uColorA, uColorB, smoothstep(0.52, 0.86, valor));
    color = mix(uColorFondo, color, smoothstep(0.30, 0.86, valor) * uIntensidad);

    // Viñeta: apaga las orillas para que el encabezado y el texto respiren.
    color = mix(uColorFondo, color, smoothstep(1.45, 0.15, length(p)));

    // Grano fino. Sin esto los degradados suaves hacen bandas en pantallas de 8 bits.
    float grano = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grano - 0.5) * 0.015;

    gl_FragColor = vec4(color, 1.0);
  }
`
