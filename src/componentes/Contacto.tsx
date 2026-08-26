import { contacto } from '../content/contacto'
import { ui } from '../content/ui'
import { useIdioma } from '../i18n/idioma'

export function Contacto() {
  const { t } = useIdioma()

  // Los que aún no tienen dato (LinkedIn) simplemente no se pintan.
  const enlaces = [
    { etiqueta: 'WhatsApp', valor: contacto.whatsappVisible, href: contacto.whatsappUrl, principal: true },
    { etiqueta: 'Email', valor: contacto.email, href: `mailto:${contacto.email}`, principal: false },
    { etiqueta: 'GitHub', valor: contacto.githubVisible, href: contacto.githubUrl, principal: false },
    { etiqueta: 'LinkedIn', valor: contacto.linkedinVisible, href: contacto.linkedinUrl, principal: false },
  ].filter((enlace) => enlace.valor && enlace.href)

  return (
    <section id="contacto" className="scroll-mt-24 border-t border-borde py-24">
      <div className="contenedor">
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {t(ui.contactoTitulo)}
        </h2>
        <p className="mt-4 max-w-xl text-tenue">{t(ui.contactoBajada)}</p>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {enlaces.map((enlace) => (
            <li key={enlace.etiqueta}>
              <a
                href={enlace.href}
                target={enlace.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                className={`group flex items-center justify-between gap-4 rounded-xl border px-5 py-4 transition-colors duration-200 ${
                  enlace.principal
                    ? 'border-acento/50 bg-acento/8 hover:bg-acento/15'
                    : 'border-borde hover:border-acento/60'
                }`}
              >
                <span>
                  <span className="eyebrow block">{enlace.etiqueta}</span>
                  <span className="mt-1 block font-mono text-sm text-tinta">{enlace.valor}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-tenue transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-acento"
                >
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
