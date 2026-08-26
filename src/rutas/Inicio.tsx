import { Contacto } from '../componentes/Contacto'
import { Hero } from '../componentes/Hero'
import { RejillaPersonal } from '../componentes/RejillaPersonal'
import { Revelar } from '../componentes/Revelar'
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
          <Revelar>
            <p className="eyebrow">{t(ui.seccionTrabajoEyebrow)}</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {t(ui.seccionTrabajoTitulo)}
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-tenue">{t(ui.seccionTrabajoBajada)}</p>
          </Revelar>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {proyectos.map((proyecto, indice) => (
              // El retraso escalona solo dentro de la fila: en móvil, con una
              // columna, esperar 5 turnos para la última tarjeta se sentiría lento.
              <Revelar key={proyecto.slug} retraso={(indice % 2) * 90} className="flex">
                <TarjetaProyecto proyecto={proyecto} indice={indice} />
              </Revelar>
            ))}
          </div>
        </div>
      </section>

      <RejillaPersonal />

      <Contacto />
    </>
  )
}
