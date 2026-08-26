import { Link, useLocation } from 'react-router'

import { ui } from '../content/ui'
import { useIdioma } from '../i18n/idioma'
import { useTema } from '../tema/tema'
import { Logo } from './Logo'

function IconoSol() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconoLuna() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" strokeLinejoin="round" />
    </svg>
  )
}

const boton =
  'inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-full border border-borde ' +
  'text-[13px] text-tenue transition-colors duration-200 hover:text-tinta hover:border-acento'

export function Encabezado() {
  const { idioma, cambiarIdioma, t } = useIdioma()
  const { tema, alternarTema } = useTema()
  const { pathname } = useLocation()
  const enInicio = pathname === '/'

  return (
    <header className="sticky top-0 z-50 border-b border-borde bg-lienzo/85 backdrop-blur-md">
      <div className="contenedor flex h-16 items-center justify-between gap-4">
        {/* Sin aria-label: el texto visible ya es un buen nombre accesible, y
            uno distinto rompería la coincidencia que exige WCAG 2.5.3. En
            pantallas muy angostas el texto se oculta con sr-only y no con
            hidden, para que el enlace nunca se quede sin nombre. */}
        <Link
          to="/"
          className="grupo-marca flex items-center gap-2.5 text-tinta transition-opacity hover:opacity-80"
        >
          <Logo className="h-5 w-auto" />
          <span className="font-mono text-sm font-medium tracking-tight max-[380px]:sr-only">
            angel<span className="text-acento">.</span>flores
          </span>
        </Link>

        <nav className="flex items-center gap-2" aria-label={t(ui.navTrabajo)}>
          {!enInicio && (
            <Link to="/" className={`${boton} max-sm:hidden`}>
              ← {t(ui.volver)}
            </Link>
          )}

          {/* Contacto se queda visible también en móvil: es la acción que
              queremos que sea fácil. El "volver" no, porque el logo ya lleva
              a la portada. */}
          <a href="/#sobre-mi" className={`${boton} max-sm:hidden`}>
            {t(ui.navSobreMi)}
          </a>

          <a href="/#contacto" className={boton}>
            {t(ui.navContacto)}
          </a>

          <button
            type="button"
            onClick={() => cambiarIdioma(idioma === 'en' ? 'es' : 'en')}
            className={`${boton} font-mono`}
            aria-label={t(ui.cambiarIdioma)}
          >
            <span aria-hidden="true">{idioma === 'en' ? 'EN' : 'ES'}</span>
          </button>

          <button
            type="button"
            onClick={alternarTema}
            className={`${boton} w-9 px-0`}
            aria-label={t(ui.cambiarTema)}
            aria-pressed={tema === 'claro'}
          >
            {tema === 'oscuro' ? <IconoLuna /> : <IconoSol />}
          </button>
        </nav>
      </div>
    </header>
  )
}
