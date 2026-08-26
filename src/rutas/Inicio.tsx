import { Contacto } from '../componentes/Contacto'
import { Hero } from '../componentes/Hero'
import { TarjetaProyecto } from '../componentes/TarjetaProyecto'
import { contacto } from '../content/contacto'
import { proyectos } from '../content/proyectos'
import { ui } from '../content/ui'
import { useMeta } from '../hooks/useMeta'
import { useIdioma } from '../i18n/idioma'

export function Inicio() {
  const { t } = useIdioma()

  useMeta({
    titulo: `${contacto.nombre} — ${t(ui.heroRol)}`,
    descripcion: t(ui.heroBajada),
  })

  return (
    <>
      <Hero />

      <section id="trabajo" className="scroll-mt-24 border-t border-borde py-20 sm:py-28">
        <div className="contenedor">
          <p className="eyebrow">{t(ui.seccionTrabajoEyebrow)}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {t(ui.seccionTrabajoTitulo)}
          </h2>
          <p className="mt-4 max-w-xl text-pretty text-tenue">{t(ui.seccionTrabajoBajada)}</p>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {proyectos.map((proyecto, indice) => (
              <TarjetaProyecto key={proyecto.slug} proyecto={proyecto} indice={indice} />
            ))}
          </div>
        </div>
      </section>

      <Contacto />
    </>
  )
}
