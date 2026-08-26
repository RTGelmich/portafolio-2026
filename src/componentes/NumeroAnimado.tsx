import { useEffect, useState } from 'react'

import { useRevelar } from '../hooks/useRevelar'
import { useIdioma } from '../i18n/idioma'

/**
 * Cuenta hacia arriba una métrica cuando entra en pantalla.
 *
 * Las métricas no son números limpios: hay "<75ms", "10,850", "87%", "1000s" y
 * también "Nacional", que no tiene número alguno. Separamos prefijo, número y
 * sufijo, y si no hay número que animar se pinta el texto tal cual.
 */
const PARTES = /^([^\d]*)([\d,]+)(.*)$/

const DURACION = 900

export function NumeroAnimado({ valor }: { valor: string }) {
  const { idioma } = useIdioma()
  // Sin margen negativo, al revés que las secciones: el contador tiene que
  // arrancar en cuanto el número toca la pantalla. Con margen, la tarjeta se
  // ve completa mientras la métrica sigue diciendo 0, que es información falsa.
  const { referencia, visible } = useRevelar<HTMLSpanElement>('0px')
  const [mostrado, setMostrado] = useState(0)

  const partes = PARTES.exec(valor)
  // Solo separador de millares; ninguna métrica del sitio usa decimales.
  const destino = partes ? Number(partes[2].replaceAll(',', '')) : Number.NaN
  const animable = partes !== null && Number.isFinite(destino)

  useEffect(() => {
    if (!animable || !visible) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMostrado(destino)
      return
    }

    const inicio = performance.now()
    let cuadro = 0

    const paso = (ahora: number) => {
      const avance = Math.min((ahora - inicio) / DURACION, 1)
      // easeOutExpo: arranca rápido y frena al final, que es como se siente
      // un contador "aterrizando" en su cifra.
      const suave = avance === 1 ? 1 : 1 - Math.pow(2, -10 * avance)
      setMostrado(Math.round(destino * suave))
      if (avance < 1) cuadro = requestAnimationFrame(paso)
    }

    cuadro = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(cuadro)
  }, [animable, visible, destino])

  if (!animable) return <span ref={referencia}>{valor}</span>

  const formateado = new Intl.NumberFormat(idioma === 'es' ? 'es-MX' : 'en-US').format(mostrado)

  // El lector de pantalla anuncia la cifra final, nunca el conteo: oír
  // "cero, uno, dos, tres…" no le sirve a nadie.
  //
  // Va como texto oculto y no como aria-label porque un <span> no tiene rol, y
  // ARIA prohíbe aria-label en elementos sin rol: los lectores de pantalla no
  // están obligados a respetarlo.
  return (
    <span ref={referencia} className="tabular-nums">
      <span className="sr-only">{valor}</span>
      <span aria-hidden="true">
        {partes[1]}
        {formateado}
        {partes[3]}
      </span>
    </span>
  )
}
