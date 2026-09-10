import { useId, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Lightweight CSS-only tooltip (visible on hover/focus). */
export function Tooltip({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  const [show, setShow] = useState(false)
  const id = useId()

  return (
    <span
      className={cn('relative inline-flex', className)}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span
        aria-describedby={id}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="inline-flex"
      >
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        className={cn(
          'pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-obsidian-800 px-2.5 py-1.5 text-xs text-zinc-300 shadow-lg transition-opacity duration-150',
          show ? 'opacity-100' : 'opacity-0',
        )}
      >
        {label}
      </span>
    </span>
  )
}
