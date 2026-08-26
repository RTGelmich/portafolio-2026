import { Link } from 'react-router'

import { ui } from '../content/ui'
import { useIdioma } from '../i18n/idioma'

export function NoEncontrado() {
  const { t } = useIdioma()

  return (
    <section className="contenedor flex min-h-[60vh] flex-col items-start justify-center gap-4">
      <p className="eyebrow">404</p>
      <h1 className="text-3xl font-semibold tracking-tight">
        {t({ en: 'That page does not exist.', es: 'Esa página no existe.' })}
      </h1>
      <Link
        to="/"
        className="mt-2 inline-flex h-10 items-center rounded-full border border-borde px-5 text-sm text-tenue transition-colors hover:border-acento hover:text-tinta"
      >
        ← {t(ui.volver)}
      </Link>
    </section>
  )
}
