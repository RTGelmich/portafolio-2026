import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Idioma = 'en' | 'es'

/** Cualquier cadena del sitio vive en los dos idiomas o no vive. */
export type Bilingue = Record<Idioma, string>

const CLAVE = 'portafolio:idioma'

function idiomaInicial(): Idioma {
  if (typeof window === 'undefined') return 'en'

  const guardado = window.localStorage.getItem(CLAVE)
  if (guardado === 'en' || guardado === 'es') return guardado

  // Inglés por defecto: el objetivo son vacantes remotas internacionales.
  // Solo caemos a español si el navegador lo pide explícitamente.
  return window.navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en'
}

type Contexto = {
  idioma: Idioma
  cambiarIdioma: (siguiente: Idioma) => void
  /** Acepta también cadenas sueltas — los nombres propios no se traducen. */
  t: (texto: Bilingue | string) => string
}

const ContextoIdioma = createContext<Contexto | null>(null)

export function ProveedorIdioma({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Idioma>(idiomaInicial)

  useEffect(() => {
    document.documentElement.lang = idioma
    window.localStorage.setItem(CLAVE, idioma)
  }, [idioma])

  const cambiarIdioma = useCallback((siguiente: Idioma) => setIdioma(siguiente), [])

  const valor = useMemo<Contexto>(
    () => ({
      idioma,
      cambiarIdioma,
      t: (texto: Bilingue | string) =>
        typeof texto === 'string' ? texto : texto[idioma],
    }),
    [idioma, cambiarIdioma],
  )

  return <ContextoIdioma value={valor}>{children}</ContextoIdioma>
}

export function useIdioma(): Contexto {
  const contexto = use(ContextoIdioma)
  if (!contexto) throw new Error('useIdioma debe usarse dentro de <ProveedorIdioma>')
  return contexto
}
