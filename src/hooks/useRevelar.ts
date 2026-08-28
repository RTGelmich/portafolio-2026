import { useEffect, useRef, useState } from 'react'

/**
 * Marca un elemento como visible la primera vez que entra en pantalla, para
 * animar su entrada.
 *
 * Se desconecta en cuanto dispara: revelar es de una sola vez. Un elemento que
 * se re-anima cada vez que subes y bajas cansa a los tres scrolls.
 *
 * El margen por omisión es POSITIVO a propósito: extiende la caja de detección
 * por debajo del viewport, así el elemento empieza a aparecer antes de que se
 * vea. Con un margen negativo —que fue el primer intento— tenía que meterse un
 * 12% en pantalla para siquiera empezar, y quien baja rápido le ganaba a la
 * animación y veía tarjetas en blanco. Eso es justo lo que se siente lento.
 */
export function useRevelar<T extends HTMLElement = HTMLDivElement>(margen = '0px 0px 20% 0px') {
  const referencia = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const nodo = referencia.current
    if (!nodo) return

    // Sin IntersectionObserver, o si el usuario pidió menos movimiento, el
    // contenido aparece y ya. Nunca se queda invisible por una animación que
    // no llegó a correr.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return
        setVisible(true)
        observador.disconnect()
      },
      { rootMargin: margen },
    )

    observador.observe(nodo)
    return () => observador.disconnect()
  }, [margen])

  return { referencia, visible }
}
