import { contacto } from '../content/contacto'
import { ui } from '../content/ui'
import { useIdioma } from '../i18n/idioma'

export function PieDePagina() {
  const { t } = useIdioma()

  return (
    <footer className="border-t border-borde py-10">
      <div className="contenedor flex flex-col gap-3 text-sm text-tenue sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md text-pretty">{t(ui.hechoCon)}</p>
        <p className="font-mono text-xs">
          © {new Date().getFullYear()} {contacto.nombre}
        </p>
      </div>
    </footer>
  )
}
