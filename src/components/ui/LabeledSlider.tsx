import { cn } from '@/lib/utils'

/** A labelled range control with value readout and optional hint. */
export function LabeledSlider({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
  format,
  hint,
  leftLabel,
  rightLabel,
  className,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (v: number) => void
  format?: (v: number) => string
  hint?: string
  leftLabel?: string
  rightLabel?: string
  className?: string
}) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between">
        <label className="text-[13px] font-medium text-zinc-200">{label}</label>
        <span className="font-mono text-xs text-titanium-400">
          {format ? format(value) : value.toFixed(2)}
        </span>
      </div>
      <div className="relative">
        {/* Accent fill drawn under the native track */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2">
          <div className="h-full overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative w-full"
          aria-label={label}
        />
      </div>
      {(leftLabel || rightLabel || hint) && (
        <div className="flex items-center justify-between text-[11px] text-titanium-500">
          <span>{leftLabel}</span>
          {hint ? <span className="text-titanium-400/70 italic">{hint}</span> : null}
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  )
}
