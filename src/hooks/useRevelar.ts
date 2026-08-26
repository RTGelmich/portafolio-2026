import { useEffect, useRef, useState } from 'react'

/**
 * Marca un elemento como visible la primera vez que entra en pantalla, para
 * animar su entrada.
 *
 * Se desconecta en cuanto dispara: revelar es de una sola vez. Un elemento que
 * se re-anima cada vez que subes y bajas cansa a los tres scrolls.
 */
export function useRevelar<T extends HTMLElement = HTMLDivElement>(margen = '0px 0px -12% 0px') {
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
