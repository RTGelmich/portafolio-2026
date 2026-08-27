import { useState } from 'react'

import { TarjetaResena } from '../componentes/TarjetaResena'
import { contacto } from '../content/contacto'
import type { Resena } from '../content/resenas'
import { ui } from '../content/ui'
import { useMeta } from '../hooks/useMeta'
import { useIdioma } from '../i18n/idioma'

/**
 * Página que Angel le pasa a quien quiera recomendarlo.
 *
 * **No hay base de datos a propósito.** Un formulario abierto que escribe
 * directo a la sección pública de un portafolio de búsqueda de empleo es un
 * blanco obvio, y montar una cola de moderación para las cinco o diez
 * recomendaciones que va a recibir en su vida es construir un sistema para un
 * problema que no tiene.
 *
 * Lo que hace: arma el mensaje ya formateado y lo abre en WhatsApp. Angel lo
 * recibe, lo lee y lo publica. La aprobación es él, no una columna booleana.
 */

const LIMITE_TEXTO = 600

export function Recomendar() {
  const { t, idioma } = useIdioma()

  useMeta({
    titulo: `${t(ui.recomendarTitulo)} — ${contacto.nombre}`,
    descripcion: t(ui.recomendarBajada),
  })

  const [nombre, setNombre] = useState('')
  const [puesto, setPuesto] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [texto, setTexto] = useState('')

  const vistaPrevia: Resena = {
    nombre,
    puesto,
    empresa: empresa || undefined,
    linkedin: linkedin || undefined,
    texto,
    idioma,
    fecha: new Date().toISOString().slice(0, 7),
    aprobada: true,
  }

  const listo = nombre.trim().length > 1 && puesto.trim().length > 1 && texto.trim().length > 20

  function enviar() {
    const lineas = [
      t({
        en: 'Recommendation for your portfolio:',
        es: 'Recomendación para tu portafolio:',
      }),
      '',
      `${t({ en: 'Name', es: 'Nombre' })}: ${nombre.trim()}`,
      `${t({ en: 'Role', es: 'Puesto' })}: ${puesto.trim()}`,
      empresa.trim() ? `${t({ en: 'Company', es: 'Empresa' })}: ${empresa.trim()}` : null,
      linkedin.trim() ? `LinkedIn: ${linkedin.trim()}` : null,
      `${t({ en: 'Language', es: 'Idioma' })}: ${idioma}`,
      '',
      texto.trim(),
    ].filter((linea) => linea !== null)

    // encodeURIComponent y no el constructor de URL: los saltos de línea
    // tienen que llegar como %0A o WhatsApp los aplana en un solo párrafo.
    window.open(
      `${contacto.whatsappUrl}?text=${encodeURIComponent(lineas.join('\n'))}`,
      '_blank',
      'noopener',
    )
  }

  const campo =
    'w-full rounded-xl border border-borde bg-lienzo px-4 py-2.5 text-sm text-tinta ' +
    'transition-colors placeholder:text-tenue focus:border-acento focus:outline-none'

  return (
    <section className="py-16 sm:py-20">
      <div className="contenedor">
        <p className="eyebrow">{t(ui.resenasEyebrow)}</p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {t(ui.recomendarTitulo)}
        </h1>
        <p className="mt-4 max-w-xl text-pretty leading-relaxed text-tenue">
          {t(ui.recomendarBajada)}
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <form
            className="space-y-4"
            onSubmit={(evento) => {
              evento.preventDefault()
              enviar()
            }}
          >
            <label className="block">
              <span className="eyebrow">{t({ en: 'Your name', es: 'Tu nombre' })}</span>
              <input
                type="text"
                name="nombre"
                required
                value={nombre}
                onChange={(evento) => setNombre(evento.target.value)}
                className={`${campo} mt-2`}
                placeholder={t({ en: 'Angeles Ramírez', es: 'Angeles Ramírez' })}
              />
            </label>

            <label className="block">
              <span className="eyebrow">{t({ en: 'Your role', es: 'Tu puesto' })}</span>
              <input
                type="text"
                name="puesto"
                required
                value={puesto}
                onChange={(evento) => setPuesto(evento.target.value)}
                className={`${campo} mt-2`}
                placeholder={t({ en: 'Tech Lead', es: 'Tech Lead' })}
              />
            </label>

            <label className="block">
              <span className="eyebrow">
                {t({ en: 'Company (optional)', es: 'Empresa (opcional)' })}
              </span>
              <input
                type="text"
                name="empresa"
                value={empresa}
                onChange={(evento) => setEmpresa(evento.target.value)}
                className={`${campo} mt-2`}
              />
            </label>

            <label className="block">
              <span className="eyebrow">
                {t({ en: 'LinkedIn (optional)', es: 'LinkedIn (opcional)' })}
              </span>
              <input
                type="url"
                name="linkedin"
                value={linkedin}
                onChange={(evento) => setLinkedin(evento.target.value)}
                className={`${campo} mt-2`}
                placeholder="https://linkedin.com/in/..."
              />
              <span className="mt-1.5 block text-xs text-tenue">
                {t({
                  en: 'A recommendation that can be traced to a real person carries far more weight.',
                  es: 'Una recomendación que se puede rastrear hasta una persona real pesa mucho más.',
                })}
              </span>
            </label>

            <label className="block">
              <span className="eyebrow">
                {t({ en: 'What would you say about Angel?', es: '¿Qué dirías de Angel?' })}
              </span>
              <textarea
                name="texto"
                required
                rows={6}
                maxLength={LIMITE_TEXTO}
                value={texto}
                onChange={(evento) => setTexto(evento.target.value)}
                className={`${campo} mt-2 resize-y`}
                placeholder={t({
                  en: 'What was it like working with him? What did he do well?',
                  es: '¿Cómo fue trabajar con él? ¿Qué hizo bien?',
                })}
              />
              <span className="mt-1.5 block text-right font-mono text-xs text-tenue">
                {texto.length} / {LIMITE_TEXTO}
              </span>
            </label>

            <button
              type="submit"
              disabled={!listo}
              className="inline-flex h-11 items-center rounded-full bg-acento px-6 text-sm font-medium text-lienzo transition-transform duration-200 hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              {t({ en: 'Send it by WhatsApp', es: 'Enviarlo por WhatsApp' })}
            </button>

            <p className="text-xs leading-relaxed text-tenue">
              {t(ui.recomendarNota)}
            </p>
          </form>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow">{t({ en: 'How it will look', es: 'Cómo se va a ver' })}</p>
            <div className="mt-4">
              <TarjetaResena resena={vistaPrevia} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
