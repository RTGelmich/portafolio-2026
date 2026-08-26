import { useMemo, useState } from 'react'

import { useIdioma } from '../../i18n/idioma'
import { Marco } from '../Marco'

/**
 * El hallazgo más caro de la migración: `decimal.Round` de C# usa redondeo
 * bancario (al par más cercano) y `Math.round` de JavaScript redondea .5 hacia
 * arriba. Nadie lo documenta y no truena nada — solo hace que los saldos
 * históricos dejen de cuadrar poco a poco.
 *
 * Todo se calcula en enteros (milésimas) a propósito: hacerlo en flotantes
 * introduciría un segundo error de redondeo encima del que queremos enseñar.
 */

const RECIBOS = 1000

/** Congruencial lineal: mismos recibos en cada visita, mismo resultado citable. */
function generador(semilla: number) {
  let estado = semilla
  return () => {
    estado = (estado * 1664525 + 1013904223) % 4294967296
    return estado / 4294967296
  }
}

/** Monto en milésimas -> centésimas, .5 siempre hacia arriba. */
function redondeoMitadArriba(milesimas: number): number {
  const cociente = Math.floor(milesimas / 10)
  const residuo = milesimas % 10
  return residuo >= 5 ? cociente + 1 : cociente
}

/** Monto en milésimas -> centésimas, .5 al par más cercano (lo que hace C#). */
function redondeoBancario(milesimas: number): number {
  const cociente = Math.floor(milesimas / 10)
  const residuo = milesimas % 10
  if (residuo > 5) return cociente + 1
  if (residuo < 5) return cociente
  return cociente % 2 === 0 ? cociente : cociente + 1
}

function generarRecibos(): number[] {
  const aleatorio = generador(20260820)

  return Array.from({ length: RECIBOS }, () => {
    const base = Math.floor(aleatorio() * 500_000) + 50_000 // 50.000 a 550.000 milésimas
    // La mitad de los recibos cae exactamente en .xx5, que es donde los dos
    // criterios discrepan. En facturación real esto pasa todo el tiempo porque
    // los precios por litro traen tres decimales.
    return aleatorio() < 0.5 ? Math.floor(base / 10) * 10 + 5 : base
  })
}

function pesos(centesimas: number, idioma: string): string {
  return new Intl.NumberFormat(idioma === 'es' ? 'es-MX' : 'en-US', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 2,
  }).format(centesimas / 100)
}

