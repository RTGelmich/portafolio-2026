import { useState } from 'react'

import { useIdioma } from '../../i18n/idioma'
import { Marco } from '../Marco'

/**
 * Lo que veía un visitante anónimo antes y después de encender row level
 * security en la tabla de perfiles.
 *
 * Las filas son inventadas. La consulta y el mensaje de error no: así responde
 * Postgres cuando una política bloquea la escritura.
 */

// Nombres y correos inventados, sin relación con personas ni dominios reales
// del cliente. Lo que se está enseñando es la consulta, no los datos.
const filas = [
  { id: 'e3a1…', nombre: 'Persona Ejemplo Uno', correo: 'ejemplo1@example.com', rol: 'cliente' },
  { id: '7b92…', nombre: 'Persona Ejemplo Dos', correo: 'ejemplo2@example.com', rol: 'cliente' },
  { id: 'c418…', nombre: 'Persona Ejemplo Tres', correo: 'ejemplo3@example.com', rol: 'admin' },
  { id: 'f5d7…', nombre: 'Persona Ejemplo Cuatro', correo: 'ejemplo4@example.com', rol: 'asesor' },
]

export default function Rls() {
  const { t } = useIdioma()
  const [protegido, setProtegido] = useState(false)

  return (
    <Marco
      titulo="psql · role = anon"
      pie={t({
        en: 'Rows are fabricated. The query and the error are what actually run.',
        es: 'Las filas son inventadas. La consulta y el error son los que corren de verdad.',
      })}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-md text-sm text-tenue">
          {t({
            en: 'Same anonymous API key, same query. The only difference is row level security.',
            es: 'La misma llave anónima, la misma consulta. La única diferencia es row level security.',
          })}
        </p>

        <button
          type="button"
          onClick={() => setProtegido((actual) => !actual)}
          aria-pressed={protegido}
          className={`inline-flex items-center gap-3 rounded-full border px-4 py-2 text-sm transition-colors ${
            protegido
              ? 'border-exito/50 bg-exito/10 text-exito'
              : 'border-alerta/50 bg-alerta/10 text-alerta'
          }`}
        >
          <span
            aria-hidden="true"
            className={`relative h-5 w-9 rounded-full transition-colors ${
              protegido ? 'bg-exito/40' : 'bg-alerta/40'
            }`}
          >
            <span
              className={`absolute top-0.5 size-4 rounded-full bg-current transition-transform duration-300 ${
                protegido ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </span>
          <span className="font-mono text-xs">RLS {protegido ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-borde bg-lienzo">
        <pre className="overflow-x-auto border-b border-borde px-4 py-3 font-mono text-xs text-tenue">
          <code>select id, nombre, correo, rol from profiles;</code>
        </pre>

        {protegido ? (
          <div className="px-4 py-8 text-center">
            <p className="font-mono text-sm text-exito">(0 rows)</p>
            <p className="mx-auto mt-2 max-w-xs text-xs text-tenue">
              {t({
                en: 'No policy grants anonymous read. Postgres does not error — it simply returns nothing.',
                es: 'Ninguna política da lectura anónima. Postgres no marca error — simplemente no devuelve nada.',
              })}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs">
              <thead>
                <tr className="border-b border-borde text-tenue">
                  <th scope="col" className="px-4 py-2 text-left font-normal">id</th>
                  <th scope="col" className="px-4 py-2 text-left font-normal">nombre</th>
                  <th scope="col" className="px-4 py-2 text-left font-normal">correo</th>
                  <th scope="col" className="px-4 py-2 text-left font-normal">rol</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((fila) => (
                  <tr key={fila.id} className="border-b border-borde/50 last:border-0">
                    <td className="px-4 py-2 text-tenue">{fila.id}</td>
                    <td className="px-4 py-2 text-tinta">{fila.nombre}</td>
                    <td className="px-4 py-2 text-tenue">{fila.correo}</td>
                    <td className="px-4 py-2 text-alerta">{fila.rol}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-borde px-4 py-2 font-mono text-xs text-alerta">
              ({filas.length} rows) —{' '}
              {t({ en: 'and every other client in the table', es: 'y todos los demás clientes de la tabla' })}
            </p>
          </div>
        )}
      </div>

      {/* La lectura ya es grave. La escalada de privilegios es el verdadero problema. */}
      <div className="mt-4 overflow-hidden rounded-xl border border-borde bg-lienzo">
        <pre className="overflow-x-auto border-b border-borde px-4 py-3 font-mono text-xs text-tenue">
          <code>update profiles set rol = 'admin' where id = auth.uid();</code>
        </pre>

        <p
          className={`px-4 py-3 font-mono text-xs ${protegido ? 'text-exito' : 'text-alerta'}`}
          aria-live="polite"
        >
          {protegido
            ? 'ERROR: new row violates row-level security policy for table "profiles"'
            : `UPDATE 1 — ${t({ en: 'you are now an administrator', es: 'ahora eres administrador' })}`}
        </p>
      </div>
    </Marco>
  )
}
