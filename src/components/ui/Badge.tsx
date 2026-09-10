import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Badge({
  children,
  className,
  tone = 'default',
}: {
  children: ReactNode
  className?: string
  tone?: 'default' | 'accent' | 'custom'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium tracking-wide',
        tone === 'default' && 'border-white/10 bg-white/[0.04] text-titanium-400',
        tone === 'accent' && 'border-accent/30 bg-accent-soft text-[#7db4ff]',
        tone === 'custom' && 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300',
        className,
      )}
    >
      {children}
    </span>
  )
}
