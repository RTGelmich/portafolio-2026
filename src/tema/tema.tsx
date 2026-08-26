import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Tema = 'claro' | 'oscuro'

const CLAVE = 'portafolio:tema'

function temaInicial(): Tema {
  if (typeof window === 'undefined') return 'oscuro'

  const guardado = window.localStorage.getItem(CLAVE)
  if (guardado === 'claro' || guardado === 'oscuro') return guardado

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'claro' : 'oscuro'
}

type Contexto = {
  tema: Tema
  alternarTema: () => void
}

const ContextoTema = createContext<Contexto | null>(null)

export function ProveedorTema({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(temaInicial)

  useEffect(() => {
    document.documentElement.dataset.tema = tema
    document.documentElement.style.colorScheme = tema === 'claro' ? 'light' : 'dark'
    window.localStorage.setItem(CLAVE, tema)
  }, [tema])

  const alternarTema = useCallback(
    () => setTema((actual) => (actual === 'oscuro' ? 'claro' : 'oscuro')),
    [],
  )

  const valor = useMemo(() => ({ tema, alternarTema }), [tema, alternarTema])

  return <ContextoTema value={valor}>{children}</ContextoTema>
}

export function useTema(): Contexto {
  const contexto = use(ContextoTema)
  if (!contexto) throw new Error('useTema debe usarse dentro de <ProveedorTema>')
  return contexto
}
