import { contacto } from '../content/contacto'
import { ui } from '../content/ui'
import { useIdioma } from '../i18n/idioma'
import { Avatar } from './Avatar'

export function PieDePagina() {
  const { t } = useIdioma()

  return (
    <footer className="border-t border-borde py-10">
      <div className="contenedor flex flex-col gap-4 text-sm text-tenue sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Aquí sí sigue al cursor en las páginas de caso, donde no está la
              rejilla personal. */}
          <Avatar className="w-12 shrink-0 cursor-pointer" />
          <a
            href={contacto.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-tinta"
          >
            {t(ui.pieContacto)}
          </a>
        </div>
        <p className="font-mono text-xs">
          © {new Date().getFullYear()} {contacto.nombre}
        </p>
      </div>
    </footer>
  )
}
