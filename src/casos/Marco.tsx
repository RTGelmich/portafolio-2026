import type { ReactNode } from 'react'

/** Chrome compartido de todos los widgets, para que se lean como una familia. */
export function Marco({
  titulo,
  children,
  pie,
}: {
  titulo: string
  children: ReactNode
  pie?: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-borde bg-superficie">
      <div className="flex items-center gap-2 border-b border-borde bg-superficie-alta px-4 py-2.5">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-borde" />
          <span className="size-2.5 rounded-full bg-borde" />
          <span className="size-2.5 rounded-full bg-borde" />
        </span>
        <span className="ml-1 font-mono text-xs text-tenue">{titulo}</span>
      </div>

      <div className="p-5 sm:p-6">{children}</div>

      {pie && (
        <div className="border-t border-borde bg-superficie-alta px-5 py-3 text-xs text-tenue sm:px-6">
          {pie}
        </div>
      )}
    </div>
  )
}