export default function Redondeo() {
  const { t, idioma } = useIdioma()
  const [montoTexto, setMontoTexto] = useState('1234.565')
  const [corridos, setCorridos] = useState(0)

  const recibos = useMemo(() => generarRecibos(), [])

  const acumulado = useMemo(() => {
    let arriba = 0
    let bancario = 0
    let discrepancias = 0

    for (let i = 0; i < corridos; i++) {
      const a = redondeoMitadArriba(recibos[i])
      const b = redondeoBancario(recibos[i])
      arriba += a
      bancario += b
      if (a !== b) discrepancias++
    }

    return { arriba, bancario, discrepancias }
  }, [recibos, corridos])

  // El input es texto para no pelear con el punto decimal mientras se escribe.
  const milesimas = useMemo(() => {
    const valor = Number.parseFloat(montoTexto)
    if (!Number.isFinite(valor)) return null
    return Math.round(valor * 1000)
  }, [montoTexto])

  const discrepa =
    milesimas !== null && redondeoMitadArriba(milesimas) !== redondeoBancario(milesimas)

  return (
    <Marco
      titulo="dominio/redondeo.test.ts"
      pie={t({
        en: `${RECIBOS} receipts, deterministic. Amounts carry three decimals because gas is priced per litre.`,
        es: `${RECIBOS} recibos, deterministas. Los montos traen tres decimales porque el gas se cobra por litro.`,
      })}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="eyebrow">{t({ en: 'One amount', es: 'Un monto' })}</p>

          <label className="mt-4 block">
            <span className="sr-only">{t({ en: 'Amount', es: 'Monto' })}</span>
            <input
              type="text"
              inputMode="decimal"
              value={montoTexto}
              onChange={(evento) => setMontoTexto(evento.target.value)}
              className="w-full rounded-xl border border-borde bg-lienzo px-4 py-3 font-mono text-lg text-tinta transition-colors focus:border-acento focus:outline-none"
            />
          </label>

          <p className="mt-2 text-xs text-tenue">
            {t({
              en: 'Try amounts ending in 5 on the third decimal: 1234.565, 10.005, 88.115',
              es: 'Prueba montos que terminen en 5 al tercer decimal: 1234.565, 10.005, 88.115',
            })}
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div
              className={`rounded-xl border px-4 py-3 ${
                discrepa ? 'border-alerta/40 bg-alerta/10' : 'border-borde'
              }`}
            >
              <p className="font-mono text-[11px] text-tenue">JavaScript · half up</p>
              <p className="mt-1 font-mono text-xl text-tinta">
                {milesimas === null ? '—' : pesos(redondeoMitadArriba(milesimas), idioma)}
              </p>
            </div>

            <div
              className={`rounded-xl border px-4 py-3 ${
                discrepa ? 'border-exito/40 bg-exito/10' : 'border-borde'
              }`}
            >
              <p className="font-mono text-[11px] text-tenue">C# · banker's</p>
              <p className="mt-1 font-mono text-xl text-tinta">
                {milesimas === null ? '—' : pesos(redondeoBancario(milesimas), idioma)}
              </p>
            </div>
          </div>

          {discrepa && (
            <p className="mt-3 text-sm text-alerta">
              {t({
                en: 'One cent apart. On one receipt nobody notices.',
                es: 'Un centavo de diferencia. En un recibo nadie lo nota.',
              })}
            </p>
          )}
        </div>

        <div>
          <p className="eyebrow">{t({ en: `${RECIBOS} receipts`, es: `${RECIBOS} recibos` })}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {[100, RECIBOS].map((cantidad) => (
              <button
                key={cantidad}
                type="button"
                onClick={() => setCorridos(cantidad)}
                className="rounded-full border border-borde px-4 py-2 text-sm text-tenue transition-colors hover:border-acento hover:text-tinta"
              >
                {t({ en: `Bill ${cantidad}`, es: `Facturar ${cantidad}` })}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCorridos(0)}
              className="rounded-full border border-transparent px-4 py-2 text-sm text-tenue transition-colors hover:text-tinta"
            >
              {t({ en: 'Reset', es: 'Reiniciar' })}
            </button>
          </div>

          <dl className="mt-6 space-y-3" aria-live="polite">
            <div className="flex items-baseline justify-between gap-4 border-b border-borde pb-3">
              <dt className="font-mono text-xs text-tenue">JavaScript · half up</dt>
              <dd className="font-mono text-lg text-tinta">{pesos(acumulado.arriba, idioma)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-b border-borde pb-3">
              <dt className="font-mono text-xs text-tenue">C# · banker's</dt>
              <dd className="font-mono text-lg text-tinta">{pesos(acumulado.bancario, idioma)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 pt-1">
              <dt className="text-sm font-medium text-tinta">
                {t({ en: 'Drift', es: 'Descuadre' })}
              </dt>
              <dd
                className={`font-mono text-2xl ${
                  acumulado.arriba === acumulado.bancario ? 'text-tenue' : 'text-alerta'
                }`}
              >
                {pesos(acumulado.arriba - acumulado.bancario, idioma)}
              </dd>
            </div>
          </dl>

          <p className="mt-4 text-sm leading-relaxed text-tenue">
            {corridos === 0
              ? t({
                  en: 'Bill a batch and watch the two totals separate.',
                  es: 'Factura un lote y mira cómo se separan los dos totales.',
                })
              : t({
                  en: `${acumulado.discrepancias} of ${corridos} receipts landed exactly on the tie. Every one of them is a cent the reconciliation has to explain.`,
                  es: `${acumulado.discrepancias} de ${corridos} recibos cayeron justo en el empate. Cada uno es un centavo que la reconciliación tiene que explicar.`,
                })}
          </p>
        </div>
      </div>
    </Marco>
  )
}
