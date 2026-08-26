import { useEffect } from 'react'

/**
 * Título y descripción por ruta.
 *
 * Es una SPA, así que sin esto todas las páginas comparten el <title> del
 * index.html: las pestañas del navegador se vuelven indistinguibles y los
 * enlaces compartidos muestran siempre lo mismo.
 */
export function useMeta({ titulo, descripcion }: { titulo: string; descripcion: string }) {
  useEffect(() => {
    document.title = titulo

    const fijar = (selector: string, valor: string) => {
      const etiqueta = document.head.querySelector<HTMLMetaElement>(selector)
      if (etiqueta) etiqueta.content = valor
    }

    fijar('meta[name="description"]', descripcion)
    fijar('meta[property="og:title"]', titulo)
    fijar('meta[property="og:description"]', descripcion)
  }, [titulo, descripcion])
}
