import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost' | 'outline' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-accent text-white shadow-[0_0_0_1px_rgba(61,139,255,0.4),0_8px_24px_rgba(61,139,255,0.25)] hover:bg-[#5a9bff] active:bg-[#2f7df0]',
  ghost:
    'text-zinc-300 hover:bg-white/5 hover:text-zinc-100 active:bg-white/10',
  outline:
    'border border-white/10 bg-white/[0.03] text-zinc-200 hover:border-white/20 hover:bg-white/[0.06] active:bg-white/[0.08]',
  danger:
    'border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 active:bg-red-500/25',
}

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-[15px]',
}

/** Tactile button — subtle press feedback via CSS scale, no layout shift. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'ghost', size = 'md', className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 rounded-xl font-medium',
        'transition-[transform,background-color,border-color,box-shadow] duration-150 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60',
        'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  )
})
